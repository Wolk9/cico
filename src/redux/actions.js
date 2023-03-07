// actions.js
import { db } from '../firebase/firebase';

export const CLOCK_IN = 'CLOCK_IN';
export const CLOCK_OUT = 'CLOCK_OUT';
export const ADD_USER = 'ADD_USER';
export const SET_USERS = 'SET_USERS';

export const clockIn = (time) => async (dispatch, getState) => {
  const { user } = getState().auth;
  const userRef = db.collection('users').doc(user.uid);

  await userRef.update({
    clockIns: [...user.clockIns, time],
  });

  dispatch({
    type: CLOCK_IN,
    payload: {
      userId: user.uid,
      time,
    },
  });
};

export const clockOut = (time) => async (dispatch, getState) => {
  const { user } = getState().auth;
  const userRef = db.collection('users').doc(user.uid);

  await userRef.update({
    clockOuts: [...user.clockOuts, time],
  });

  dispatch({
    type: CLOCK_OUT,
    payload: {
      userId: user.uid,
      time,},
    });
};

export const addUser = (user) => async (dispatch) => {
const userRef = db.collection('users').doc(user.uid);

await userRef.set({
name: user.displayName,
clockIns: [],
clockOuts: [],
});

dispatch({
type: ADD_USER,
payload: user,
});
};

export const setUsers = () => async (dispatch) => {
    const usersRef = db.collection('users');
    
    usersRef.onSnapshot((snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          name: data.name,
          clockIns: data.clockIns,
          clockOuts: data.clockOuts,
        });
      });
      
      dispatch({
        type: SET_USERS,
        payload: users,
      });
    });
};

