import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import App from './App';
import rootReducer from './redux/reducers';
import { auth, addUser, setUsers } from './firebase/firebase';

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(addUser(user));
    store.dispatch(setUsers());
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
