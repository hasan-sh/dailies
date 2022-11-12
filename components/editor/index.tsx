import dynamic from "next/dynamic";


// const MarkdownEditor = dynamic(
//   () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
//   { ssr: false }
// );

// const ClassicEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-build-classic").then((mod) => mod.default),
//   { ssr: false }
// );

// const CKEditor = dynamic(
//   () => import("@ckeditor/ckeditor5-react").then((mod) => mod.default),
//   { ssr: false }
// );

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { DEFAULT_CONFIG } from "../../pages/dailies/constants";

interface Props {
    data: string;
    onReady: (editor: ClassicEditor) => void
    onChange: (data: string) => void
}


export  default function Editor({ data, onReady, onChange }: Props) {

return <CKEditor
                id='editor'
                config={DEFAULT_CONFIG}
                editor={ClassicEditor}
                data={data}
                onReady={editor => {
                    editor.focus()
                    onReady(editor)
                    // setEditor(editor)
                    // setLoading(false)
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data)
                    // console.log({ event, editor, data });
                    // setMarkdown(data)
                }}
            />
}