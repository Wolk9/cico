
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";

export const Auth = (props) => {
  const { showSignUp, setShowSignUp } = props;

  console.log(showSignUp);

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

  const signInUser = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-inputgroup">
        Sign In
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
          <InputText
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
        <span className="p-inputgroup-addon">
          <i className="pi pi-question"></i>
          <InputText
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </span>
        <Button label="SignIn" onClick={signInUser} />
      </div>
      <div>
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

  const registerUser = async () => {
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
      <div className="p-inputgroup">
        Sign Up
        <span className="p-inputgroup-addon">
          <i className="pi pi-user"></i>
          <InputText
            placeholder="Register Email..."
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </span>
        <span className="p-inputgroup-addon">
          <i className="pi pi-question"></i>
          <InputText
            type="password"
            placeholder="Register Password..."
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </span>
        <Button label="SignUp" onClick={registerUser} />
      </div>
      <div>
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