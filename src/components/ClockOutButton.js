// ClockOutButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { clockOut } from '../redux/actions';

export const ClockOutButton = () => {
  const dispatch = useDispatch();

  const handleClockOut = () => {
    const now = new Date();
    dispatch(clockOut(now));
  };

  return <button onClick={handleClockOut}>Clock Out</button>;
}

