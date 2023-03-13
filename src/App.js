import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { auth } from "./config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "./components/Sidebar";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Cico } from "./pages/cico";
import { User } from "./pages/user";

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

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root user={user} signOutUser={signOutUser} />}>
        <Route index element={<Cico user={user} />} />
        <Route path="/user" element={<User user={user} />} />
      </Route>
    )
  );

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
    <div>
      <RouterProvider router={router} />

      <Dialog
        header="Welcome"
        style={{ width: "auto", margin: 25 }}
        visible={popUpVisible}
        closable={false}
      >
        <Auth />
      </Dialog>
    </div>
  );
};

const Root = (props) => {
  const { user, signOutUser } = props;

  return (
    <div className="card">
      <div className="card-container blue-container overflow-hidden">
        <div className="flex bg-blue-500 justify-content-end">
          <div className="flex-initial flex align-items-center justify-content-center font-bold text-white ml-2 mr-5 px-1 pl-1 pr-5 border-round">
            <Link className="no-underline text-white text-base p-link" to="/">
              Home
            </Link>
          </div>
          <div className="flex-initial flex align-items-center justify-content-center font-bold text-white m-2 px-1 py-1 border-round">
            <Link
              className="no-underline text-white text-base p-link"
              to="/user"
            >
              User
            </Link>
          </div>
          <div className="flex-initial flex align-items-end justify-content-end font-bold text-white m-2 px-1 py-1 border-round">
            <div className="card-container">
              <div className="flex-initial flex align-items-center justify-content-end font-bold text-white m-2 px-1 py-1 border-round">
                <p className="p-link">{user?.email}</p>
              </div>
              <div className="flex-initial flex align-items-center justify-content-end font-bold text-white m-2 px-1 py-1 border-round">
                {user?.email !== undefined ? (
                  <Button
                    label="Sign out"
                    onClick={() => {
                      signOutUser();
                    }}
                  />
                ) : (
                  <></>
                )}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
