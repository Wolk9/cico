import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const User = (props) => {
  const { user = "" } = props;

  console.log(user);

  useEffect(() => {
    const usersRef = collection(db, "users");
    console.log(usersRef);
    const q = query(usersRef, where("authIDs", "array-contains", user.uid));
    console.log(q);

    const result = getDocs(q);
    console.log(result);
  }, []);

  return (
    <div>
      {" "}
      <Card title={`${user.email} profile`}>{user.uid}</Card>
    </div>
  );
};
