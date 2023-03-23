import { signOut } from "firebase/auth";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { Auth } from "../components/auth";
import { auth, db } from "../config/firebase";
import { signOutUser } from "../components/helpers";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  where,
  serverTimestamp,
} from "firebase/firestore";

export const Cico = (props) => {
  const { popUpVisible, user } = props;

  console.log(user.uid);

  const userId = user.uid;

  const eventsRef = collection(db, "events");

  const saveEvent = async () => {
    // console.log("saved: ", eventId);
    const getEventToEnd = async () => {
      try {
        const q = query(
          eventsRef,
          where("userId", "==", userId && "eventEnd", "==", null)
        );
        const eventToEnd = getDocs(q);
        console.log(eventToEnd);
        return eventToEnd;
      } catch (error) {
        console.log("event not found", error);
      }
    };
    const eventToEnd = await getEventToEnd();
    console.log(eventToEnd);

    if (!eventToEnd) {
      console.log("event is running");

      setDoc(doc(eventsRef), {
        eventEnd: serverTimestamp(),
      })
        .then(() => {
          //setEventSelection(eventId);
          console.log("event ended succesfully");
        })
        .catch((error) => {
          console.error("event not ended in Firebase Database", error);
        });
    } else {
      console.log("new event");
      setDoc(doc(eventsRef), {
        userId: userId,
        eventStart: serverTimestamp(),
        eventEnd: null,
      })
        .then(() => {
          //setEventSelection(eventId);
          console.log("event started succesfully");
        })
        .catch((error) => {
          console.error("Error starting new event in Firebase Database", error);
        });
    }
  };

  const clockAction = () => {
    console.log("clockIn");
    saveEvent(1, userId);
  };

  return (
    <div className="">
      <div>{popUpVisible ? <Auth /> : <Card title="CICO"></Card>}</div>
      <div className="">
        <div className="">
          {popUpVisible ? (
            <></>
          ) : (
            <div>
              <Buttons clockAction={clockAction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Buttons = (props) => {
  const { clockAction } = props;
  return (
    <Panel>
      <div className="p-buttonset">
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "20px",
            height: "180px",
            width: "180px",
            padding: "10px 60px",
            borderRadius: "15px 0px 0px 15px",
            border: "0px",
            margin: "10px 0px",
            cursor: "pointer",
          }}
          onClick={() => clockAction()}
        >
          In
        </button>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            fontSize: "20px",
            height: "180px",
            width: "180px",
            padding: "10px 60px",
            borderRadius: "0px 15px 15px 0px",
            border: "0px",
            margin: "10px 0px",
            cursor: "pointer",
          }}
          onClick={() => clockAction()}
        >
          Out
        </button>
      </div>
    </Panel>
  );
};
