
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  console.log("Auth, showSignUp:", showSignUp);

  console.log(auth?.currentUser?.email);

  return (
    <div>
      {!showSignUp ? (
        <SignInDialog setShowSignUp={setShowSignUp} />
      ) : (
        <SignUpDialog setShowSignUp={setShowSignUp} />
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

  const signInWithGoogle = async () => {
    console.log("signInWithGoogle");
    try {
      await signInWithPopup(auth, googleProvider);
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
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerValue, setRegisterValue] = useState("");
  console.log("SignUpDialog");

  const registerUser = async () => {
    console.log("registerUser");
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
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