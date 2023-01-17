import { Box } from '@chakra-ui/layout';
import { Global, css } from '@emotion/react';
import { EDITOR_JS_TOOLS } from 'constants/editorJsTools';
import React, { useCallback } from 'react';
import { createReactEditorJS } from 'react-editor-js';

interface EditorInitializeProps {
  children?: React.ReactNode;
  editorCore: any;
  onChange?(): void;
  title: string;
}

export interface EditorCore {
  dangerouslyLowLevelInstance: {
    save(): any;
  };
}

const EditorInitialize: React.FC<EditorInitializeProps> = ({
  editorCore,
  onChange,
  title,
}) => {
  const Editor = createReactEditorJS();

  const handleInitialize = useCallback(async (instance: EditorCore) => {
    (editorCore.current as any) = instance;
  }, []);

  // save.current = useCallback(async () => {
  //   const savedData = await (
  //     editorCore.current as unknown as EditorCore
  //   )?.dangerouslyLowLevelInstance?.save();

  //   return savedData;
  // }, []);

  const splitTitle = title.split('');

  const capitalized = splitTitle[0].toUpperCase();
  splitTitle[0] = capitalized;

  return (
    <>
      {/* This is global is stupid. Without it all h tags would be the same size */}
      <Global
        styles={css`
          .editor h1,
          .editor h2,
          .editor h3,
          .editor h4,
          .editor h5,
          .editor h6 {
            font-size: revert;
            margin: 0;
          }
        `}
      />
      {/* <Button onClick={handleSave}>Save</Button> */}
      <Box pt='2' className='editor'>
        <Editor
          onChange={onChange}
          defaultValue={{
            time: 1635603431943,
            blocks: [
              {
                id: 'header_id',
                data: {
                  text: splitTitle.join(''),
                  level: 1,
                },
                type: 'header',
              },
            ],
          }}
          tools={EDITOR_JS_TOOLS}
          inlineToolbar={true}
          onInitialize={handleInitialize}
          autofocus={true}
        />
      </Box>
    </>
  );
};

export default EditorInitialize;
