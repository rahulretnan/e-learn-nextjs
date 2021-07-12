import { notification } from 'antd';
import firebase from 'firebase/app';
import 'firebase/auth';
import jwtDecode from 'jwt-decode';

if (!firebase.apps.length) {
  console.log('Hello client');
  firebase.initializeApp({
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  });
}

export const firebaseAuth = firebase.auth();

export const login = async (email: string, password: string) => {
  try {
    const user = await firebaseAuth.signInWithEmailAndPassword(email, password);
    if (user) return true;
  } catch (e) {
    return e;
  }
};

export const currentAccount = async () => {
  let userLoaded = false;
  function getCurrentUser(auth: firebase.auth.Auth) {
    return new Promise((resolve, reject) => {
      if (userLoaded) {
        resolve(firebaseAuth.currentUser);
      }
      const unsubscribe = auth.onAuthStateChanged((user) => {
        userLoaded = true;
        unsubscribe();
        const getUserData = async () => {
          if (user) {
            const userFields = await user.getIdToken(true).then((token) => {
              const {
                name,
                user_id,
                email,
                email_verified,
                phone_number,
                role,
              } = jwtDecode<any>(token);

              return {
                user_id,
                name,
                email,
                email_verified,
                role,
                token,
                phone: phone_number,
              };
            });
            return userFields;
          }
          return user;
        };
        resolve(getUserData());
      }, reject);
    });
  }
  return getCurrentUser(firebaseAuth);
};

export const logout = async () => await firebaseAuth.signOut();

export async function forgotPassword(email: string) {
  try {
    await firebaseAuth.sendPasswordResetEmail(email);

    return true;
  } catch (e) {
    notification.error({
      message: null,
      description: e.message,
    });

    return false;
  }
}

/**
 * Validate the code sent in password reset mail
 *
 * @param code - oobCode for validating password reset
 * @returns [status, errorCode]
 */
export async function verifyPasswordResetCode(code: string) {
  try {
    await firebaseAuth.verifyPasswordResetCode(code);

    return [true, null];
  } catch (err) {
    return [null, err.code];
  }
}

/**
 * Reset a user's password after receiving a password reset email
 *
 * @param code - oobCode for validating password reset
 * @param password - New Password
 * @returns [status, errorCode]
 */
export async function changePassword(code: string, password: string) {
  try {
    await firebaseAuth.confirmPasswordReset(code, password);

    return [true, null];
  } catch (err) {
    return [null, err.code];
  }
}
