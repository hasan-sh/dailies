
import { collection, DocumentData, onSnapshot, query, where, QueryDocumentSnapshot, deleteDoc, doc as Doc  } from 'firebase/firestore';
import { BsPinFill, BsPlusCircle, BsXCircle } from 'react-icons/bs'

import Link from 'next/link';
import { ChangeEvent, ChangeEventHandler, EventHandler, useContext, useEffect, useReducer, useState } from 'react';
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

  const { dailies, setDailies, setSelectedDaily, firstRun, setFirstRun } = useContext(DailiesContext)
  const [searchTerm, setSearchTerm] = useState('')

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

  function searchHandler(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchTerm(value)
  }

  function filterRelevant() {
    if (searchTerm.length > 2) {
      return filterBySearch(dailies, searchTerm)
    }
    return filterByDate(dailies, date)
  }
  
  return (
    <div className={styles.grid}>
      {!dailies?.length && firstRun && (
        <div className={styles.card}>
          <Loader />
        </div>
      )}
      {!!dailies.length && (
        <div className="flex mt-2 items-center justify-center w-full">
          <input
            type="search"
            className={styles.searchInput}
            onChange={searchHandler}
            value={searchTerm}
            placeholder="Search.."
          />

          <Link
            href={{
              pathname: "/dailies/create",
              query: { uid: user.uid },
            }}
            as="/dailies/create"
            style={{
              borderColor: "#0070f3",
              color: "#0070f3",
            }}
            className='hover:text-red-200'
          >
            <BsPlusCircle
              className={`${styles.plus} ${styles.icon}`}
              color="#0070f3"
            />
          </Link>
        </div>
      )}

      <AnimateSharedLayout>
        <motion.ul layout className={styles.grid}>
          {dailies &&
            filterRelevant()?.map((doc: DocumentData) => {
              // {dailies?.map((doc: DocumentData) => {
              const daily = doc.data();
              const createdAt = new Date(daily.createdAt.seconds * 1000);
              let updatedAt: Date;
              if (daily.updatedAt) {
                updatedAt = new Date(daily.updatedAt.seconds * 1000);
              }
              return (
                <motion.div
                  layout
                  layoutId={doc.id}
                  key={doc.id}
                  onClick={() => {
                    // cuz daily is a proxy!
                    setSelectedDaily({
                      id: doc.id,
                      text: daily.text,
                      language: daily.lang,
                      pinned: daily.pinned,
                      createdAt,
                      updatedAt,
                    });
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    staggerChildren: 1,
                  }}
                  className={styles.card}
                  style={{ textAlign: daily.lang === "ar" ? "right" : "left" }}
                >
                  <div className={styles.actions}>
                    {daily.pinned && (
                      <BsPinFill className={styles.icon} color="orange" />
                    )}
                    {
                      <BsXCircle
                        className={styles.icon}
                        color="red"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const answer = confirm("Delete it?");
                          if (answer) {
                            // remove it
                            const docRef = Doc(db, "dailies", doc.id);
                            await deleteDoc(docRef);
                          }
                        }}
                      />
                    }
                  </div>
                  <Link
                    // href="/dailies/my-daily"
                    href={{
                      pathname: `/dailies/${doc.id}`,
                      query: { ...daily, createdAt: createdAt.toDateString(), pinned: daily.pinned, language: daily.lang },
                    }}
                    as={`/dailies/${doc.id}`}
                    key={doc.id}
                  >
                    <h2>{createdAt.toDateString()} &rarr;</h2>
                    {/* <p>{daily.text}</p> */}
                    {parseHTML(daily.text.substring(0, 47) + '...')}
                  </Link>
                </motion.div>
              );
            })}
        </motion.ul>
      </AnimateSharedLayout>
      <Link
        href={{
          pathname: "/dailies/create",
          query: { uid: user.uid },
        }}
        as="/dailies/create"
        className={styles.card}
        style={{
          borderColor: "#0070f3",
          color: "#0070f3",
        }}
      >
        <h2 style={{ margin: 0 }}>Create Daily &rarr;</h2>
      </Link>
    </div>
  );
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

function filterBySearch(docs: QueryDocumentSnapshot<DocumentData>[], term: string) {
  return docs.filter(d => {
    const data = d.data()
    const terms = term.trim().split(' ')
    const exists = terms.every(t => data.text.toLowerCase().includes(t.toLocaleLowerCase()))
    return exists
  })
}