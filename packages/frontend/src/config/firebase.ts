import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  database: import.meta.env.VITE_FIREBASE_DATABASE as string,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const functions = getFunctions(app);

if (import.meta.env.MODE === "development") {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectDatabaseEmulator(database, "localhost", 9000);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export { app, auth, database, functions };
