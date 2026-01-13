import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const redirect = onRequest(async (req, res) => {
  try {
    const shortCode = req.path.replace("/", "");

    if (!shortCode) {
      res.status(400).send("Missing short code");
      return;
    }

    const docRef = db.collection("shortUrls").doc(shortCode);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).send("Short URL not found");
      return;
    }

    const data = docSnap.data();
    const originalUrl = data?.originalUrl;

    if (!originalUrl) {
      res.status(500).send("Invalid URL data");
      return;
    }

    await docRef.update({
      clicks: admin.firestore.FieldValue.increment(1)
    });

    res.redirect(302, originalUrl);
  } catch (error) {
    logger.error("Redirect error", error);
    res.status(500).send("Server error");
  }
});

