import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic';


import styles from './dailies.module.css'
import { db } from '../../firebase';
import { collection, doc, getDoc, query, setDoc, Timestamp, where } from 'firebase/firestore/lite';
import Link from 'next/link';
import useWindowSize from '../../components/useWindow';
import Loader from '../../components/loader';
import { DEFAULT_CONFIG } from './constants';
import Switch from '../../components/switch';

const Editor = dynamic(() => import('../../components/editor'));

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const ClassicEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-build-classic").then((mod) => mod.default),
//   { ssr: false }
// );


const Daily = () => {
    const router = useRouter()
    const { id, text, createdAt: time } = router.query
    const [markdown, setMarkdown] = useState(text?.toString() || '')
    const [createdAt, setCreatedAt] = useState(time)
    const [loading, setLoading] = useState(true)
    const windowSize = useWindowSize()
    const [editor, setEditor] = useState<ClassicEditor>()


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
                <Switch title='Arabic' cb={async arabic => {
                    if (!editor) return 
                    console.log('clicking...')
                    setLoading(true)
                    const el = editor.sourceElement
                    await editor.destroy()
                    const nEditor = await ClassicEditor.create(el || '', {
                        ...DEFAULT_CONFIG,
                        language: arabic ? 'ar' : 'en',
                    })
                    nEditor.setData(markdown)
                    setEditor(nEditor)
                    setLoading(false)
                }}/>
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
            <Editor
                data={markdown}
                onChange={setMarkdown}
                onReady={e => {
                    setEditor(e)
                    setLoading(false)
                }}
            />
            {/* <CKEditor
                id='editor'
                config={DEFAULT_CONFIG}
                editor={ClassicEditor}
                data={markdown}
                onReady={editor => {
                    editor.focus()
                    setEditor(editor)
                    setLoading(false)
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                    setMarkdown(data)
                }}
            /> */}
            {/* <MarkdownEditor
                value={markdown}
                onChange={value => setMarkdown(value)}
                height="100%"
                className={styles.mdContainer}
                visible={windowSize.width > 600}
                // arguments are informative
                onCreateEditor={() => setLoading(false)}
                autoFocus
                editable
            /> */}
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