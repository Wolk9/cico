// ClockInButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { clockIn } from '../redux/actions';

export const ClockInButton = () => {
  const dispatch = useDispatch();

  const handleClockIn = () => {
    const now = new Date();
    dispatch(clockIn(now));
  };

  return <button onClick={handleClockIn}>Clock In</button>;
}

