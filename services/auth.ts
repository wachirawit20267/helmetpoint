import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/contexts/AppContext";

export async function registerUser(
  profile: UserProfile & { password?: string }
) {
  if (!profile.email || !profile.password) {
    throw new Error("Missing email or password");
  }

  // 1. Create Firebase Auth credential (this must succeed)
  const credential = await createUserWithEmailAndPassword(
    auth,
    profile.email,
    profile.password
  );

  const userDoc = {
    uid: credential.user.uid,
    firstName: profile.firstName,
    lastName: profile.lastName,
    birthday: profile.birthday,
    career: profile.career,
    email: profile.email,
    phone: profile.phone,
    helmetId: "", 
    photoURL: "", 
    points: 100, 
    safetyScore: 100,
    distance: 0,
    createdAt: new Date().toISOString(),
  };

  // 2. Write profile to Firestore with a 3.5s timeout fallback.
  // Save to LocalStorage immediately so that the front-end has the data instantly.
  if (typeof window !== "undefined") {
    localStorage.setItem("user_profile", JSON.stringify(userDoc));
  }

  try {
    const firestoreWrite = setDoc(doc(db, "users", credential.user.uid), userDoc);
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("firestore-timeout")), 3500)
    );
    await Promise.race([firestoreWrite, timeout]);
  } catch (err) {
    console.warn("Firestore write delayed or offline, relying on local cache:", err);
  }

  return { user: credential.user, profile: userDoc };
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const docRef = doc(db, "users", credential.user.uid);
  
  // Fetch user profile directly
  const snap = await getDoc(docRef);
  let profileData: any = null;
  if (snap.exists()) {
    profileData = snap.data();
  }

  if (profileData) {
    return { user: credential.user, profile: profileData as UserProfile };
  }
  
  return { 
    user: credential.user, 
    profile: {
      firstName: "User",
      lastName: "",
      email: credential.user.email || email,
      phone: "",
      birthday: "",
      career: "Other",
      helmetId: "",
      photoURL: "",
      points: 100,
      safetyScore: 100,
    } 
  };
}

export async function logoutUser() {
  await signOut(auth);
}