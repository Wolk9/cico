import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Auth } from "./components/auth";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  console.log(user);
  console.log(showSignUp);
  console.log(popUpVisible);

  if (user) {
    setPopUpVisible(false);
  } else {
    setPopUpVisible(true);
  }

  return (
    <Card title="CICO">
      <h4>User logged In:</h4>
      {user?.email}
      <Dialog
        header={showSignUp ? "Sign Up" : "Sign In"}
        visible={popUpVisible}
        style={{ width: "60vw" }}
      >
        <Auth showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
      </Dialog>
    </Card>
  );
};

export default App;
