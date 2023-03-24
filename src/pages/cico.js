import { signOut } from "firebase/auth";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useState, useEffect } from "react";
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
  const [running, setRunning] = useState(false);

  console.log(user.uid);

  const userId = user.uid;

  const eventsRef = collection(db, "events");

  const saveEvent = async () => {
    // console.log("saved: ", eventId);
    const getEventToEnd = async () => {
      try {
        const q = query(eventsRef, where("eventEnd", "==", "running"));
        const querySnapshot = await getDocs(q);
        const eventsToEnd = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(eventsToEnd);
        const eventToEnd = eventsToEnd.find((doc) => doc.userId === userId);

        console.log(eventToEnd);
        return eventToEnd;
      } catch (error) {
        console.log("event not found", error);
      }
    };
    const eventToEnd = await getEventToEnd();
    console.log(eventToEnd);

    if (eventToEnd) {
      console.log("event is running");

      updateDoc(doc(eventsRef, eventToEnd.id), {
        eventEnd: serverTimestamp(),
      })
        .then(() => {
          setRunning(false);
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
        eventEnd: "running",
      })
        .then(() => {
          setRunning(true);
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
              <Buttons clockAction={clockAction} running={running} />
              <EventList user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Buttons = (props) => {
  const { clockAction, running } = props;
  return (
    <Panel>
      <div className="p-buttonset">
        <button
          style={{
            backgroundColor: "green",
            color: running ? "black" : "white",
            fontSize: "20px",
            height: "180px",
            width: "180px",
            padding: "10px 60px",
            borderRadius: "15px 0px 0px 15px",
            border: "0px",
            margin: "10px 0px",
            cursor: running ? "pointer" : "default",
            opacity: running ? 0.2 : 1,
          }}
          disabled={running}
          onClick={() => clockAction()}
        >
          {running ? "timer" : "In"}
        </button>
        <button
          style={{
            backgroundColor: "red",
            color: !running ? "black" : "white",
            fontSize: "20px",
            height: "180px",
            width: "180px",
            padding: "10px 60px",
            borderRadius: "0px 15px 15px 0px",
            border: "0px",
            margin: "10px 0px",
            cursor: !running ? "pointer" : "default",
            opacity: !running ? 0.2 : 1,
          }}
          disabled={!running}
          onClick={() => clockAction()}
        >
          Out
        </button>
      </div>
    </Panel>
  );
};

const EventList = (props) => {
  const { user } = props;
  const [events, setEvents] = useState([]);

  const userId = user.uid;

  const eventsRef = collection(db, "events");

  const getEventsForThisUser = async () => {
    try {
      const q = query(eventsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const eventsForThisUser = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(eventsForThisUser);

      return eventsForThisUser;
    } catch (error) {
      console.log("event not found", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsForThisUser = await getEventsForThisUser();
      console.log(eventsForThisUser);
      setEvents(eventsForThisUser);
      // Do something with the eventsForThisUser data, such as updating state
    };
    fetchEvents();
  }, []);

  return (
    <Card title="List">
      {" "}
      <DataTable value={events}>
        <Column field="eventStart.seconds" header="Start Time" />
        <Column field="eventEnd.seconds" header="End Time" />
      </DataTable>
    </Card>
  );
};

