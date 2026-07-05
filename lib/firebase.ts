   import { initializeApp } from "firebase/app";
   import { getAuth, GoogleAuthProvider } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "AIzaSyBs9NueqFmB3Mb4t7tTkteom_8M4I3hwyo",
     authDomain: "resume-builder-3c29b.firebaseapp.com",
     projectId: "resume-builder-3c29b",
     storageBucket: "resume-builder-3c29b.firebasestorage.app",
     messagingSenderId: "484170363762",
     appId: "1:484170363762:web:4e59a7a47eb6b0bd15e3eb"
   };

   const app = initializeApp(firebaseConfig);

   export const auth = getAuth(app);
   export const googleProvider = new GoogleAuthProvider();
   export const db = getFirestore(app);