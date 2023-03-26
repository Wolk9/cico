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
import {
  date,
  signOutUser,
  time,
  getUserData,
  difference,
} from "../components/helpers";
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
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [runningEvent, setRunningEvent] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleStart = () => {
    setStart(Date.now());
  };

  const handleEnd = () => {
    setEnd(Date.now());
  };

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

  const eventsRef = collection(db, "events");

  const saveEvent = async () => {
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

    const calculateTotalEventTime = async (eventId) => {
      console.log(eventId);
      const docRef = doc(eventsRef, eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const eventData = docSnap.data();
        const eventStart = eventData.eventStart;
        const eventEnd = eventData.eventEnd;

        if (eventEnd !== "running") {
          // Convert eventStart and eventEnd to Date objects
          const startDate = new Date(eventStart.seconds * 1000);
          const endDate = new Date(eventEnd.seconds * 1000);

          // Get the difference between the dates in milliseconds
          const diffInMs = endDate.getTime() - startDate.getTime();

          // Convert the difference to a Unix timestamp
          const diffInUnixTimestamp = Math.floor(diffInMs / 1000);

          updateDoc(doc(eventsRef, eventId), {
            totalTime: diffInUnixTimestamp,
          })
            .then(() => {
              console.log("totalTime added succesfully");
            })
            .catch((error) => {
              console.error(
                "totalTime is not added in Firebase Database",
                error
              );
            });
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("event not ended yet, so no time could be calculated");
      }
    };

    if (eventToEnd) {
      console.log("event is running");

      console.log("Running: ", running);

      updateDoc(doc(eventsRef, eventToEnd.id), {
        eventEnd: serverTimestamp(),
      })
        .then(() => {
          setRunning(false);
          calculateTotalEventTime(eventToEnd.id);
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
        totalTime: null,
      })
        .then(() => {
          setRunning(true);
          setRunningEvent(eventToEnd);
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
              <Buttons
                clockAction={clockAction}
                handleEnd={handleEnd}
                handleStart={handleStart}
                running={running}
                start={start}
                end={end}
              />

              <EventList
                user={user}
                running={running}
                setRunning={setRunning}
                runningEvent={runningEvent}
                elapsedTime={elapsedTime}
                setElapsedTime={setElapsedTime}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Buttons = (props) => {
  const { clockAction, running, handleStart, handleEnd, start, end } = props;
  const clickOnClockIn = () => {
    clockAction();
    handleStart();
  };

  const clickOnClockOut = () => {
    clockAction();
    handleEnd();
  };

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
          onClick={clickOnClockIn}
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
          onClick={clickOnClockOut}
        >
          End
        </button>
      </div>
    </Panel>
  );
};

const EventList = (props) => {
  const {
    user,
    running,
    setRunning,
    runningEvent,
    elapsedTime,
    setElapsedTime,
  } = props;
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
    // console.log(rowData);

    if (rowData.eventEnd === "running") {
      setRunning(true);
      return "Running";
    } else {
      const t = time(rowData.eventEnd);

      return `${t}`;
    }
  };

  const totalTimeBodyTemplate = (rowData) => {
    if (rowData.totalTime !== null) {
      const t = difference(rowData.eventStart, rowData.eventEnd);

      return `${t}`;
    } else {
      return (
        <Timer
          unixTimestamp={rowData.eventStart.seconds}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
        />
      );
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
    <Card title="Working Hours">
      <DataTable
        value={events}
        dataKey="id"
        size="small"
        emptyMessage="No events yet"
      >
        <Column
          field="eventStart.seconds"
          header="Start"
          body={startTimeBodyTemplate}
          style={{ width: "10rem" }}
        />
        <Column
          field="eventEnd.seconds"
          header="End"
          body={endTimeBodyTemplate}
        />
        <Column
          field="eventEnd.totalTime"
          header="Total"
          body={totalTimeBodyTemplate}
          style={{ width: "5rem" }}
        />
        <Column body={deleteBodyTemplate}></Column>
      </DataTable>
    </Card>
  );
};

const Timer = ({ unixTimestamp, elapsedTime, setElapsedTime }) => {
  console.log(unixTimestamp);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      setElapsedTime(currentTime - unixTimestamp);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [unixTimestamp]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return <div>{formatTime(elapsedTime)}</div>;
};

