import React, { useState } from 'react'
import Logo from '../logo.png'
import firebase from 'firebase/app'
import 'firebase/database'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'


const Navbar = ({ dataByUser, showModal }) => {
    const [isPublishing, setIsPublishing] = useState(false)
    let history = useHistory()
    const location = useLocation()

    const handleSave = () => {
        setIsPublishing(true)
        const db = firebase.database()
        if (dataByUser !== null) {
            if (Array.isArray(dataByUser)) {
                db.ref(dataByUser[1]).update(dataByUser[0]).then(() => {
                    showModal(`${dataByUser[1]}`)
                    setIsPublishing(false)
                }).catch(err => console.log(err))
            } else {
                const pushRef = db.ref().push(dataByUser)
                showModal(pushRef.key)
                history.push(`/ad/${pushRef.key}`)
                setIsPublishing(false)
            }
        } else {
            alert('Make a change!')
            setIsPublishing(false)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">AirDoc<img src={Logo} alt="airdoc" height="30px" /></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu" aria-controls="mainMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse d-sm-flex justify-content-end" id="mainMenu">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'} to="/about">About</Link>
                        </li>
                        <li className="nav-item mx-3">
                            <a className="btn btn-primary" onClick={handleSave}>{isPublishing ? (<div className="spinner-border text-light spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>) : 'Publish'}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar