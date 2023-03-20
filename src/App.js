import { current } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { setRole } from "./components/helpers";
import Navigation from "./components/Navigation";
import { auth, db } from "./config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { Admin } from "./pages/admin";
import { Cico } from "./pages/cico";
import { User } from "./pages/user";

const AuthenticatedRoute = ({ children, user, requiredRole, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return (
    <Route
      {...rest}
      element={isAuthenticated ? children : <Navigate to="/" />}
    />
  );
};

const App = () => {
  const [user, setUser] = useState({});
  const [popUpVisible, setPopUpVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPopUpVisible(false);
        checkUserRole(currentUser.uid);
      } else {
        setUser({});
        setPopUpVisible(true);
      }
    });
    return unsubscribe;
  }, []);

  const checkUserRole = async (uid) => {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        console.log("User has admin role");
        setUser({ ...user, role: "admin" });
      } else {
        console.log("User does not have admin role");
        setUser({ ...user, role: "user" });
      }
    } else {
      console.log("User not found");
    }
  };

  if (user.role === undefined) {
    console.log("user.role = undefined");
    if (user.email === "martin.de.bes@me.com") {
      console.log("user is mdb");

      setRole("QEM0Mse1LrZKCcZkaSWHJRm1OzL2", "admin");
    }
  }

  console.log(user.email, user.role);

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route
            exact
            path="/"
            element={<Cico popUpVisible={popUpVisible} />}
          />
          <Route path="/user" element={<User user={user} />} />
          <Route
            path="/admin"
            element={
              <AuthenticatedRoute requiredRole="admin" user={user}>
                <Admin user={user} />
              </AuthenticatedRoute>
            }
          />
        </Routes>
        {/* {!user && <Navigate to="/" />} */}
      </div>
    </Router>
  );
};

export default App;
