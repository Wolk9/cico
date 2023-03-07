import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { addUser } from '../redux/reducers/userSlice';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { auth } from '../firebase/firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch(addUser(user));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
      <Card className="p-fluid" style={{ width: '400px' }}>
        <h1 className="p-text-center">Login</h1>
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="p-field">
          <label htmlFor="password">Password</label>
          <InputText type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="p-d-flex p-jc-center">
          <Button label="Sign In" onClick={handleSignIn} />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
