import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
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
import { current } from "@reduxjs/toolkit";
import { Button } from "primereact/button";

export const User = (props) => {
  const { user = "" } = props;
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [ageValue, setAgeValue] = useState(0);

  const usersRef = collection(db, "users");

  console.log(user);
  console.log(
    "firstName: ",
    firstNameValue,
    "lastName: ",
    lastNameValue,
    "email: ",
    emailValue,
    "Age: ",
    ageValue
  );

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const data = await getDocs(usersRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setUserList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getUsersList();
  }, []);

  console.log(userList);
  console.log(user.uid);

  useEffect(() => {
    const result = userList.find((x) => {
      console.log(x.authIDs);
      const result = x.authIDs.find((y) => y === user.uid);
      console.log(result);
      return result;
    });
    console.log(result);

    setCurrentUser(result);
    setFirstNameValue(result?.firstName);
    setLastNameValue(result?.lastName);
    setEmailValue(user.email);
  }, [userList]);

  if (firstNameValue === undefined) {
    setFirstNameValue("new");
    setLastNameValue("user");
  }
  if (currentUser === undefined) {
    setCurrentUser({
      firstName: firstNameValue,
      lastName: lastNameValue,
      age: ageValue,
      email: emailValue,
    });
  }
  console.log(currentUser);

  return (
    <div>
      {" "}
      {currentUser && (
        <Card
          title={`${currentUser?.firstName} ${currentUser?.lastName}'s profile`}
        >
          <div className="flex flex-column gap-2">
            <label htmlFor="firstname">First name</label>
            <InputText
              value={firstNameValue}
              onChange={(e) => setFirstNameValue(e.target.value)}
              id="firstName"
              aria-describedby="firstname-help"
            />
            <small id="lastname-help">Enter your last name</small>
            <label htmlFor="firstname">Last name</label>
            <InputText
              value={lastNameValue}
              onChange={(e) => setLastNameValue(e.target.value)}
              id="lastName"
              aria-describedby="lastname-help"
            />
            <small id="lastname-help">Enter your first name</small>
            <label htmlFor="email">Email</label>
            <InputText
              value={emailValue}
              disabled
              // onChange={(e) => setEmailValue(e.target.value)}
              id="email"
              aria-describedby="email-help"
            />
            <small id="email-help">
              your email is your login and can't be changed
            </small>
          </div>
          <Button>Save</Button>
          {user.uid}
        </Card>
      )}
    </div>
  );
};

