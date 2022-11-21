
import { useEffect, useRef, useState } from "react";
// import * as CustomEditor from './ckeditor';

import { DEFAULT_CONFIG } from "../../constants";

export  default function Editor({ data, onReady, onChange, autoSave, language='en', waitingTime=3000 }) {
    const elementsRef = useRef()
    const editorRef = useRef()
    const [editorLoaded, setEditorLoaded] = useState(false)
    const { CKEditor, CustomEditor, Autosave } = editorRef.current || {}
    const { Main, Editable } = elementsRef.current || {}

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
            CustomEditor: require('./ckeditor'),
            //   Autosave: require('@ckeditor/ckeditor5-autosave/src/autosave'),
        }
        setEditorLoaded(true)
    }, []);


    function changeLayout(e) {
        if (!Main || !Editable) return
        Main.lang = language
        Editable.lang = language
        if (language === 'ar') {
            Main.dir = 'rtl'
            Main.style.textAlign = 'right !important'
            Editable.dir = 'rtl'
            Editable.style.textAlign = 'right !important'
        } else {
            Main.dir = 'ltr'
            Main.style.textAlign = 'left !important'
            Editable.dir = 'ltr'
            Editable.style.textAlign = 'left !important'
        }

    }

    useEffect(() => {
        changeLayout()
    }, [language])


    // Update the "Status: Saving..." info.
    function displayStatus( editor ) {
        const pendingActions = editor.plugins.get( 'PendingActions' );
        const statusIndicator = document.querySelector( '#editor-status' );

        if (!statusIndicator) return
        pendingActions.on( 'change:hasAny', ( evt, propertyName, newValue ) => {
            console.log(newValue, editor.getData())
            if ( newValue ) {
                statusIndicator.classList.remove( 'done' );
                statusIndicator.classList.add( 'busy' );
            } else {
                statusIndicator.classList.add( 'done' );
                statusIndicator.classList.remove( 'busy' );
            }
        } );
    }   

// </><div style={{height: '50%', }}>

    return editorLoaded ? <>
    <CKEditor
        id='editor'
        config={{
            ...DEFAULT_CONFIG,
            language,
            autosave: {
                waitingTime,
                save: async e => {
                    await autoSave(e.getData())
                    displayStatus(e)
                }
            }
        }}
        editor={CustomEditor}
        data={data}

        onReady={editor => {
            const mainEl = editor.ui.view.element
            const editable = editor.ui.view.editable.element
            elementsRef.current = {
                Main: mainEl,
                Editable: editable
            }
            editor.focus()
            onReady(editor)
            // setEditor(editor)
            // setLoading(false)
        }}
        onFocus={changeLayout}
        onBlur={changeLayout}
        onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data)
            changeLayout()
            // console.log({ event, editor, data });
            // setMarkdown(data)
        }}
    />
    <div id="editor-status" style={{position: 'relative'}} />
    </> : null
}