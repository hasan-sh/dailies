import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { SplashContext } from '../store/splash';
import styles from './splash.module.css';

const Splash = () => {
    const {firstRun, setFirstRun} = useContext(SplashContext)

    useEffect(() => {
        const timeout = setTimeout(() => setFirstRun(false), 1300)
        return () => clearTimeout(timeout)
    }, [])

    if (!firstRun)
        return null

    return (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>
            <span className={styles.name}>Dailies</span> - For Your Future Self!
          </h1>
        </div>
     );
}

export default observer(Splash);