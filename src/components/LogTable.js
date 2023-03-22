import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { findAllLogs } from "../services/logs";
import { Card } from "primereact/card";
import { getDb } from "../services/db";
import EventSelect from "./EventSelect";
import { useTimer } from "../services/useTimer";

const LogTable = (props) => {
  const { users, events, userSelection, eventSelection, setEventSelection } =
    props;
  const [timePassed, setTimePassed] = useState(0);
  const [selectedLog, setSelectedLog] = useState([]);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const logs = GetMyLogs(
    selectedLog,
    toBeDeletedId,
    userSelection,
    eventSelection
  );

  // console.log("logs:", logs);
  // console.log("LogTable props: ", props);

  if (!logs) return [];

  const selectedLogs = logs.filter((log) => {
    return log.userId === userSelection;
  });

  // sort by value
  selectedLogs.sort((a, b) => a.timestamp - b.timestamp);

  console.log(selectedLogs);

  const lastLog = selectedLogs[selectedLogs.length - 1];

  // const calculateTimePassed = () => {
  //   let seconds = new Date();
  //   let difference = +new Date() - +new Date(lastLog.timestamp.seconds);

  //   let timePassed = {};

  //   console.log(difference);

  //   if (difference > 0) {
  //     timePassed = {
  //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
  //       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  //       minutes: Math.floor((difference / 1000 / 60) % 60),
  //       seconds: Math.floor((difference / 1000) % 60),
  //     };
  //   }

  //   return timePassed;
  // };

  // const timer = setTimeout(() => {
  //   setTimePassed(calculateTimePassed());
  // }, 5000);

  // console.log("seconden:", timePassed);

  const selectedUser = users.filter((user) => {
    return user.userId === userSelection;
  });

  const timeDate = (timestamp) => {
    let stampObj = new Date(timestamp);

    //console.log(timestamp.seconds, timestamp, stampObj);

    let day = stampObj.getDate();
    let month = stampObj.getMonth() + 1;
    let year = stampObj.getFullYear();
    let hour = stampObj.getHours();
    let minutes = stampObj.getMinutes();

    return `${day}-${month}-${year} ${hour}:${minutes}`;
  };

  // console.log(
  //   "1 events:",
  //   events,
  //   "logs:",
  //   logs,
  //   "users:",
  //   users,
  //   "userSelection:",
  //   userSelection,
  //   "selectedLogs:",
  //   selectedLogs.timestamp,
  //   "selectedUser",
  //   selectedUser
  // );

  const deleteLog = (e) => {
    // console.log("Clicked delete for:", e);

    const docRef = doc(getDb(), "logs", e);

    deleteDoc(docRef)
      .then(() => {
        setToBeDeletedId(e);
        // console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  // selectedLogs.map(
  //   (x, i) => (x[i].timestamp.seconds = timeDate(x[i].timestamp))
  // );

  const stampBodyTemplate = (rowData) => {
    return timeDate(rowData.timestamp);
  };

  const eventBodyTemplate = (rowData) => {
    return events.find((x) => x.eventId === rowData.eventId).eventType;
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
    <div>
      <Card>
        {userSelection && (
          <EventSelect
            lastLog={lastLog}
            eventSelection={eventSelection}
            setEventSelection={setEventSelection}
            events={events}
            userSelection={userSelection}
          />
        )}
      </Card>
      <Card title={selectedUser[0].firstName}>
        <DataTable value={selectedLogs} dataKey="id">
          {/* // onClick={(e) => DeleteEvent(e.event.id)} */}
          <Column
            field="eventId"
            header="begin/einde"
            body={eventBodyTemplate}
          ></Column>
          <Column
            field="timestamp"
            header="datum/tijd"
            body={stampBodyTemplate}
          ></Column>
          <Column body={deleteBodyTemplate}></Column>
        </DataTable>
      </Card>
    </div>
  );
};

const GetMyLogs = (
  toBeDeletedId,
  selectedLog,
  userSelection,
  eventSelection
) => {
  const [logs, setLogs] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  async function getLogs() {
    setLoadingLogs(true);
    const response = await findAllLogs();
    setLogs([...response]);
    setLoadingLogs(false);
  }
  useEffect(() => {
    getLogs();
    // console.log("useEffect getLogs");
  }, [toBeDeletedId, selectedLog, userSelection, eventSelection]);

  return logs;
};

export default LogTable;
