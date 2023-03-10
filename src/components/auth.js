
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { auth, googleProvider } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { useState } from 'react';

export const Auth = () => {
 const [ email, setEmail] = useState("");
 const [ password, setPassword] = useState("")

console.log(auth?.currentUser?.email);

 const signIn =  async () => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err)
    }
};

const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider)
    } catch (err) {
        console.error(err);
    }

};

const logout = async () => {
    try {
         await signOut(auth)
    } catch (err) {
        console.error(err);
    }
}

    return (
        <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
                <InputText placeholder="Email..." onChange={(e)=>setEmail(e.target.value)} />
            </span>
            <span className="p-inputgroup-addon">
                <i className="pi pi-question"></i>
                <InputText type="password" placeholder="Password..." onChange={(e)=>setPassword(e.target.value)}/>
            </span>
            <Button label="SignIn" onClick={signIn} />
            <Button label="SignIn with Google" onClick={signInWithGoogle} />
            <Button label="Logout" onClick={logout} />
        
        </div>
    );
};