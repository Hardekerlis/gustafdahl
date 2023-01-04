import dynamic from 'next/dynamic';
import React from 'react';

export const disableSSR = (component: React.FC<any>): React.FC<unknown> => {
  return dynamic(async () => component, { ssr: false }) as React.FC<unknown>;
};
