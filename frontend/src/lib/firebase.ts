import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "whatsnextup-d2415.firebaseapp.com",
  projectId: "whatsnextup-d2415",
  storageBucket: "whatsnextup-d2415.appspot.com",
  messagingSenderId: "1131558210866753829",
  appId: "1:1131558210866753829:web:abc123def456",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const getFirebaseAuth = () => auth
