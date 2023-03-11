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
        <Route index element={<Cico />} />
        <Route path="/user" element={<User />} />
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

      <Dialog header="Welcome" style={{ width: "60vw" }} visible={popUpVisible}>
        <Auth />
      </Dialog>
    </div>
  );
};

const Root = (props) => {
  const { user, signOutUser } = props;
  return (
    <div>
      <div>
        <Link to="/user">User</Link>
        <Link to="/">Home</Link>
      </div>
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
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
