import { getAuth as getAdminAuth, type DecodedIdToken } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

function initAdmin() {
  if (getApps().length > 0) return;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      projectId: "agenciar-10ebd",
    });
  } else {
    initializeApp({ projectId: "agenciar-10ebd" });
  }
}

function getAdmin() {
  initAdmin();
  return getAdminAuth();
}

export async function verifyFirebaseToken(idToken: string): Promise<DecodedIdToken> {
  try {
    const auth = getAdmin();
    return await auth.verifyIdToken(idToken);
  } catch {
    throw new Error("Falha ao verificar token Firebase. Configure FIREBASE_SERVICE_ACCOUNT_KEY no .env");
  }
}
