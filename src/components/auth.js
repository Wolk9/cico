
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { auth, googleProvider, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import { Input } from "@mui/material";

export const Auth = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  console.log("Auth, showSignUp:", showSignUp);

  console.log(auth?.currentUser?.email);

  return (
    <div>
      {!showSignUp ? (
        <Card title="Sign In" subTitle="You've been here before">
          <SignInDialog setShowSignUp={setShowSignUp} />
        </Card>
      ) : (
        <Card title="Sign Up" subTitle="You've never been here before">
          <SignUpDialog setShowSignUp={setShowSignUp} />
        </Card>
      )}
    </div>
  );
};

const SignInDialog = (props) => {
  const { setShowSignUp } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log("SignInDialog");

  const signInUser = async () => {
    console.log("signInUser");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };

  // const signInWithGoogle = async () => {
  //   console.log("signInWithGoogle");
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
          <InputText
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi pi-question"></i>
          <Password
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </span>
      </div>
      <div className="flex align-items-center justify-content-center font-bold text-white m-2 px-1 py-1 border-round">
        <Button label="SignIn" onClick={signInUser} />
      </div>
      <div className="flex align-items-center justify-content-center font-bold text-white m-2 px-1 py-1 border-round">
        <Button
          label="not a user yet?"
          onClick={() => setShowSignUp(true)}
          link
        />
      </div>
    </>
  );
};

const SignUpDialog = (props) => {
  const { setShowSignUp } = props;
  // const [visible, setVisible] = useState(false);
  // const [error, setError] = useState([]);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerValue, setRegisterValue] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerAge, setRegisterAge] = useState(0);
  const [registerHoursPerWeek, setRegisterHoursPerWeek] = useState(24);
  const [registerContractDate, setRegisterContractDate] = useState("");
  const [registerAdmin, setRegisterAdmin] = useState(false);
  const registerUid = [];
  console.log("SignUpDialog");

  const usersRef = collection(db, "users");

  const registerUser = async () => {
    console.log("registerUser");
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      ).then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user, user.uid);
        registerUid.push(user.uid);
        console.log(registerUid);
        return user;
      });
      createUser();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {}, []);

  const createUser = async () => {
    console.log(registerUid);
    let newUser = {
      firstName: registerFirstName || null,
      lastName: registerLastName || null,
      age: registerAge || null,
      contractDate: registerContractDate || null,
      hoursPerWeek: registerHoursPerWeek || null,
      authIDs: registerUid || null,
      admin: registerAdmin || null,
    };
    console.log(newUser);
    try {
      await addDoc(usersRef, newUser);
      console.log("createUser:", newUser);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
          <InputText
            placeholder="Register Email..."
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon ">
          <i className="pi pi-question"></i>
          <Password
            type="password"
            value={registerValue}
            placeholder="Register Password..."
            onChange={(e) => (
              setRegisterPassword(e.target.value),
              setRegisterValue(e.target.value)
            )}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi"></i>
          <InputText
            placeholder="First Name..."
            onChange={(e) => setRegisterFirstName(e.target.value)}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi"></i>
          <InputText
            placeholder="Last Name..."
            onChange={(e) => setRegisterLastName(e.target.value)}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi"></i>
          <InputNumber
            value={registerAge}
            placeholder="Age..."
            onChange={(e) => setRegisterAge(e.value)}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi"></i>
          <InputNumber
            value={registerHoursPerWeek}
            placeholder="Hours/Week"
            onChange={(e) => setRegisterHoursPerWeek(e.value)}
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <span className="p-inputgroup-addon">
          <i className="pi"></i>
          <Calendar
            value={registerContractDate}
            placeholder="Contractdate..."
            onChange={(e) => setRegisterContractDate(e.value)}
            dateFormat="dd/mm/yy"
          />
        </span>
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <Button label="SignUp" onClick={registerUser} />
      </div>
      <div className="p-inputgroup flex align-items-center justify-content-center bg-grey-500 font-bold text-white m-2 px-1 py-1 border-round">
        <div>
          <Button
            label="already an user?"
            onClick={() => setShowSignUp(false)}
            link
          />
        </div>
      </div>
    </>
  );
};
