
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useRouter } from 'next/router'


import dynamic from 'next/dynamic';
    
import { collection, doc, getDoc, Timestamp, addDoc, setDoc, } from 'firebase/firestore';
import { observer } from "mobx-react-lite"
import Link from 'next/link';
import { DateContext, } from '../../store/date';

import styles from './dailies.module.css'
import { db } from '../../firebase';
// import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';
import Switch from '../../components/switch';
import { DEFAULT_CONFIG } from '../../constants';


const Editor  = dynamic(() => import('../../components/editor'));
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'


const Daily = observer(() => {

    const router = useRouter()
    const { uid }  = router.query
    if (!uid) {
        if (global?.window) {
            global.window.history.back()
        }
        return null
    }

    const [loading, setLoading] = useState(true)
    // const windowSize = useWindowSize()

    const {date} = useContext(DateContext)
    const [markdown, setMarkdown] = useState('')
    const [lang, setLang] = useState()

    return (
        <div className={styles.container}>
            <div className={styles.createdAt}>
                <Switch title='Arabic' cb={arabic => {
                    const language = arabic ? 'ar' : 'en'
                    setLang(language)
                }}/>
                {date.toDateString()}
                <button
                    className="btn"
                    disabled={!markdown}
                    onClick={async () => {
                        await createDaily(markdown, uid.toString(), date, lang)
                        router.push('/')
                    }}>
                    Create
                </button>
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
                waitingTime={10000} // 10 seconds
                autoSave={async data => {
                    if (data && data !== markdown) {
                        const { id } = await createDaily(data, uid.toString(), date, lang)
                        router.push('/dailies/' + id, `/dailies/${id}`,
                         {
                            query: { text: data, createdAt: Timestamp.fromDate(date), language: lang, uid: uid.toString() },
                        })
                    }
                }}
            />
            {/* <MarkdownEditor
                value={markdown}
                onChange={value => setMarkdown(value)}
                height="100px"
                className={styles.mdContainer}
                placeholder="Save your memories and thoughts!"
                visible={windowSize.width > 600}
                // arguments are informative
                onCreateEditor={() => setLoading(false)}
                autoFocus
                editable
            /> */}
        </div>
    )
})

export default Daily


async function createDaily(md, userId, date, lang='en') {
    const colRef = collection(db, 'dailies')
    // const docRef = doc(db, 'dailies', userId)
    const doc = await addDoc(colRef, {
        text: md,
        createdAt: Timestamp.fromDate(date),
        uid: userId,
        lang
    })
    return doc
}