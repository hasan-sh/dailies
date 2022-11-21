import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';

import { motion} from "framer-motion"

import styles from './dailies.module.css'
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDoc, query, setDoc, Timestamp, where } from 'firebase/firestore';
import Link from 'next/link';
// import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';
import { DEFAULT_CONFIG } from '../../constants';
import Switch from '../../components/switch';

// import SideMenu from '../../components/sideMenu';

const Editor = dynamic(() => import('../../components/editor'));

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const ClassicEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-build-classic").then((mod) => mod.default),
//   { ssr: false }
// );


const Daily = () => {
    const router = useRouter()
    const { id, text, createdAt: time, language } = router.query
    const [markdown, setMarkdown] = useState(text?.toString() || '')
    const [lang, setLang] = useState(language)
    const [createdAt, setCreatedAt] = useState(time)
    const [loading, setLoading] = useState(true)
    // const windowSize = useWindowSize()

    useEffect(() => {
        async function init() {
            if (!id)
                return
            const daily = await getDaily(id)
            const data = daily.data()
            if (data) {
                setMarkdown(data.text)
                setLang(data.lang)
                const ct = new Date(data.createdAt.seconds * 1000)
                setCreatedAt(ct.toDateString())
            } else {
                router.push('/dailies')
            }
        }
        init()

    }, [id])

    return (
        <div className={styles.container}>
            <div className={styles.createdAt}>
                <Switch arabic={lang === 'ar'} title='Arabic' cb={arabic => {
                    const language = arabic ? 'ar' : 'en'
                    setLang(language)
                }} />
                {createdAt}
                {/* <SideMenu /> */}
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
                            console.log('remote it', doc)
                            const docRef = doc(db, 'dailies', id)
                            await deleteDoc(docRef)
                            router.push('/')
                        }
                    }}>Delete</motion.button>

                <Link href='/'>Home</Link>
            </div>
            {loading && <Loader />}
            <Editor
                data={markdown}
                language={lang}
                onChange={setMarkdown}
                onReady={e => {
                    setLoading(false)
                }}
                autoSave={async data => {
                    if (data && data !== markdown) {
                        await updateDaily(data, id.toString(), lang)
                    }
                }}
            />
        </div>
    )
}

export default Daily


async function getDaily(id) {
  const docRef = doc(db, 'dailies', id)
  const dailySnapshot = await getDoc(docRef);
  return dailySnapshot;
}


async function updateDaily(md, id, lang='en') {
    const docRef = doc(db, 'dailies', id)

    await setDoc(docRef, {
        text: md,
        updatedAt: Timestamp.now(),
        lang
    }, {
        merge: true
    })
}