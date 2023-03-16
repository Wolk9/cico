import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { auth } from "./config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "./components/Sidebar";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Cico } from "./pages/cico";
import { User } from "./pages/user";
import { Admin } from "./pages/admin";

const App = () => {
  console.log("App");
  /const navigate = useNavigate();
  const [popUpVisible, setPopUpVisible] = useState(false);

  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser("");
    }
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

  const logIn = () => {
    console.log("logIn");
    setPopUpVisible(true);
  };

  // useEffect(() => {
  //   if (user?.email !== undefined) {
  //     console.log("set popup false");
  //     setPopUpVisible(false);
  //   } else {
  //     console.log("set popup true");
  //     setPopUpVisible(true);
  //   }
  // }, [user]);

  return (
    <div>
      <Dialog
        header="Welcome"
        style={{ width: "auto", margin: 25 }}
        visible={popUpVisible}
        closable={false}
      >
        <Auth />
      </Dialog>

      <Navigation user={user} signOutUser={signOutUser} logIn={logIn} />
      <Routes>
        <Route exact path="/" element={<Cico user={user} />} />
        <Route exact path="/user" element={<User user={user} />} />
        <Route exact path="/admin" element={<Admin user={user} />} />
      </Routes>
    </div>
  );
};

const Navigation = (props) => {
  console.log("navigation");
  //const navigate = useNavigate();
  const { user, signOutUser, logIn } = props;

  return (
    <div className="card">
      <div className="card-container blue-container overflow-hidden">
        <div className="flex bg-blue-500 justify-content-end">
          <div className="flex-initial flex align-items-center justify-content-center font-bold text-white ml-2 mr-5 px-1 pl-1 pr-5 border-round"></div>
          <div className="flex-initial flex align-items-center justify-content-center font-bold text-white m-2 px-1 py-1 border-round"></div>
          <div className="flex-initial flex align-items-end justify-content-end font-bold text-white m-2 px-1 py-1 border-round">
            <div className="card-container">
              <div className="flex-initial flex align-items-center justify-content-end font-bold text-white m-2 px-1 py-1 border-round">
                <p className="p-link">{user?.email}</p>
              </div>
              <div className="flex-initial flex align-items-center justify-content-end font-bold text-white m-2 px-1 py-1 border-round">
                {user !== "" ? (
                  <Button
                    label="Sign out"
                    onClick={() => {
                      signOutUser();
                    }}
                  />
                ) : (
                  <Button label="Log in" onClick={logIn} />
                )}
              </div>
              {/* <Button link onClick={() => navigate(-1)}>
                go back
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
