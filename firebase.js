// firebase.js
// Shared Firebase initialization and helpers (ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Your Firebase config (use the config you gave earlier)
const firebaseConfig = {
  apiKey: "AIzaSyCI8MBk2m5M9smbjiKwMb3_TDAD-x_eIys",
  authDomain: "muscleup-cfcdd.firebaseapp.com",
  projectId: "muscleup-cfcdd",
  storageBucket: "muscleup-cfcdd.firebasestorage.app",
  messagingSenderId: "164105980592",
  appId: "1:164105980592:web:0675b84e9b9e349d48c975",
  measurementId: "G-HVRMZFH1JC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper: map username -> auth email
function unameToEmail(uname) {
  return `${uname.toLowerCase()}@muscleup.com`;
}

// Create user in Auth and a Firestore profile (used by owner when creating trainers/customers)
async function ownerCreateUser({ username, role, profile, tempPassword = null }) {
  // create auth user with a random password if not provided
  const email = unameToEmail(username);
  const password = tempPassword || ('Temp#' + Math.floor(1000 + Math.random() * 9000));
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  const docRef = doc(db, "users", uid);
  const profileDoc = {
    username,
    role,
    createdAt: serverTimestamp(),
    branch: profile.branch || "",
    // merge fields of profile (name, phone, address, metrics, etc.)
    ...profile
  };
  await setDoc(docRef, profileDoc);
  return { uid, email, password };
}

// Fetch user profile by uid
async function getUserProfile(uid) {
  const d = await getDoc(doc(db, "users", uid));
  return d.exists() ? d.data() : null;
}

// Find user by username (code)
async function findUserByUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, data: snap.docs[0].data() };
}

// Upload file to Storage and return URL
async function uploadFile(path, file) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export {
  app, auth, db, storage,
  unameToEmail,
  signInWithEmailAndPassword, sendPasswordResetEmail, signOut,
  ownerCreateUser, getUserProfile, findUserByUsername,
  uploadFile, doc, setDoc, getDoc, collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp
};
