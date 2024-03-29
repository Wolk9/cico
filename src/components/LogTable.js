import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import EventSelect from "./EventSelect";
import { LogService } from "../services/logService";

const LogTable = (props) => {
  const { users, events, userSelection, eventSelection, setEventSelection } =
    props;
  const [selectedLog, setSelectedLog] = useState([]);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const logs = await LogService.getLogs(
        toBeDeletedId,
        selectedLog,
        userSelection,
        eventSelection
      );
      setSelectedLogs(logs);
    };

    fetchLogs();
  }, [toBeDeletedId, selectedLog, userSelection, eventSelection]);

  const deleteLog = async (logId) => {
    await LogService.deleteLog(logId);
    setToBeDeletedId(logId);
  };

  const timeDate = (timestamp) => {
    let stampObj = new Date(timestamp);

    let day = stampObj.getDate();
    let month = stampObj.getMonth() + 1;
    let year = stampObj.getFullYear();
    let hour = stampObj.getHours();
    let minutes = stampObj.getMinutes();

    return `${day}-${month}-${year} ${hour}:${minutes}`;
  };

  const stampBodyTemplate = (rowData) => {
    return timeDate(rowData.timestamp);
  };

  const eventBodyTemplate = (rowData) => {
     return events.find((x) => x.eventId === rowData.eventId).eventType;
  };

  const deleteBodyTemplate = (rowData) => {
    return (
      <div onClick={() => deleteLog(rowData.id)}>
        <i className="pi pi-delete-left" style={{ color: "red" }}></i>
      </div>
    );
  };

  const lastLog = selectedLogs[selectedLogs.length - 1];

  const selectedUser = users.filter((user) => {
    return user.userId === userSelection;
  });

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

export default LogTable;
