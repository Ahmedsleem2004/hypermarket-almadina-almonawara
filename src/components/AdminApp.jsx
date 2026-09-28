import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebase";
import app from "../firebase";
import Login from "./Login";
import Dashboard from "./Dashboard";

const db = getFirestore(app);

function AdminApp() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAllowed(false);
        setChecking(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await signOut(auth);
          setUser(null);
          setAllowed(false);
          setChecking(false);
          return;
        }

        const userData = userSnap.data();

        if (
          userData.role === "owner" ||
          userData.role === "admin"
        ) {
          setUser(currentUser);
          setAllowed(true);
        } else {
          await signOut(auth);
          setUser(null);
          setAllowed(false);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setChecking(true);
  };

  if (checking) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-gray-100"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

          <p className="text-sm font-bold text-gray-600">
            جاري التحقق...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !allowed) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard />;
}

export default AdminApp;