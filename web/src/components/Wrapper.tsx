import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariant = 'small' | 'regular' | 'large';

interface WrapperProps {
  children: React.ReactNode;
  variant?: WrapperVariant;
  loading?: boolean;
  pt?: string;
}

enum Sizes {
  SMALL = '400px',
  REGULAR = '800px',
  LARGE = '1200px',
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular',
  loading,
  pt,
}) => {
  const getMaxWidth = () => {
    switch (variant) {
      case 'small':
        return Sizes.SMALL;
        break;
      case 'regular':
        return Sizes.REGULAR;
        break;
      case 'large':
        return Sizes.LARGE;
        break;
      default:
        return variant;
    }
  };

  return (
    <Box
      pt={pt ? pt : '100px'}
      mx='auto'
      maxW={getMaxWidth()}
      w='100%'
      h='100vh'
    >
      {loading ? (
        <Flex justifyContent='center' alignItems='center' h='100%' w='100%'>
          <Spinner size='xl' />
        </Flex>
      ) : (
        children
      )}
    </Box>
  );
};
