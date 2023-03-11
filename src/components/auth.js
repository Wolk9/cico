
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
          <Password
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
  const [value, setValue] = useState("");
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
          <Password
            type="password"
            value={value}
            placeholder="Register Password..."
            onChange={(e) => (
              setRegisterPassword(e.target.value), setValue(e.target.value)
            )}
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