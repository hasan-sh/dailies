
import { useContext, useEffect, useReducer, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { collection, doc, getDoc, Timestamp, addDoc, setDoc, } from 'firebase/firestore/lite';
import { observer } from "mobx-react-lite"
import Link from 'next/link';
import { DateContext, } from '../../store/date';

import styles from './dailies.module.css'
import { db } from '../../firebase';
import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';



const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

const Daily = observer(() => {
    const router = useRouter()
    const { uid }  = router.query
    if (!uid) {
        if (global?.window)
            global.window.history.back()
        return null
    }

    const [loading, setLoading] = useState(true)
    const windowSize = useWindowSize()

    const {date} = useContext(DateContext)
    const [markdown, setMarkdown] = useState('')
    return (
        <div className={styles.container}>
            <div className={styles.createdAt}>
                {date.toDateString()}
                <button
                    className="btn" 
                    disabled={!markdown}
                    onClick={async () => {
                        await createDaily(markdown, uid.toString(), date)
                        router.push('/')
                    }}>
                        Create
                </button>
                <Link href='/'>Home</Link>
            </div>
            {loading && <Loader />}
            <MarkdownEditor
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
            />
        </div>
    )
})

export default Daily


async function createDaily(md: string, userId: string, date: Date) {
    const colRef = collection(db, 'dailies')
    // const docRef = doc(colRef, userId)

    await addDoc(colRef, {
        text: md,
        createdAt: Timestamp.fromDate(date),
        uid: userId,
    })
}