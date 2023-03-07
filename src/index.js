import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import App from './App';
import rootReducer from './redux/reducers';
import { auth } from './firebase/firebase';
import { addUser, setUsers } from './redux/actions'

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
  
  const rootElement = document.getElementById('root');
  
  createRoot(rootElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );