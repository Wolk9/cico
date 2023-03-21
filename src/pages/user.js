import React, { useEffect, useState } from "react";

// Firebase imports
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// PrimeReact imports
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

// helper imports
import { date } from "../components/helpers";

export const User = (props) => {
  const { user } = props;
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [ageValue, setAgeValue] = useState(0);
  const [contractValue, setContractValue] = useState({});
  const [newUser, setNewUser] = useState(false);

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

  // useEffect(() => {
  //   const result = userList.find((x) => {
  //     console.log(x.authIDs);
  //     const result = x.authIDs.find((y) => y === user.uid);
  //     console.log(result);
  //     return result;
  //   });
  //   console.log(result);

  //   if (result === undefined) {
  //     setNewUser(true);
  //   } else {
  //     setNewUser(false);
  //   }

  //   setCurrentUser(result);
  // }, [userList, user.uid]);

  console.log("new user?", newUser);
  console.log(currentUser);

  useEffect(() => {
    setFirstNameValue(currentUser?.firstName);
    setLastNameValue(currentUser?.lastName);
    setAgeValue(currentUser?.age);
    setContractValue(currentUser?.contractDate);
    console.log("useEffect currentUser");
  }, [currentUser]);

  console.log(contractValue);

  const contractDate = date(contractValue);

  console.log(contractDate);

  const footer = <Button>Save</Button>;

  return (
    <div>
      {currentUser && (
        <Card
          title={`${currentUser?.firstName} ${currentUser?.lastName}'s profile`}
          subTitle={user.uid}
          footer={footer}
        >
          <div className="flex flex-column gap-2">
            <label htmlFor="email">Email and loginname</label>
            <InputText
              value={user.email}
              disabled
              // onChange={(e) => setEmailValue(e.target.value)}
              id="email"
              aria-describedby="email-help"
            />
            <small id="email-help">
              your email is your login and can't be changed
            </small>
            <label htmlFor="firstname">First name</label>
            <InputText
              value={firstNameValue}
              onChange={(e) => setFirstNameValue(e.target.value)}
              id="firstName"
              aria-describedby="firstname-help"
            />
            <small id="lastname-help">Enter your first name</small>

            <label htmlFor="firstname">Last name</label>
            <InputText
              value={lastNameValue}
              onChange={(e) => setLastNameValue(e.target.value)}
              id="lastName"
              aria-describedby="lastname-help"
            />
            <small id="lastname-help">Enter your last name</small>
            <InputNumber
              value={ageValue}
              id="age"
              aria-describedby="age-help"
              onChange={(e) => setAgeValue(e.value)}
              showButtons
              buttonLayout="horizontal"
              step={1}
              decrementButtonClassName="p-button-danger"
              incrementButtonClassName="p-button-success"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
            <small id="age-help">Enter your age</small>
            <Calendar value={contractDate} />
          </div>
        </Card>
      )}
    </div>
  );
};
