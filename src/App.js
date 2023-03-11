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
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
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

      <Dialog
        header="Welcome"
        style={{ width: "auto" }}
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
    <div>
      <Box sx={{ backgroundColor: "#6688ff", color: "#eeeeee" }}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item md={2} padding={2}>
            <Link to="/user">User</Link>
          </Grid>
          <Grid item md={2} padding={4}>
            <Link to="/">Home</Link>
          </Grid>
          <Grid item md={8} padding={1}>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item xs={6} padding={2}>
                <p>{user?.email}</p>
              </Grid>
              <Grid item xs={6} padding={2}>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
