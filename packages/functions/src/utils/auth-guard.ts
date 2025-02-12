import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "express";
import { CallableRequest, HttpsError } from "firebase-functions/https";

async function onRequestAuthGuard(req: Request, res: Response) {
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

async function onCallAuthGuard(request: CallableRequest) {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be authenticated to call this function",
    );
  }
  return request.auth.uid;
}

export { onRequestAuthGuard, onCallAuthGuard };
