import { SmallAddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useCreatePostMutation, useCurrentUserQuery } from 'generated/graphql';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';

// export const getServerSideProps = async (ctx: NextContext) => {
//   const user = await getCurrentUserServerSide(ctx);

//   let isAdmin = false;

//   if (user && user.isAdmin) isAdmin = !isAdmin;

//   return {
//     props: {
//       isAdmin: isAdmin,
//     },
//   };
// };

// interface BlogProps {
//   isAdmin: boolean;
// }

const Blog: React.FC<{}> = ({}) => {
  const [{ data }] = useCurrentUserQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const input = useRef(null);
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  const createPostHandler = async () => {
    const title = (input.current as any).value;

    const { data } = await createPost({
      title,
    });

    router.push(
      `/blog/create/${data?.createPost?.post?.id}?title=${data?.createPost?.post?.title}`,
    );
  };

  return (
    <DefaultLayout>
      <Flex>
        <Heading as='h4' size='md' mb={5}>
          Posts
        </Heading>
        {data && data?.currentUser && data.currentUser.isAdmin ? (
          <Tooltip label='Create blog post'>
            <Button ml='auto' onClick={onOpen}>
              <SmallAddIcon />
            </Button>
          </Tooltip>
        ) : (
          <></>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input ref={input} placeholder='Post title' />
          </ModalBody>
          <ModalFooter>
            <Button bgColor='green' mr='3' onClick={createPostHandler}>
              Submit
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Blog);
