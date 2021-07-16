import { React, useRef, useState, useEffect } from 'react'
import EditorJs from 'react-editor-js';
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import { useParams } from "react-router-dom";
import firebase from 'firebase';

const Editor = (props) => {
    const editorInstance = useRef();
    const [mounted, setMounted] = useState(false)
    const [defaultData, setDefaultData] = useState({ "blocks": [{ "data": { "level": 1, "text": "Start typing here.." }, "type": "header" }, { "data": { "text": "You can add images, links, heading, paragraphs etc. Get Creative!" }, "type": "paragraph" }] })

    const { id } = useParams()


    const EDITOR_JS_TOOLS = {
        embed: Embed,
        table: Table,
        paragraph: Paragraph,
        list: List,
        warning: Warning,
        code: Code,
        linkTool: LinkTool,
        image: {
            class: Image,
            config: {
                uploader: {
                    async uploadByFile(file) {
                        var storageRef = firebase.storage().ref();
                        var imagesRef = storageRef.child(file.name);
                        var uploadTask = await imagesRef.put(file);
                        const downloadURL = await uploadTask.ref.getDownloadURL();
                        return {
                            success: 1,
                            file: {
                                url: downloadURL,
                            }
                        }
                    }
                }
            }
        },
        raw: Raw,
        header: Header,
        quote: Quote,
        marker: Marker,
        checklist: CheckList,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        simpleImage: SimpleImage
    }

    if (!mounted) {
        if (id !== undefined) {
            const db = firebase.database()
            db.ref(id).get().then(snap => {
                if (snap.exists()) {
                    setDefaultData(snap.val())
                }
            }).catch(err => console.error(err))
        }
    }

    useEffect(() => {
        if (id !== undefined) {
            setTimeout(() => {
                setMounted(true)
            }, 3000)
        } else {
            setMounted(true)
        }
    }, [])


    const handleSave = async () => {
        const savedData = await editorInstance.current.instance.save();
        if (id === undefined) {
            props.changeData(savedData)
        } else {
            props.changeData([savedData, id])
        }
    }

    return mounted ?
        <EditorJs onChange={() => handleSave()} ref={editorInstance} data={defaultData} tools={EDITOR_JS_TOOLS} /> :
        'Loading..'
}

export default Editor