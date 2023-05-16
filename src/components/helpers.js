import moment from "moment";
import "moment/locale/nl";
import { db } from "../config/firebase";
import { signOut } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../config/firebase";

class DateFormatter {
  static formatDate(unixTime) {
    const { seconds, nanoseconds } = unixTime;
    const Date = moment
      .unix(seconds)
      .add(nanoseconds / 1000000, "milliseconds");
    return Date.format("ddd DD-MM");
  }

  static formatTime(unixTime) {
    const { seconds, nanoseconds } = unixTime;
    const Date = moment
      .unix(seconds)
      .add(nanoseconds / 1000000, "milliseconds");
    return Date.format("HH:mm");
  }
}

class TimeDifferenceCalculator {
  static calculateDifference(startUnixTime, endUnixTime) {
    const startSeconds = startUnixTime.seconds;
    const startMilliseconds = startUnixTime.nanoseconds / 1000000;
    const endSeconds = endUnixTime.seconds;
    const endMilliseconds = endUnixTime.nanoseconds / 1000000;

    const diffInMilliseconds =
      endSeconds * 1000 +
      endMilliseconds -
      (startSeconds * 1000 + startMilliseconds);
    const diffInMinutes = diffInMilliseconds / 60000;
    return moment.utc(diffInMinutes * 60000).format("HH:mm");
  }
}

class UserUtils {
  static setRole(uid2makeAdmin, role) {
    console.log("makeAdmin");

    const usersRef = collection(db, "users");

    setDoc(doc(usersRef, uid2makeAdmin), { role })
      .then(() => {
        console.log("User role added to Firestore successfully");
      })
      .catch((error) => {
        console.error("Error adding user role to Firestore:", error);
      });
  }

  static async checkUserRole(uid) {
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
  }

  static async getUserData(uid) {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    const userData = userDoc.data();
    return userData;
  }

  static async signOutUser() {
    console.log("signOutUser");
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }
}

export { DateFormatter, TimeDifferenceCalculator, UserUtils };
