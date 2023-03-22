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
import Navigation from "./components/Navigation";
import { auth, db } from "./config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { Admin } from "./pages/admin";
import { Cico } from "./pages/cico";
import { User } from "./pages/user";
import { checkUserRole } from "./components/helpers";

const AuthenticatedRoute = ({
  isAuthenticated,
  setIsAuthenticated,
  children,
  user,
  requiredRole,
  ...rest
}) => {
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
      isAuthenticated={isAuthenticated}
      {...rest}
      element={isAuthenticated ? children : <Navigate to="/" />}
    />
  );
};

const App = () => {
  const [user, setUser] = useState({});
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
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

  console.log(user);

  return (
    <Router>
      <div>
        <Navigation isAuthenticated={isAuthenticated} />
        <Routes>
          <Route
            exact
            path="/"
            element={<Cico popUpVisible={popUpVisible} user={user} />}
          />
          <Route path="/user" element={<User user={user} />} />
          <Route
            path="/admin"
            element={
              <AuthenticatedRoute
                setIsAuthenticated={setIsAuthenticated}
                isAuthenticated={isAuthenticated}
                requiredRole="admin"
                user={user}
              >
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
