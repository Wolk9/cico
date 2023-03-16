import { signOut } from "firebase/auth";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { Auth } from "../components/auth";
import { auth } from "../config/firebase";

export const Cico = (props) => {
  const { popUpVisible } = props;

  const signOutUser = async () => {
    console.log("signOutUser");
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <div>{popUpVisible ? <Auth /> : <Card title="CICO"></Card>}</div>
      <div className="">
        <div className="">
          {popUpVisible ? (
            <></>
          ) : (
            <Button onClick={signOutUser}>Sign Out</Button>
          )}
        </div>
      </div>
    </div>
  );
};
