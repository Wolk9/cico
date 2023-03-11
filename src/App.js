import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { auth } from "./config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "primereact/button";

const App = () => {
  const [popUpVisible, setPopUpVisible] = useState(false);

  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  console.log(user);

  console.log(popUpVisible);

  const signOutUser = async () => {
    console.log("signOutUser");
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.email !== undefined) {
      console.log("set popup false");
      setPopUpVisible(false);
    } else {
      console.log("set popup true");
      setPopUpVisible(true);
    }
  }, [user]);

  return (
    <Card title="CICO">
      <h4>User logged In:</h4>
      {user?.email}
      {user?.email !== undefined ? (
        <Button
          label="Sign out"
          onClick={() => {
            signOutUser();
          }}
        />
      ) : (
        <></>
      )}
      <Dialog header="Welcome" style={{ width: "60vw" }} visible={popUpVisible}>
        <Auth />
      </Dialog>
    </Card>
  );
};

export default App;
