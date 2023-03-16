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
import { auth } from "./config/firebase";
import { Admin } from "./pages/admin";
import { Cico } from "./pages/cico";
import { User } from "./pages/user";

const AuthenticatedRoute = ({ children, user, requiredRole, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(!!currentUser);
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
  const [user, setUser] = useState("");
  const [popUpVisible, setPopUpVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPopUpVisible(false);
      } else {
        setUser("");
        setPopUpVisible(true);
      }
    });
    return unsubscribe;
  }, []);

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
        {!user && <Navigate to="/" />}
      </div>
    </Router>
  );
};

export default App;
