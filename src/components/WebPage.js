import { useEffect, useState } from "react"
import { convertDataToHtml } from "../Helper"
import { useParams } from "react-router-dom";
import firebase from "firebase/app";

const WebPage = () => {
    const { id } = useParams()
    const [mounted, setMounted] = useState(false)
    const [editorJsonData, setEditorJsonData] = useState([{ "data": { "level": 1, "text": "Start typing here.." }, "type": "header" }, { "data": { "text": "You can add images, links, heading, paragraphs etc. Get Creative!" }, "type": "paragraph" }])
    useEffect(() => {
        if (id !== undefined) {
            setTimeout(() => {
                setMounted(true)
            }, 3000)
        } else {
            setMounted(true)
        }
    }, [])

    if (!mounted) {
        if (id !== undefined) {
            const db = firebase.database()
            db.ref(id).get().then(snap => {
                if (snap.exists()) {
                    setEditorJsonData(snap.val().blocks)
                }
            }).catch(err => console.error(err))
        }
    }

    return mounted ? (
        <div className="text-left mt-4 container" dangerouslySetInnerHTML={{ __html: convertDataToHtml(editorJsonData) }}></div>
    ) : 'Loading..'
}

export default WebPage