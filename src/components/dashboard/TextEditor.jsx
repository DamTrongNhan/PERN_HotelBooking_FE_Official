import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const TextEditor = () => {
    const editorConfiguration = {
        toolbar: {
            items: [
                'healing',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'outdent',
                'indent',
                '|',
                'imageUpload',
                'blockQuote',
                'insertTable',
                'mediaEmbed',
                'undo',
                'redo',
                'alignment',
                'code',
                'codeBlock',
                'findAndReplace',
                'fontColor',
                'fontFamily',
                'fontSize',
                'fontBackgroundColor',
                'highlight',
                'horizontalLine',
                'htmlEmbed',
                'imageInsert'
            ]
        },
        language: 'en',
        image: {
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolBar: ['tableColumn', 'tableRow', 'mergeTableCells']
        }
    };
    return (
        <>
            <CKEditor
                editor={Editor}
                config={editorConfiguration}
                data={''}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log(data);
                }}
            />
        </>
    );
};

export default TextEditor;
