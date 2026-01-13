// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
// import { db } from "../services/firebase"

// const RedirectPage = () => {
//   const { shortCode } = useParams<{ shortCode: string }>();

//   useEffect(() => {
//     const redirect = async () => {
//       if (!shortCode) return;

//       const docRef = doc(db, "shortUrls", shortCode);
//       const snap = await getDoc(docRef);

//       if (!snap.exists()) {
//         alert("Short URL not found");
//         return;
//       }

//       const data = snap.data();

//       await updateDoc(docRef, {
//         clicks: increment(1),
//       });

//       window.location.replace(data.originalUrl);
//     };

//     redirect();
//   }, [shortCode]);

//   return <p>Redirecting...</p>;
// };

// export default RedirectPage;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import LoadingSpinner from "../components/LoadingSpinner";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      if (!shortCode) {
        navigate("/404", { replace: true });
        return;
      }

      try {
        const docRef = doc(db, "shortUrls", shortCode);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          navigate("/404", { replace: true });
          return;
        }

        const data = snap.data();

        await updateDoc(docRef, {
          clicks: increment(1),
        });

        window.location.replace(data.originalUrl);
      } catch (error) {
        console.error("Redirect error:", error);
        navigate("/404", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    redirect();
  }, [shortCode, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return null;
};

export default RedirectPage;
