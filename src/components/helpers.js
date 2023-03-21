import React from "react";
import moment from "moment";
import { db } from "../config/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export const date = (unixTime) => {
  console.log(unixTime);
  const { seconds, nanoseconds } = unixTime;
  console.log(unixTime, seconds, nanoseconds);
  const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  const formatedDate = Date.format("DD-MM-YYYY");

  console.log(formatedDate);
  return formatedDate;
};

export const time = (unixTime) => {
  console.log(unixTime);
  const { seconds, nanoseconds } = unixTime;
  console.log(unixTime, seconds, nanoseconds);
  const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  const formatedTime = Date.format("HH:mm:ss");

  console.log(formatedTime);
  return formatedTime;
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
  } else {
    console.log("User not found");
  }
};