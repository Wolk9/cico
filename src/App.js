// App.js
import React from 'react';
import { useSelector } from 'react-redux';
import { ClockInButton} from './components/ClockInButton';
import {ClockOutButton} from './components/ClockOutButton'; 
import {UserList} from './components/UserList' 
import { auth } from './firebase/firebase';

function App() {
  const { user } = useSelector((state) => state.auth);

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div>
      <h1>Clock In/Out Program</h1>
      <h2>Welcome, {user?.displayName}!</h2>
      <button onClick={handleSignOut}>Sign Out</button>
      <div>
        <h3>Clock In/Out Buttons</h3>
        <ClockInButton />
        <ClockOutButton />
      </div>
      <div>
        <h3>User List</h3>
        <UserList />
      </div>
    </div>
  );
}

export default App;