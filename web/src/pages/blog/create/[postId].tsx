import { Box, Button } from '@chakra-ui/react';
import { useCreatePostMutation } from 'generated/graphql';
import { useIsAuth } from 'hooks/useIsAuth';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { EditorCore } from 'utils/editorInitialize';
import { getCurrentUserServerSide } from 'utils/getCurrentUserServerSide';

const Editor = dynamic(() => import('utils/editorInitialize'), { ssr: false });

export const getServerSideProps = async (ctx: NextContext) => {
  const user = await getCurrentUserServerSide(ctx);

  if (!user || !user.isAdmin) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

const Create: React.FC<{}> = ({}) => {
  useIsAuth();

  const router = useRouter();

  const [{ fetching }, createPost] = useCreatePostMutation();
  const [draftSaved, setDraftSaved] = useState(false);

  const editorCore = useRef(null);

  const handleSave = useCallback(async (publish: boolean) => {
    const savedData = await (
      editorCore.current as unknown as EditorCore
    )?.dangerouslyLowLevelInstance?.save();

    const parsed = savedData.blocks.map((block: any) => {
      return {
        data: block.data,
        blockId: block.id,
        type: block.type,
      };
    });

    // const result = await createPost({
    //   data: {
    //     publish,
    //     title: parsed[0].data.text,
    //     post: parsed,
    //   },
    // });

    if (publish) {
      // TODO: Redirect to post website
    } else {
      setDraftSaved(true);
    }
  }, []);

  const changeHandler = useCallback(() => {
    console.log('change', draftSaved);
    if (draftSaved) setDraftSaved(false);
  }, [draftSaved]);

  return (
    <DefaultLayout pt='80px'>
      <Box height='60px'>
        <Button
          mr='10px'
          onClick={() => {
            handleSave(true);
          }}
          isLoading={fetching}
        >
          Publish
        </Button>

        <Button
          onClick={() => {
            handleSave(false);
          }}
          isLoading={fetching}
        >
          {draftSaved ? 'Drafted saved' : 'Save draft'}
        </Button>
      </Box>
      <Box bgColor='white' color='black' height='100%'>
        <Editor onChange={() => changeHandler()} editorCore={editorCore} />
      </Box>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Create);
