import { Button, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

interface SettingsNavProps {
  children?: React.ReactNode;
}

export const SettingsNav: React.FC<SettingsNavProps> = ({ ...props }) => {
  const router = useRouter();
  return (
    <GridItem rowSpan={20} colSpan={1} {...props}>
      <Button w='100%' onClick={() => router.push('/settings')}>
        Overview
      </Button>
      <Button onClick={() => router.push('/settings/security')} w='100%' mt={2}>
        Security
      </Button>
    </GridItem>
  );
};
