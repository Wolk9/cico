import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { findAllLogs } from "../services/logs";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { getDb } from "../services/db";
import EventSelect from "./EventSelect";


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

  if (!logs) return [];

  const selectedLogs = logs.filter((log) => {
    return log.userId === userSelection;
  });

  // sort by value
  selectedLogs.sort((a, b) => a.timestamp - b.timestamp);

  console.log(selectedLogs);

  const lastLog = selectedLogs[selectedLogs.length - 1];

  const selectedUser = users.filter((user) => {
    return user.userId === userSelection;
  });

  const timeDate = (timestamp) => {
    let stampObj = new Date(timestamp);

    let day = stampObj.getDate();
    let month = stampObj.getMonth() + 1;
    let year = stampObj.getFullYear();
    let hour = stampObj.getHours();
    let minutes = stampObj.getMinutes();

    return `${day}-${month}-${year} ${hour}:${minutes}`;
  };

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


  const stampBodyTemplate = (rowData) => {
    return timeDate(rowData.timestamp);
  };

  const eventBodyTemplate = (rowData) => {
    return events.find((x) => x.eventId === rowData.eventId).eventType;
  };

  const editBodyTemplate = (rowData) => {
    return (
      <div onClick={() => setSelectedLog(rowData)}>
        <i className="pi pi-pencil" style={{ color: "orange" }}></i>
      </div>
    );
  };

  // test

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
      {selectedLog.length > 0 && (
        <Card title="Edit Log">
          <EditLogForm
            users={users}
            events={events}
            setEventSelection={setEventSelection}
            selectedLog={selectedLog}
          />
        </Card>
      )}
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
          <Column
            field="eventId"
            header="begin/einde"
            body={eventBodyTemplate}
          />
          <Column
            field="timestamp"
            header="datum/tijd"
            body={stampBodyTemplate}
          />
          <Column header="e" body={editBodyTemplate} />
          <Column header="d" body={deleteBodyTemplate} />
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

const EditLogForm = (props) => {
  const { users, events, setEventSelection, selectedLog } = props;

  const [eventId, setEventId] = useState(selectedLog.eventId);

  const handleEventChange = (e) => {
    setEventId(e.value.eventId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedLog = { ...selectedLog, eventId: eventId };
    const docRef = doc(getDb(), "logs", selectedLog.id);
    setToBeDeletedId(null);

    setEventSelection(updatedLog.eventId);
    setSelectedLog([]);

    updateDoc(docRef, updatedLog)
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const handleCancel = (e) => {
    setSelectedLog([]);
  };

  return (
    <div className="p-fluid">
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="event">Event</label>
          <EventSelect
            value={{ eventId: eventId }}
            onChange={handleEventChange}
            events={events}
            userSelection={selectedLog.userId}
          />
        </div>
        <div className="p-field">
          <Button label="Save" type="submit" />
          <Button
            label="Cancel"
            onClick={handleCancel}
            className="p-button-secondary"
          />
        </div>
      </form>
    </div>
  );
};


export default LogTable;
