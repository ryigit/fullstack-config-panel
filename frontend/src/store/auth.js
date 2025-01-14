import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    localStorage.setItem("firebaseToken", token);
    localStorage.setItem("firebaseUser", JSON.stringify(userCredential.user));

    return userCredential.user;
  } catch (error) {
    throw error.message;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error.message;
  }
};
