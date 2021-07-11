import firebaseAdmin from 'firebase-admin';

if (!firebaseAdmin.apps.length && firebaseAdmin.app.name !== 'Admin') {
  firebaseAdmin.initializeApp(
    {
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    },
    'Admin'
  );
}

export const admin = firebaseAdmin;

export const validate = async (token: string) => {
  const decodedToken = await admin.auth().verifyIdToken(token, true);
  if (decodedToken) {
    const user = await admin.auth().getUser(decodedToken.uid);
    const result = {
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.customClaims?.role,
        token: token,
        isAuthenticated: true,
      },
    };
    return result;
  }
};
