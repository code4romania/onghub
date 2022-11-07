import React from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import './RichText.css';
import { RichTextConfig } from './RichTextConfig.interface';

const RichText = (props: { config: RichTextConfig, readonly?: boolean }) => {
  return (
    <div className="relative w-full">
      {props.config.label && (
        <label
          htmlFor="email"
          className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700 pb-1"
        >
          {props.config.label}
        </label>
      )}
      {props.readonly && <span>{props.config.label || '-'}</span>}
      <Editor
        editorState={props.config.value || ''}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={props.config.onChange}
      />
      {props.config.error && (
        <p className="mt-1 sm:text-sm text-xs text-red-600" id={`${props.config.id}__input-error`}>
          {props.config.error}
        </p>
      )}
    </div>
  )
}

export default RichText
