import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const redirect = functions.https.onRequest(async (req, res) => {
  const shortCode = req.path.replace("/", ""); // get code from URL
  if (!shortCode) {
    res.status(400).send("Short code missing");
    return;
  }

  try {
    const snapshot = await db
      .collection("shortUrls")
      .where("shortCode", "==", shortCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(404).send("URL not found");
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Optional: increment clicks
    await doc.ref.update({ clicks: (data.clicks || 0) + 1 });

    // Redirect
    res.redirect(data.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
 