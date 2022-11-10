
import { collection, DocumentData, Firestore, getDocs, QuerySnapshot, query, orderBy, where, Timestamp, doc, collectionGroup, QueryDocumentSnapshot  } from 'firebase/firestore/lite';
import Link from 'next/link';
import { ChangeEvent, useContext, useEffect, useReducer, useState } from 'react';

// import UserContext from '../userContext'
import { db } from '../../firebase';
import styles from './dailies.module.css'
import { User } from 'firebase/auth';
import Loader from '../../components/loader';
import { DailiesContext } from '../../store/dailies';


interface DailiesProps {
    date: Date 
    user: User
}

export default function Dailies({ date, user }: DailiesProps) {


  if (!date) {
    date = new Date()
    date.setHours(0, 0, 0, 0);
  }


  const {dailies: staticDailies, getDailies } = useContext(DailiesContext)

  const [dailies, setDailies] = useState<QueryDocumentSnapshot<DocumentData>[]>()
  const [firstRun, setFirstRun] = useState(true)

  useEffect(() => {
    async function init() {
      const newDailies = await getDailies(db, user.uid)
      const filteredDailies = filterByDate(newDailies, date)
      setDailies(filteredDailies)
    }

    init()
  }, [])

  useEffect(() => {
    async function init() {
      if (!firstRun && date && staticDailies) {
        const newDailies = filterByDate(staticDailies, date)
        setDailies(newDailies)
      }
    }

    init()
    setFirstRun(false)

  }, [date])

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
      {dailies?.map((doc: DocumentData) => {
        const daily = doc.data()
        const createdAt = new Date(daily.createdAt.seconds * 1000)
        return (
          <Link href={{
            pathname: `/dailies/${doc.id}`,
            query: { ...daily, createdAt: createdAt.toDateString() },
          }}
            as={`/dailies/${doc.id}`}

            key={doc.id} className={styles.card}>
            <h2>{createdAt.toDateString()} &rarr;</h2>
            <p>{daily.text}</p>
          </Link>
        )
      })}
      <Link href={{
        pathname: '/dailies/create',
        query: { uid: user.uid }
      }}
        as='/dailies/create'
        className={styles.card} style={{
          borderColor: '#0070f3',
          color: '#0070f3',
        }}>
        <h2 style={{margin: 0}}>Create Daily &rarr;</h2>
      </Link>
    </div>
  )
}

// async function getDailies(db: Firestore, userId: string) {
//   const colRef = collection(db, 'dailies');
//   // const docRef = getDocs(colRef, userId)
//   const q = query(colRef, where('uid', '==', userId))//orderBy('createdAt', 'asc'))
//   const dailySnapshot = await getDocs(q);
  
//   const docs = sortByDate(dailySnapshot.docs)
//   return docs;
// }

function filterByDate(docs: QueryDocumentSnapshot<DocumentData>[], date: Date) {
  return docs.filter(doc => {
    const data = doc.data()
    return date <= new Date(data.createdAt.seconds*1000)
  })
}

function sortByDate(docs: QueryDocumentSnapshot<DocumentData>[]) {
  return docs.sort((a, b) => {
    const aData = a.data()
    const bData = b.data()
    return aData.createdAt.seconds - bData.createdAt.seconds
  })
}