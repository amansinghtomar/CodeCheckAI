import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

export const useAuthFunctions = () => {
   const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);

   const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

   const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

   const logout = () => signOut(auth);

   return { signup, login, loginWithGoogle, logout };
};
