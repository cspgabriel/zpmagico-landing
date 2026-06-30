import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [totalContacts, totalMessages, totalInstances, activeInstances] =
    await Promise.all([
      prisma.contact.count().catch(() => 0),
      prisma.chatMessage.count().catch(() => 0),
      prisma.whatsAppInstance.count().catch(() => 0),
      prisma.whatsAppInstance
        .count({ where: { connectionStatus: "connected" } })
        .catch(() => 0),
    ]);

  return NextResponse.json({
    totalContacts,
    totalMessages,
    totalInstances,
    activeInstances,
  });
}
