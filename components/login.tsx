import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'


import { GoogleAuthProvider, signInAnonymously, signInWithRedirect, useDeviceLanguage, AuthError } from 'firebase/auth';
import { auth } from '../firebase';

import styles from './login.module.css';

export interface LoginProps  {}


const Login: React.FC<LoginProps> = (props) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useDeviceLanguage(auth);
    
    const login = async () => {
        setLoading(true)
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({
            login_hint: 'dailies@example.com',
        });

        await signInWithRedirect(auth, provider);
        router.push('/')
    };

    const continueAnonymously = () => {
        setLoading(true)
        signInAnonymously(auth)
            .then(() => {
                router.push('/');
            })
            .catch((error: AuthError) => console.error(error))
    };

    return (
        <div className={styles.container}>
            <button className={`btn ${styles.loginButton} `} disabled={loading} onClick={login}>
                Login with Google
            </button>
            {/* <button disabled={loading}
                className={`btn ${styles.continue}`}
                onClick={continueAnonymously}
            >
                Anonymous
            </button> */}
        </div>
    );
};

export default Login;
