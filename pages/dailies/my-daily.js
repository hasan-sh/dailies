import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';

import { motion } from "framer-motion"

import styles from './dailies.module.css'
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDoc, query, setDoc, Timestamp, where } from 'firebase/firestore';
import Link from 'next/link';
// import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';
import { DEFAULT_CONFIG } from '../../constants';
import Switch from '../../components/switch';
import { DailiesContext } from '../../store/dailies';
import { observer } from 'mobx-react-lite';

import { parseHTML } from '../../utils';

import SideMenu from '../../components/sideMenu';

const Editor = dynamic(() => import('../../components/editor'));


const DailyControl = ({data, onChange}) => {

    return <div className={styles.createdAt}>
                <Switch value={lang === 'ar'} title='Arabic' cb={arabic => {
                    const language = arabic ? 'ar' : 'en'
                    setLang(language)
                }} />
                <Switch value={pinned} title='Pin' cb={setPinned} />
                {createdAt}
                <SideMenu content={
                    <>
                        <Switch value={pinned} title='Pin' cb={setPinned} />
                    </>
                }/>
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
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn pink"
                    onClick={async (e) => {
                        e.stopPropagation()
                        const answer = confirm('Delete it?')
                        if (answer) {
                            // remove it
                            const docRef = doc(db, 'dailies', id)
                            await deleteDoc(docRef)
                            router.push('/')
                        }
                    }}>Delete</motion.button>

                <Link href='/'>Home</Link>
            </div>
}

const Daily = () => {
    const { selectedDaily, firstRun } = useContext(DailiesContext)

    const router = useRouter()
    // const { id, text, createdAt: time, language, pinned: isPinned } = router.query
    const { id, text, createdAt: time, language, pinned: isPinned } = selectedDaily
    const [preview, setPreview] = useState(false)
    const [markdown, setMarkdown] = useState(text)
    const [newContent, setNewContent] = useState('')
    const [lang, setLang] = useState(language)
    const [createdAt, setCreatedAt] = useState(time)
    const [pinned, setPinned] = useState(isPinned)
    const [loading, setLoading] = useState(true)
    // const windowSize = useWindowSize()
    useEffect(() => {
        if (!id) {
            router.push('/')
        }

    }, [id])

    useEffect(() => {
        const autosave = async data => {
            await updateDaily(data, id.toString(), lang, pinned)
        }

        if ((newContent && newContent !== text) || lang !== language || pinned !== isPinned) {
            autosave(newContent || text)
        }
        
    }, [newContent, lang, pinned])


    return (
        <>
            <div className={styles.container}>
                {/* <DailyControl data={{markdown, lang, pinned, createdAt}} onChange={handleChange} /> */}
                <SideMenu content={
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.99 }}
                            className="btn"
                            onClick={() => setPreview(!preview)}>{!preview ? 'Preview' : 'Edit'}</motion.button>
                        <Switch value={lang === 'ar'} title='Arabic' cb={arabic => {
                            const language = arabic ? 'ar' : 'en'
                            setLang(language)
                        }} />
                        <Switch value={pinned} title='Pin' cb={setPinned} />
                    </>
                }/>

                <div className={styles.editorContainer}>

                {!loading && !preview && <div className={styles.createdAt}>
                    {/* <Switch value={lang === 'ar'} title='Arabic' cb={arabic => {
                        const language = arabic ? 'ar' : 'en'
                        setLang(language)
                    }} />
                    <Switch value={pinned} title='Pin' cb={setPinned} /> */}
                    {createdAt.toDateString()}
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
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.99 }}
                        className="btn pink"
                        onClick={async (e) => {
                            e.stopPropagation()
                            const answer = confirm('Delete it?')
                            if (answer) {
                                // remove it
                                const docRef = doc(db, 'dailies', id)
                                await deleteDoc(docRef)
                                router.push('/')
                            }
                        }}>Delete</motion.button>

                    <Link href='/'>Home</Link>
                </div>}
                {loading && <Loader />}
                {preview && <div dir='auto'>{parseHTML(markdown)}</div>}
                {id && !preview && <Editor
                    data={markdown}
                    language={lang}
                    onChange={setMarkdown}
                    onReady={e => {
                        setLoading(false)
                    }}
                    autoSave={setNewContent}
                />}
                </div>
            </div>
        </>
    )
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