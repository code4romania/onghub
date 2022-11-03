import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import './RichText.css';

const RichText = () => {

  const [a, setA] = useState<any>();

  return (
    <Editor
      editorState={a}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={(e) => setA(e)}
    />
  )

}

export default RichText
