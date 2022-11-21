// import dynamic from "next/dynamic";
// import { useEffect, useRef, useState } from "react";


// // const MarkdownEditor = dynamic(
// //   () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
// //   { ssr: false }
// // );

// // const ClassicEditor = dynamic(
// //   () => import("@ckeditor/ckeditor5-build-classic").then((mod) => mod.default),
// //   { ssr: false }
// // );

// // const CKEditor = dynamic(
// //   () => import("@ckeditor/ckeditor5-react").then((mod) => mod.default),
// //   { ssr: false }
// // );

// // import { CKEditor } from "@ckeditor/ckeditor5-react";
// // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import { DEFAULT_CONFIG } from "../../constants";

// export  default function Editor({ data, onReady, onChange, autoSave, language='en' }) {
//     const elementsRef = useRef()
//     const editorRef = useRef()
//     const [ editorLoaded, setEditorLoaded ] = useState( false )
//     const { CKEditor, ClassicEditor, Autosave } = editorRef.current || {}
//     const { Main, Editable} = elementsRef.current || {}

//     useEffect( () => {
//         console.log('new render', editorLoaded)
//         editorRef.current = {
//           CKEditor: require( '@ckeditor/ckeditor5-react' ).CKEditor, //Added .CKEditor
//           ClassicEditor: require( '@ckeditor/ckeditor5-build-classic' ),
//           Autosave: require('@ckeditor/ckeditor5-autosave/src/autosave'),
//         }
//         setEditorLoaded( true )
//     }, [] );

    
//     function changeLayout(e) {
//         if (!Main || !Editable) return
//         Main.lang = language
//         Editable.lang = language
//         if (language === 'ar'){
//             Main.dir = 'rtl'
//             Main.style.textAlign = 'right !important'
//             Editable.dir = 'rtl'
//             Editable.style.textAlign = 'right !important'
//         } else {
//             Main.dir = 'ltr'
//             Main.style.textAlign = 'left !important'
//             Editable.dir = 'ltr'
//             Editable.style.textAlign = 'left !important'
//         }

//     }

//     useEffect(() => {
//         changeLayout()
//     }, [language])
    

// return editorLoaded ? <CKEditor
//                 id='editor'
//                 config={{...DEFAULT_CONFIG, plugins: [Autosave],] language, autoSave: { save: e => autoSave(e.getData())}}}
//                 editor={ClassicEditor}
//                 data={data}
//                 onReady={editor => {
//                     const mainEl = editor.ui.view.element
//                     const editable = editor.ui.view.editable.element
//                     elementsRef.current = {
//                         Main: mainEl,
//                         Editable: editable
//                     }
//                     editor.focus()
//                     onReady(editor)
//                     // setEditor(editor)
//                     // setLoading(false)
//                 }}
//                 onFocus={changeLayout}
//                 onBlur={changeLayout}
//                 onChange={(event, editor) => {
//                     const data = editor.getData();
//                     onChange(data)
//                     changeLayout()
//                     // console.log({ event, editor, data });
//                     // setMarkdown(data)
//                 }}
//             /> : null
// }