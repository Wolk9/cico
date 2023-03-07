// reducers.js
import { CLOCK_IN, CLOCK_OUT, ADD_USER, SET_USERS } from './actions';

const initialState = {
users: [],
};

const usersReducer = (state = initialState, action) => {
switch (action.type) {
case CLOCK_IN:
const updatedUsersClockedIn = state.users.map((user) => {
if (user.id === action.payload.userId) {
return {
...user,
clockIns: [...user.clockIns, action.payload.time],
};
}
return user;
});
return {
    ...state,
    users: updatedUsersClockedIn,
  };
case CLOCK_OUT:
  const updatedUsersClockedOut = state.users.map((user) => {
    if (user.id === action.payload.userId) {
      return {
        ...user,
        clockOuts: [...user.clockOuts, action.payload.time],
      };
    }
    return user;
  });

  return {
    ...state,
    users: updatedUsersClockedOut,
  };
case ADD_USER:
  return {
    ...state,
    users: [...state.users, { id: action.payload.uid, name: action.payload.displayName, clockIns: [], clockOuts: [] }],
  };
case SET_USERS:
  return {
    ...state,
    users: action.payload,
  };
default:
  return state;

}
};

export default usersReducer;
