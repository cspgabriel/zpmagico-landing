import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { verifyPassword } from "./password";
import { z } from "zod";

// =============================================================================
// Extensões de tipo — adicionar `role` e `tenantId` à session
// =============================================================================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CLIENT";
      tenantId: string;
      tenantSlug: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: "ADMIN" | "CLIENT";
    tenantId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "CLIENT";
    tenantId?: string;
    tenantSlug?: string;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// =============================================================================
// NextAuth config
// =============================================================================
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 /* 7 dias */ },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: { tenant: true },
        });

        if (!user || !user.passwordHash) return null;
        if (user.tenant.status === "SUSPENDED" || user.tenant.status === "CANCELED") return null;

        const ok = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        // Audit log
        await prisma.auditLog.create({
          data: {
            tenantId: user.tenantId,
            userId: user.id,
            action: "user.login",
            targetType: "User",
            targetId: user.id,
          },
        }).catch(() => {}); // não bloqueia login se audit falhar

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
        // busca slug do tenant
        const tenant = await prisma.tenant.findUnique({
          where: { id: token.tenantId! },
          select: { slug: true },
        });
        token.tenantSlug = tenant?.slug ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CLIENT";
        session.user.tenantId = token.tenantId as string;
        session.user.tenantSlug = token.tenantSlug as string;
      }
      return session;
    },
  },
});