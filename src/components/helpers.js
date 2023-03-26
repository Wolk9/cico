import moment from "moment";
import "moment/locale/nl";
import { db } from "../config/firebase";
import { signOut } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../config/firebase";

export const date = (unixTime) => {
  //console.log(unixTime);
  const { seconds, nanoseconds } = unixTime;
  //console.log(unixTime, seconds, nanoseconds);
  const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  const formatedDate = Date.format("ddd DD-MM");

  //console.log(formatedDate);
  return formatedDate;
};

export const time = (unixTime) => {
  //console.log(unixTime);
  const { seconds, nanoseconds } = unixTime;
  //console.log(unixTime, seconds, nanoseconds);
  const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  const formatedTime = Date.format("HH:mm");

  //console.log(formatedTime);
  return formatedTime;
};

export const difference = (startUnixTime, endUnixTime) => {
  const startSeconds = startUnixTime.seconds;
  const startMilliseconds = startUnixTime.nanoseconds / 1000000;
  const endSeconds = endUnixTime.seconds;
  const endMilliseconds = endUnixTime.nanoseconds / 1000000;

  const diffInMilliseconds =
    endSeconds * 1000 +
    endMilliseconds -
    (startSeconds * 1000 + startMilliseconds);
  const diffInMinutes = diffInMilliseconds / 60000;

  const formattedTime = moment.utc(diffInMinutes * 60000).format("HH:mm");
  return formattedTime;
};

export const setRole = (uid2makeAdmin, role) => {
  console.log("makeAdmin");

  const usersRef = collection(db, "users");

  setDoc(doc(usersRef, uid2makeAdmin), { role })
    .then(() => {
      console.log("User role added to Firestore successfully");
    })
    .catch((error) => {
      console.error("Error adding user role to Firestore:", error);
    });
};

export const checkUserRole = async (uid) => {
  const usersRef = collection(db, "users");

  const userDoc = await getDoc(doc(usersRef, uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    if (userData.role === "admin") {
      console.log("User has admin role");
    } else {
      console.log("User does not have admin role");
    }
    return userData;
  } else {
    console.log("User not found");
  }
};

export const getUserData = async (uid) => {
  const usersRef = collection(db, "users");

  const userDoc = await getDoc(doc(usersRef, uid));
  const userData = userDoc.data();
  //console.log(userData);
  return userData;
};

export const signOutUser = async () => {
  console.log("signOutUser");
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
};
