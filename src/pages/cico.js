import { useState, useEffect } from "react";
import {
  collection,
  query,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  where,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { Auth } from "../components/auth";
import { db } from "../config/firebase";
import { DateFormatter, UserUtils } from "../components/helpers";
import { Card } from "primereact/card";

export const Cico = (props) => {
  const { popUpVisible, user } = props;
  const [running, setRunning] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [runningEvent, setRunningEvent] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  console.log("Running: ", running);

  const userId = user.uid;

  console.log(userId)

  useEffect(() => {
    UserUtils.getUserData(userId)
      .then((userData) => {
        const currentUser = userData;
        setCurrentUser(currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const eventsRepository = new EventsRepository(db);

  console.log(eventsRepository);

  const saveEvent = async () => {
    const eventToEnd = await eventsRepository.getRunningEvent(userId);

    const calculateTotalEventTime = async (eventId) => {
      console.log(eventId);
      const eventData = await eventsRepository.getEventById(eventId);

      if (eventData) {
        const eventStart = eventData.eventStart;
        const eventEnd = eventData.eventEnd;

        if (eventEnd !== "running") {
          const diffInUnixTimestamp = DateFormatter.calculateTimeDifference(
            eventStart,
            eventEnd
          );

          eventsRepository
            .updateEventTotalTime(eventId, diffInUnixTimestamp)
            .then(() => {
              setRunning(false);
              console.log("totalTime added successfully");
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

      eventsRepository
        .updateEventEnd(eventToEnd.id)
        .then(() => {
          setRunning(false);
        })
        .then(() => {
          calculateTotalEventTime(eventToEnd.id);
          console.log("event ended successfully");
        })
        .catch((error) => {
          console.error("event not ended in Firebase Database", error);
        });
    } else {
      console.log("new event");
      eventsRepository
        .createEvent(userId)
        .then((event) => {
          setRunning(true);
          setRunningEvent(event);
          console.log("event started successfully");
        })
        .catch((error) => {
          console.error("Error starting new event in Firebase Database", error);
        });
    }
    console.log("Running: ", running);
  };

  const handleStart = () => {
    setStart(Date.now());
    saveEvent();
  };

  const handleEnd = () => {
    setEnd(Date.now());
    saveEvent();
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
              <div>
                <div>
                  <button onClick={handleStart}>Start</button>
                  <button onClick={handleEnd}>End</button>
                </div>
                <div>
                  {runningEvent && runningEvent.eventStart && (
                    <div>
                      <p>Event started at: {runningEvent.eventStart}</p>
                      {runningEvent.eventEnd ? (
                        <p>Event ended at: {runningEvent.eventEnd}</p>
                      ) : (
                        <p>Event is currently running</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                {elapsedTime !== 0 && (
                  <p>Total elapsed time: {elapsedTime} seconds</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

class EventsRepository {
  constructor(db) {
    this.db = db;
  }

  createEvent(userId) {
    const eventRef = collection(this.db, "events");
    const newEvent = {
      userId: userId,
      eventStart: serverTimestamp(),
    };
    return setDoc(doc(eventRef), newEvent);
  }

  updateEventEnd(eventId) {
    const eventRef = doc(this.db, "events", eventId);
    const updateData = {
      eventEnd: serverTimestamp(),
    };
    return updateDoc(eventRef, updateData);
  }

  updateEventTotalTime(eventId, totalTime) {
    const eventRef = doc(this.db, "events", eventId);
    const updateData = {
      totalTime: totalTime,
    };
    return updateDoc(eventRef, updateData);
  }

  getRunningEvent(userId) {
    const eventsRef = collection(this.db, "events");
    const queryRef = query(
      eventsRef,
      where("userId", "==", userId),
      where("eventEnd", "==", null)
    );
    return getDocs(queryRef).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        return { id: docSnapshot.id, ...docSnapshot.data() };
      }
      return null;
    });
  }

  getEventById(eventId) {
    const eventRef = doc(this.db, "events", eventId);
    return getDoc(eventRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      }
      return null;
    });
  }
}

export default Cico;
