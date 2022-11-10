import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import styles from './dailies.module.css'
import { db } from '../../firebase';
import { collection, doc, getDoc, query, setDoc, Timestamp, where } from 'firebase/firestore/lite';
import Link from 'next/link';
import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';



const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

const Daily = () => {
    const router = useRouter()
    const { id, text, createdAt: time } = router.query
    const [markdown, setMarkdown] = useState(text?.toString() || '')
    const [createdAt, setCreatedAt] = useState(time)
    const [loading, setLoading] = useState(true)
    const windowSize = useWindowSize()


    useEffect(() => {
        async function init() {
            if (!id)
                return
            const daily = await getDaily(id)
            const data = daily.data()
            if (data) {
                setMarkdown(data.text)
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
                {createdAt}
                <button className="btn" onClick={async () => {
                    if (id) {
                        await updateDaily(markdown, id.toString())
                        router.push('/')
                    }
                    }}>Update</button>
                <Link href='/'>Home</Link>
            </div>
            {loading && <Loader />}
            <MarkdownEditor
                value={markdown}
                onChange={value => setMarkdown(value)}
                height="100%"
                className={styles.mdContainer}
                visible={windowSize.width > 600}
                // arguments are informative
                onCreateEditor={() => setLoading(false)}
                autoFocus
                editable
            />
        </div>
    )
}

export default Daily


async function getDaily(id: any) {
  const docRef = doc(db, 'dailies', id)
  const dailySnapshot = await getDoc(docRef);
  return dailySnapshot;
}


async function updateDaily(md: string, id: string) {
    const docRef = doc(db, 'dailies', id)

    await setDoc(docRef, {
        text: md,
        updatedAt: Timestamp.now()
    }, {
        merge: true
    })
}