import { EDITOR_JS_TOOLS } from 'constants/editorJsTools';
import React from 'react';
import { createReactEditorJS } from 'react-editor-js';

interface EditorInitializeProps {
  children?: React.ReactNode;
}

const EditorInitialize: React.FC<EditorInitializeProps> = ({}) => {
  const Editor = createReactEditorJS();
  return (
    <Editor
      defaultValue={{
        blocks: [],
      }}
      tools={EDITOR_JS_TOOLS}
      inlineToolbar={true}
    />
  );
};

export default EditorInitialize;
