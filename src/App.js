import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Editor from './components/Editor'
import Modal from './components/Modal'
import About from './components/About'
import WebPage from './components/WebPage'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import app from 'firebase/app';
import { firebaseConfig } from './fb-config';

app.initializeApp(firebaseConfig)

function App() {
  const [editorData, setEditorData] = useState(null)
  const [display, setDisplay] = useState('none')
  const [docId, setDocId] = useState('')

  return (
    <BrowserRouter>
      <Navbar dataByUser={editorData} showModal={(dId) => {
        setDocId(dId)
        setDisplay('block')
      }} />
      <Switch>
        <Route exact path="/">
          <Editor changeData={data => setEditorData(data)} />
        </Route>
        <Route path="/about" component={About} />
        <Route path="/ad/:id">
          <Editor changeData={data => setEditorData(data)} />
        </Route>
        <Route path="/w/:id" component={WebPage} />
      </Switch>
      <Modal display={display} docUrl={`${window.location.origin}/ad/${docId}`} closeModal={() => setDisplay('none')} dataByUser={editorData} id={docId} />
    </BrowserRouter>
  );
}

export default App;
