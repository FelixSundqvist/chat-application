import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/https";
import validator from "validator";
import { db } from "../config";
import { onCallAuthGuard } from "../utils/auth-guard";
import { sanitize } from "../utils/sanitize";

export const createChatRoom = onCall<{
  name: string;
  invitedEmails: string[];
}>({ enforceAppCheck: true }, async (request, response) => {
  const userId = await onCallAuthGuard(request);
  const { invitedEmails, name } = request.data;
  const sanitizedName = sanitize(name);

  for (const email of invitedEmails) {
    if (!validator.isEmail(email)) {
      throw new HttpsError("invalid-argument", "Invalid email address.");
    }
  }

  return createChatRoomAndAddUsers({
    name: sanitizedName,
    currentUserId: userId,
    invitedEmails,
  });
});

async function createChatRoomAndAddUsers({
  name,
  currentUserId,
  invitedEmails,
}: {
  name: string;
  currentUserId: string;
  invitedEmails: string[];
}) {
  const invitedUserCollection = await db
    .collection("users")
    .where("email", "in", invitedEmails)
    .get();

  let invitedUserIds: string[] = [];

  const registeredEmailsSet = new Set<string>();

  invitedUserCollection.docs.forEach((user) => {
    invitedUserIds.push(user.id);
    registeredEmailsSet.add(user.data().email);
  });

  const unregisteredUserEmails = invitedEmails.filter(
    (email) => !registeredEmailsSet.has(email),
  );

  try {
    return db.runTransaction(async (transaction) => {
      const roomRef = db.collection("rooms").doc();
      const roomId = roomRef.id;
      const userRoomsCollection = db.collection("userRooms");
      const userIdsToAdd = [currentUserId, ...invitedUserIds];
      const { userRoomDocs, invitedUserDocs } = await readTransactionData(
        transaction,
        userRoomsCollection,
        userIdsToAdd,
        unregisteredUserEmails,
      );

      // Step 1: Create the room itself
      transaction.set(roomRef, {
        name,
        createdBy: currentUserId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        userIds: userIdsToAdd,
      });

      // Step 2: Update the `userRooms` collection for all users
      userIdsToAdd.forEach((userId, index) => {
        const userRoomDocRef = userRoomsCollection.doc(userId);
        const userRoomDoc = userRoomDocs[index];

        if (!userRoomDoc.exists) {
          transaction.set(userRoomDocRef, { rooms: [roomId] });
        } else {
          transaction.update(userRoomDocRef, {
            rooms: admin.firestore.FieldValue.arrayUnion(roomId),
          });
        }
      });

      // Step 3: Update the `invitedUsers` collection for unregistered emails
      invitedUserDocs.forEach(({ email, docRef, docSnapshot }) => {
        const invitedUserInput = {
          roomId,
          invitedBy: currentUserId,
        };

        if (!docSnapshot.exists) {
          transaction.set(docRef, {
            email,
            rooms: [invitedUserInput],
          });
        } else {
          transaction.update(docRef, {
            rooms: admin.firestore.FieldValue.arrayUnion(invitedUserInput),
          });
        }
      });

      return roomId;
    });
  } catch (error) {
    logger.error("Transaction failed: ", error);
    throw error;
  }
}

async function readTransactionData(
  transaction: FirebaseFirestore.Transaction,
  userRoomsCollection: FirebaseFirestore.CollectionReference,
  userIdsToAdd: string[],
  unregisteredUserEmails: string[],
) {
  const userRoomDocs: FirebaseFirestore.DocumentSnapshot[] = await Promise.all(
    userIdsToAdd.map((userId) =>
      transaction.get(userRoomsCollection.doc(userId)),
    ),
  );

  const invitedUserDocs: {
    email: string;
    docRef: FirebaseFirestore.DocumentReference;
    docSnapshot: FirebaseFirestore.DocumentSnapshot;
  }[] = await Promise.all(
    unregisteredUserEmails.map(async (email) => {
      const invitedUserQuerySnapshot = await db
        .collection("invitedUsers")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!invitedUserQuerySnapshot.empty) {
        // Existing document for invited user
        const invitedUserDocRef = invitedUserQuerySnapshot.docs[0].ref;
        const invitedUserDocSnapshot = await transaction.get(invitedUserDocRef);
        return {
          email,
          docRef: invitedUserDocRef,
          docSnapshot: invitedUserDocSnapshot,
        };
      } else {
        // Create a new reference for the invited user document
        const newDocRef = db.collection("invitedUsers").doc();
        const emptyDocSnapshot = await transaction.get(newDocRef);
        return { email, docRef: newDocRef, docSnapshot: emptyDocSnapshot };
      }
    }),
  );

  return {
    userRoomDocs,
    invitedUserDocs,
  };
}
