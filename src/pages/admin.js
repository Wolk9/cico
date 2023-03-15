// React imports
import React, { useEffect, useState } from "react";

// Firebase imports
import { auth, db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

// UI imports
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// logic

const getUserList = async () => {
  let userList = [];
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      userList.push(doc.data());
    });
    console.log(userList);
    return userList;
  } catch (err) {
    console.error(err);
  }
};

// sub Components

// main Component

export const Admin = () => {
  const [userList, setUserList] = useState([]);
  const list = getUserList();
  useEffect(() => {
    setUserList(userList);
  }, []);

  setUserList(list);
  return (
    <div>
      <Card title="Admin">
        <DataTable value={userList} tableStyle={{ minWidth: "50rem" }}>
          <Column></Column>
          <Column></Column>
          <Column></Column>
        </DataTable>
      </Card>
    </div>
  );
};
