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
import { date, signOutUser, time, getUserData } from "../components/helpers";
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
  deleteDoc,
} from "firebase/firestore";

export const Cico = (props) => {
  const { popUpVisible, user } = props;
  const [running, setRunning] = useState(null);
  const [currentUser, setCurrentUser] = useState("");

  console.log(user);

  console.log("Running: ", running);

  const userId = user.uid;

  useEffect(() => {
    getUserData(userId)
      .then((userData) => {
        const currentUser = userData;
        setCurrentUser(currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  console.log(currentUser);

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

      console.log("Running: ", running);

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
    console.log("Running: ", running);
  };

  const clockAction = () => {
    console.log("clockIn");
    saveEvent(1, userId);
  };

  return (
    <div className="">
      <div>
        {popUpVisible ? (
          <Auth />
        ) : (
          <Card title={`CICO ${currentUser.firstName}`}></Card>
        )}
      </div>
      <div className="">
        <div className="">
          {popUpVisible ? (
            <></>
          ) : (
            <div>
              <Buttons clockAction={clockAction} running={running} />
              <EventList
                user={user}
                running={running}
                setRunning={setRunning}
              />
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
  const { user, running } = props;
  const [events, setEvents] = useState([]);
  const [trigger, setTrigger] = useState(false);
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
  }, [running, trigger]);

  const deleteLog = (e) => {
    // console.log("Clicked delete for:", e);

    const docRef = doc(eventsRef, e);

    deleteDoc(docRef)
      .then(() => {
        setTrigger(!trigger);
        console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const startTimeBodyTemplate = (rowData) => {
    const d = date(rowData.eventStart);
    const t = time(rowData.eventStart);
    return `${d} ${t}`;
  };
  const endTimeBodyTemplate = (rowData) => {
    console.log(rowData);

    if (rowData.eventEnd === "running") {
      return "Running";
    } else {
      const d = date(rowData.eventEnd);
      const t = time(rowData.eventEnd);

      return `${d} ${t}`;
    }
  };

  const deleteBodyTemplate = (rowData) => {
    return (
      <div
        onClick={() => {
          deleteLog(rowData.id);
        }}
      >
        <i className="pi pi-delete-left" style={{ color: "red" }}></i>
      </div>
    );
  };

  return (
    <Card title="List">
      <DataTable value={events} dataKey="id">
        <Column
          field="eventStart.seconds"
          header="Start Time"
          body={startTimeBodyTemplate}
        />
        <Column
          field="eventEnd.seconds"
          header="End Time"
          body={endTimeBodyTemplate}
        />
        <Column body={deleteBodyTemplate}></Column>
      </DataTable>
    </Card>
  );
};

