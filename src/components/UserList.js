// UserList.js
import React from 'react';
import { useSelector } from 'react-redux';

export const UserList = () => {
  const { users } = useSelector((state) => state.users);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.clockIns.length > user.clockOuts.length ? 'Clocked In' : 'Clocked Out'}
        </li>
      ))}
    </ul>
  );
}

