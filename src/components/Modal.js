import React, { useState, useEffect } from 'react';
import { convertDataToHtml } from '../Helper';
import loadingAnimation from '../assets/loading.svg'

const Modal = ({ title = 'Published', display, docUrl, closeModal, dataByUser, id }) => {

    const [alertShow, setAlertShow] = useState('none')
    const [publishUrl, setpublishUrl] = useState('loading..')
    const [copyBtn, setCopyBtn] = useState(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
    </svg>)
    const [downloadBtn, setDownloadBtn] = useState(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
        <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z" />
        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
    </svg>)
    const [editorData, setEditorData] = useState(null)

    const getUserData = () => {
        if (dataByUser !== null) {
            if (Array.isArray(dataByUser)) {
                setEditorData(convertDataToHtml(dataByUser[0].blocks))
            } else {
                setEditorData(convertDataToHtml(dataByUser.blocks))
            }
        }
    }

    useEffect(() => getUserData(), [dataByUser])
    useEffect(() => setpublishUrl(docUrl), [docUrl])

    const downloadPdf = () => {
        setDownloadBtn(<img src={loadingAnimation} width="20" />)
        fetch(`https://api.apify.com/v2/acts/mhamas~html-string-to-pdf/runs?token=8yCApNndm692qJkSzuYmprmYv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "htmlString": editorData })
        }).then(res => res.json())
            .then(data => {
                fetchUrlUntilWorks(`https://api.apify.com/v2/key-value-stores/${data.data.defaultKeyValueStoreId}/records/OUTPUT?disableRedirect=1`)
            })
    }

    const fetchUrlUntilWorks = url => {
        fetch(url).then(res => res.json()).then(data => fetchUrlUntilWorks(url)).catch(e => {
            setDownloadBtn(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z" />
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
            </svg>)
            window.open(url, '_blank')
        })
    }


    return (
        <div className="modal" style={{ position: 'absolute', display: display }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()}>
                            <span aria-hidden="true" />
                        </button>
                    </div>
                    <div className="modal-body">
                        Your AirDoc is published!<br />
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="AirDoc URL" aria-label="AirDoc URL" aria-describedby="button-addon2" disabled value={publishUrl} />
                            <button className="btn btn-outline-secondary" type="button" id="button-addon2" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy" onClick={() => {
                                navigator.clipboard.writeText(docUrl)
                                setAlertShow('flex')
                                setCopyBtn(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check text-success" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                </svg>)
                                setTimeout(() => {
                                    setAlertShow('none')
                                    setCopyBtn(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                                    </svg>)
                                }, 2000);
                            }}>
                                {copyBtn}
                            </button>
                            {editorData !== null ? (<button className="btn btn-outline-secondary" type="button" id="button-addon2" data-bs-toggle="tooltip" data-bs-placement="top" title="Download PDF" onClick={() => downloadPdf()}>
                                {downloadBtn}
                            </button>)
                                : ''}
                        </div>
                        <small>Copy the url at a safe place to edit anytime!<br /> Change Link to <a href="#" onClick={() => publishUrl === docUrl ? setpublishUrl(docUrl.replace('ad', 'w')) : setpublishUrl(docUrl)}>{publishUrl === docUrl ? 'Uneditable' : 'Editable'}</a></small>
                        <div className={`d-${alertShow} justify-content-center`}>
                            <div className="alert alert-dismissible alert-success p-1 text-center w-50">
                                Copied!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Modal