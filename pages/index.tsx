import Head from 'next/head'
import { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'
import { onAuthStateChanged, signOut, User } from "firebase/auth";
// import UserContext from './userContext'
import { motion } from "framer-motion"

import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

import { observer } from "mobx-react-lite"


import styles from '../styles/Home.module.css'
import Dailies from './dailies';
import Login from '../components/login';
import { DateContext } from '../store/date';
import Splash from '../components/splash';
import { DailiesContext } from '../store/dailies';
import SideMenu from '../components/sideMenu';

import Hotjar from '@hotjar/browser';

const siteId = 3857047;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

interface HomeProps {
  user: User
}

export default observer(function Home(props: HomeProps) {

  // const [date, setDate] = useState(new Date())
  const { dailies } = useContext(DailiesContext)
  const {date, setDate} = useContext(DateContext)
  const [user, setUser] = useState(props.user)

  useEffect(() => {
    const unsubsc = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user)
      }
    })

    return unsubsc
  }, [])
  
  return (
    // <div className={styles.container}>
    <div>
      <Head>
        <title>Dailies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Splash />
        {/* <h1 className={styles.title}>
            <Splash /> 
            Welcome to <span className={styles.name}>Dailies!</span>
          </h1> */}

        {user ? (
          <>
            {/* <SideMenu 
              open={false}
              content={
                <>
                  <button className={`btn ${styles.signOut}`} onClick={async () => {
                    await signOut(auth)
                    setUser(props.user)
                  }}>Sign out</button>
                </>
            }/> */}
            
              <div className="flex items-center justify-around shadow-md bg-gray-900 text-gray-200 mx-auto mb-8 min-w-full h-16 max-w-7xl px-2 sm:px-6 lg:px-8">
                <p className="text-lg">
                  <span className="animate-pulse bg-gray-200 px-1 text-gray-900 font-bold tracking-tight ">{user.displayName}</span>
                  , Choose a date to see your Dailies
                </p>
                <button className="px-6 py-2 bg-red-600 text-gray-100 hover:bg-gray-500 text-md cursor-pointer border-none font-bold rounded-md" onClick={async () => {
                  const answer = confirm(`${user.displayName}, do you really want to log out?`)
                  if (answer) {
                    await signOut(auth)
                    setUser(props.user)
                  }
                }}>Sign out</button>
              </div>

            {/* <p className={styles.description}>
              <span className={styles.name}>{user.displayName}</span>, Choose a date to see your Dailies
            </p>
            <button className={`btn ${styles.signOut}`} onClick={async () => {
              await signOut(auth)
              setUser(props.user)
            }}>Sign out</button> */}

            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ activeStartDate, date, view }) => {
                if (!dailies) {
                  return null
                }
                // console.log(dailies)
                // console.log(activeStartDate, date, view)
                const hasDaily = dailies.find(d => {
                  const da = d.data()
                  const createdAt = new Date(da.createdAt.seconds * 1000)
                  return createdAt.toLocaleString() === date.toLocaleString()
                })
                // console.log(hasDaily, date)
                return hasDaily ? styles.hasDaily : null
              }} />

            <Dailies date={date} user={user} />
          </>
        ) : (
          <Login />
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://hasan-sh.github.io/portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Build by <span className='ml-1 animate-pulse'>Hasan Sh</span> 
        </a>
      </footer>
    </div>
  )
})

export async function getStaticProps() {
  return {
    props: {
      user: auth.currentUser
    }, // will be passed to the page component as props
  }
}