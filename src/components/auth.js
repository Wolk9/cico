
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, collection, doc } from "firebase/firestore";
import { useState } from "react";

export const Auth = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  console.log("Auth, showSignUp:", showSignUp);

  console.log(auth?.currentUser?.email);

  return (
    <div>
      {!showSignUp ? (
        <Card title="Sign In" subTitle="If you've been here before">
          <SignInDialog setShowSignUp={setShowSignUp} />
        </Card>
      ) : (
        <Card title="Sign Up" subTitle="If you've never been here before">
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
      <div className="flex flex-column align-items-center gap-2 m-2">
        <span className="">
          <i className="mr-2 pi pi-user"></i>
          <InputText
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
      </div>
      <div className="flex flex-column align-items-center gap-2 m-2">
        <span className="">
          <i className="mr-2 pi pi-question"></i>
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
  const [registerAge, setRegisterAge] = useState(18);
  const [registerHoursPerWeek, setRegisterHoursPerWeek] = useState(24);
  const [registerContractDate, setRegisterContractDate] = useState("");
  const [registerRole, setRegisterRole] = useState("user");

  const usersRef = collection(db, "users");

  const registerUser = () => {
    console.log("registerUser");

    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        createUser(user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const createUser = async (uid) => {
    console.log(uid);
    let newUser = {
      firstName: registerFirstName || null,
      lastName: registerLastName || null,
      age: registerAge || null,
      contractDate: registerContractDate || null,
      hoursPerWeek: registerHoursPerWeek || null,
      role: registerRole || null,
    };
    console.log(newUser);
    try {
      await setDoc(doc(usersRef, uid), newUser);
      console.log("createUser:", newUser);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-column align-items-center gap-2 m-2">
        <span className="">
          <i className="mr-2 pi pi-user"></i>
          <InputText
            placeholder="Register Email..."
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </span>
      </div>
      <div className="flex flex-column align-items-center gap-2 m-2">
        <span className="">
          <i className="mr-2 pi pi-question"></i>
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
      <div className="flex flex-column align-items-center gap-2 m-2">
        <span className="">
          <i className="mr-2 pi pi-angle-right"></i>
          <InputText
            placeholder="First Name..."
            onChange={(e) => setRegisterFirstName(e.target.value)}
          />
        </span>
      </div>
      <div className="flex flex-column align-items-center gap-2 m-2">
        <span className="">
          <i className="mr-2 pi pi-angle-right"></i>
          <InputText
            placeholder="Last Name..."
            onChange={(e) => setRegisterLastName(e.target.value)}
          />
        </span>
      </div>
      <div className="flex flex-column align-items-center gap-0 p-fluid">
        <small htmlFor="age" className="mb-1 mt-1">
          Your age
        </small>
        <div className="plusMinField">
          <InputNumber
            inputId="age"
            value={registerAge}
            onValueChange={(e) => setRegisterAge(e.value)}
            showButtons
            buttonLayout="horizontal"
            step={1}
            decrementButtonClassName="p-button-danger"
            incrementButtonClassName="p-button-success"
            incrementButtonIcon="mr-1 pi pi-plus"
            decrementButtonIcon="ml-1 pi pi-minus"
            mode="decimal"
            min={18}
            max={80}
          />
        </div>
      </div>
      <div className="flex flex-column align-items-center gap-0">
        <small htmlFor="hrswk" className="mb-1 mt-2">
          hrs/wk
        </small>

        <InputNumber
          inputId="hrswk"
          value={registerHoursPerWeek}
          showButtons
          buttonLayout="horizontal"
          step={4}
          decrementButtonClassName="p-button-danger"
          incrementButtonClassName="p-button-success"
          incrementButtonIcon="mr-1 pi pi-plus"
          decrementButtonIcon="ml-1 pi pi-minus"
          mode="decimal"
          min={0}
          max={32}
          onChange={(e) => setRegisterHoursPerWeek(e.value)}
        />
      </div>
      <div className="flex flex-column align-items-center gap-2 m-2">
        <small htmlFor="contractDate" className="mb-0 mt-2">
          Contract start date
        </small>
        <Calendar
          inputId="contractDate"
          value={registerContractDate}
          placeholder="Contractdate..."
          onChange={(e) => setRegisterContractDate(e.value)}
          dateFormat="dd/mm/yy"
        />
      </div>
      <div className="flex flex-column align-items-center gap-2 m-2">
        <Button label="SignUp" onClick={registerUser} />
      </div>
      <div className="flex flex-column align-items-center gap-2 m-2">
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
