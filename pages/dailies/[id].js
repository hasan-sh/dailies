import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';

import { motion } from "framer-motion"

import styles from './dailies.module.css'
import { auth, db } from '../../firebase';
import { signInAnonymously, } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, addDoc, setDoc, Timestamp, } from 'firebase/firestore';
import Link from 'next/link';
// import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';
// import { DEFAULT_CONFIG } from '../../constants';
import Switch from '../../components/switch';
import { observer } from 'mobx-react-lite';

import { parseHTML } from '../../utils';

import SideMenu from '../../components/sideMenu';

const Editor = dynamic(() => import('../../components/editor'));


const Daily = () => {

    const router = useRouter()
    const query = router.query
    const [uid, setUid] = useState(query.uid)
    const [id, setId] = useState(query.id)
    const [markdown, setMarkdown] = useState(query.text)
    const [newContent, setNewContent] = useState(query.text)
    const [lang, setLang] = useState(query.language)
    const [createdAt, setCreatedAt] = useState(query.createdAt)
    const [pinned, setPinned] = useState(query.pinned)
    // TODO: make a separate collection that only holds the publicly available dailies.
    // const [publiclyAvailable, setpubliclyAvailable] = useState(query.public)

    const [preview, setPreview] = useState(false)
    const [loading, setLoading] = useState(true)
    const [readOnly, setReadOnly] = useState(!(auth.currentUser && auth.currentUser.uid === uid))
    // const windowSize = useWindowSize()
    useEffect(() => {
        if (id && createdAt && loading) {
            setLoading(false)
        }
        async function init() {
            if (!id && router.query.id) {
                // router.push('/')
                try {
                    // Another approach is to get these from the params; but it's not so nice. Therefore, registering a new user is fine too!
                    const daily = await getDaily(router.query.id)
                    const data = daily.data()
                    if (!data) {
                        router.push('/')
                    }
                    setId(router.query.id)
                    setUid(data.uid)
                    setMarkdown(data.text)
                    setNewContent(data.text)
                    setLang(data.language)
                    const time = new Date(data.createdAt.seconds * 1000);
                    setCreatedAt(time.toDateString())
                    setPinned(data.pinned)
                    setReadOnly(auth.currentUser && data.uid !== auth.currentUser.uid)
                    // const { id, text, createdAt: time, language, pinned: isPinned } = selectedDaily
                    // setSelectedDaily(daily.data())
                } catch (FirestoreError) {
                    if (FirestoreError.message === 'Missing or insufficient permissions.') {
                        signInAnonymously(auth)
                            .then(() => {
                                console.log(auth.currentUser)
                            })
                            .catch((error) => console.error(error))
                    }
                }
            }
        }
        init()
    }, [id, router.query])

    useEffect(() => {
        const autosave = async data => {
            await updateDaily(data, id.toString(), lang, pinned)
        }
        // if ((auth.currentUser && uid === auth.currentUser.uid) && (newContent && newContent !== markdown)) {
        if (auth.currentUser && uid === auth.currentUser.uid) {
            autosave(newContent || text)
        }
        
    }, [newContent, lang, pinned])
    return (
      <>
        <div className={styles.container}>
          {/* <DailyControl data={{markdown, lang, pinned, createdAt}} onChange={handleChange} /> */}
          {!loading && (
            <SideMenu
              content={
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn"
                    onClick={() => setPreview(!preview)}
                  >
                    {!preview ? "Preview" : "Edit"}
                  </motion.button>
                  {!readOnly && (
                    <>
                      <Switch
                        value={lang === "ar"}
                        title="Arabic"
                        cb={(arabic) => {
                          const language = arabic ? "ar" : "en";
                          setLang(language);
                        }}
                      />
                      <Switch value={pinned} title="Pin" cb={setPinned} />
                    </>
                  )}
                </>
              }
            />
          )}

          <div className={styles.editorContainer}>
            {!loading && !preview && (
              <div className={styles.createdAt}>
                {/* <Switch value={lang === 'ar'} title='Arabic' cb={arabic => {
                        const language = arabic ? 'ar' : 'en'
                        setLang(language)
                    }} />
                    <Switch value={pinned} title='Pin' cb={setPinned} /> */}
                {createdAt}
                {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn" 
                    onClick={async () => {
                        if (id) {
                            await updateDaily(markdown, id.toString(), lang)
                            router.push('/')
                        }
                    }}>Update</motion.button> */}
                {readOnly ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn pink disabled:opacity-25"
                    disabled={!readOnly}
                    onClick={async (e) => {
                      e.stopPropagation();
                        setPreview(true)
                        const doc = await cloneDaily(id, markdown, auth.currentUser.uid, lang, pinned);
                        router.push(`/dailies/${doc.id}`);
                        setId(doc.id)
                        setReadOnly(false)
                        setUid(auth.currentUser.uid)
                        setPreview(false)
                    }}
                  >
                    Clone
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn pink disabled:opacity-25"
                    disabled={readOnly}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const answer = confirm("Delete it?");
                      if (answer) {
                        // remove it
                        const docRef = doc(db, "dailies", id);
                        await deleteDoc(docRef);
                        router.push("/");
                      }
                    }}
                  >
                    Delete
                  </motion.button>
                )}

                <Link href="/">Home</Link>
              </div>
            )}
            {loading && <Loader />}
            {preview && <div dir="auto">{parseHTML(newContent)}</div>}
            {id && !preview && (
              <Editor
                data={newContent}
                language={lang}
                readOnly={readOnly}
                // onChange={setMarkdown}
                onChange={setNewContent}
                onReady={(e) => {
                  if (createdAt) {
                    setLoading(false);
                  }
                }}
                autoSave={setNewContent}
              />
            )}
          </div>
        </div>
      </>
    );
}

export default observer(Daily)


async function getDaily(id) {
  const docRef = doc(db, 'dailies', id)
  const dailySnapshot = await getDoc(docRef);
  return dailySnapshot;
}


async function updateDaily(md, id, lang='en', pinned=false) {
    // console.log('updating ', md, id, lang, pinned)
    const docRef = doc(db, 'dailies', id)

    await setDoc(docRef, {
        text: md,
        updatedAt: Timestamp.now(),
        lang,
        pinned
    }, {
        merge: true
    })
}

async function cloneDaily(clonedFrom, md, userId, lang='en', pinned=false) {
    const colRef = collection(db, 'dailies')
    // const docRef = doc(db, 'dailies', userId)
    const doc = await addDoc(colRef, {
        text: md,
        createdAt: Timestamp.fromDate(new Date()),
        uid: userId,
        clonedFrom,
        lang
    })
    return doc
}