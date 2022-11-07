import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import styles from './dailies.module.css'
import { db } from '../../firebase';
import { collection, doc, getDoc, query, setDoc, Timestamp, where } from 'firebase/firestore/lite';
import Link from 'next/link';



const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

const Daily = () => {
    const router = useRouter()
    let { id, text, createdAt: time } = router.query
    text = typeof text === "object" ? text.toString() : text
    id = typeof id === "object" ? id.toString() : id

    const [markdown, setMarkdown] = useState(text || '')
    const [createdAt, setCreatedAt] = useState(time)


    useEffect(() => {
        async function init() {
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
        if (id && !markdown) {
            init()
        }

    }, [markdown, id])
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
            <MarkdownEditor
                value={markdown}
                onChange={value => setMarkdown(value)}
                height="100px"
                className={styles.mdContainer}
                autoFocus
                editable
                visible 
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