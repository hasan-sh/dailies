
import { collection, DocumentData, onSnapshot, query, where, QueryDocumentSnapshot  } from 'firebase/firestore';
import { BsPinFill } from 'react-icons/bs'

import Link from 'next/link';
import { ChangeEvent, useContext, useEffect, useReducer, useState } from 'react';
import { motion, AnimateSharedLayout } from "framer-motion"

// import UserContext from '../userContext'
import { db } from '../../firebase';
import styles from './dailies.module.css'
import { User } from 'firebase/auth';
import Loader from '../../components/loader';
import { DailiesContext } from '../../store/dailies';
import { parseHTML } from '../../utils';
import { observer } from 'mobx-react-lite';


interface DailiesProps {
    date: Date 
    user: User
}

function Dailies({ date, user }: DailiesProps) {


  if (!date) {
    date = new Date()
    date.setHours(0, 0, 0, 0);
  }

  const { dailies, setDailies, firstRun, setFirstRun } = useContext(DailiesContext)

  useEffect(() => {
        const colRef = collection(db, 'dailies');
        const q = query(colRef, where('uid', '==', user.uid))//orderBy('createdAt', 'asc'))
        const unsub = onSnapshot(q, (ss) => {
            const docs = sortByDate(ss.docs)
            setDailies(docs)
            setFirstRun(false)
        });
        return unsub
  }, [])


  if (!user) {
    return null
  }

  return (
    <div className={styles.grid}>
      {!dailies?.length && firstRun && (
        <div className={styles.card}>
          <Loader />
        </div>
      )}

      <AnimateSharedLayout>
        <motion.ul layout className={styles.grid}>

          {dailies && filterByDate(dailies, date)?.map((doc: DocumentData) => {
          // {dailies?.map((doc: DocumentData) => {
            const daily = doc.data()
            const createdAt = new Date(daily.createdAt.seconds * 1000)
            return <motion.div
              layout
              layoutId={doc.id}
              key={doc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                staggerChildren: 1
              }}
              className={styles.card}>
              {daily.pinned && <BsPinFill className={styles.pinned} color='red' />}
              <Link
                href={{
                  pathname: `/dailies/${doc.id}`,
                  query: { ...daily, createdAt: createdAt.toDateString(), language: daily.lang },
                }}
                as={`/dailies/${doc.id}`}
                key={doc.id}
                >

                <h2>{createdAt.toDateString()} &rarr;</h2>
                {/* <p>{daily.text}</p> */}
                {parseHTML(daily.text.substring(0, 100))}
              </Link>
            </motion.div>
          })}
        </motion.ul>
      </AnimateSharedLayout>
      <Link href={{
        pathname: '/dailies/create',
        query: { uid: user.uid }
      }}
        as='/dailies/create'
        className={styles.card} style={{
          borderColor: '#0070f3',
          color: '#0070f3',
        }}>
        <h2 style={{ margin: 0 }}>Create Daily &rarr;</h2>
      </Link>
    </div>
  )
}

export default observer(Dailies)

function filterByDate(docs: QueryDocumentSnapshot<DocumentData>[], date: Date) {
  return docs.filter(doc => {
    const data = doc.data()
    return date <= new Date(data.createdAt.seconds*1000) || data.pinned
  })
}

function sortByDate(docs: QueryDocumentSnapshot<DocumentData>[]) {
  return docs.sort((a, b) => {
    const aData = a.data()
    const bData = b.data()
    if (aData.pinned ) {
      return -1
    } else if (bData.pinned) {
      return 1
    }
    // else by date!
    return aData.createdAt.seconds - bData.createdAt.seconds
  })
}