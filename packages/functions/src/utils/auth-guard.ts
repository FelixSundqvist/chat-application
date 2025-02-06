import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "express";

async function authGuard(req: Request, res: Response) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "No ID token provided.",
    );
  }

  try {
    return admin.auth().verifyIdToken(idToken);
  } catch (error) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Invalid ID token.",
    );
  }
}

export default authGuard;
