// React imports
import { useEffect, useState } from "react";

// Firebase imports
import { db } from "../config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// UI imports
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// logic import
import { DateFormatter } from "../components/helpers";

// sub Components

// main Component

export const Admin = () => {
  console.log("Admin");
  const [userList, setUserList] = useState([]);
  const [toBeDeletedId, setToBeDeletedId] = useState(null);

  const usersRef = collection(db, "users");

  useEffect(() => {
    getUserList();
  }, [toBeDeletedId]);

  const getUserList = async () => {
    console.log("getUserList");
    try {
      const data = await getDocs(usersRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(userList);

  const deleteLog = (e) => {
    // console.log("Clicked delete for:", e);

    const docRef = doc(usersRef, e);

    deleteDoc(docRef)
      .then(() => {
        setToBeDeletedId(e);
        // console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const contractDateBodyTemplate = (rowData) => {
    const contractDate = DateFormatter.date(rowData.contractDate);
    console.log(contractDate);
    return contractDate;
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

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Users</span>
    </div>
  );
  const footer = `In total there are ${userList ? userList.length : 0} users.`;

  return (
    <div>
      <Card title="Admin">
        <DataTable
          value={userList}
          header={header}
          footer={footer}
          tableStyle={{ minWidth: "30rem" }}
        >
          <Column field="firstName" header="firstName"></Column>
          <Column field="lastName" header="lastName"></Column>
          <Column field="age" header="age"></Column>
          <Column field="hoursPerWeek" header="hrs/wk"></Column>
          <Column
            field="contractDate"
            header="contract start date"
            body={contractDateBodyTemplate}
          ></Column>
          <Column body={deleteBodyTemplate}></Column>
          {/* <Column field="authIDs" header="id's"></Column> */}
        </DataTable>
      </Card>
    </div>
  );
};
