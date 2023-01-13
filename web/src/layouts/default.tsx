import { Wrapper, WrapperVariant } from 'components';
import { NavBar } from 'components/NavBar';
import React from 'react';

interface DefaultLayoutProps {
  children?: React.ReactNode;
  variant?: WrapperVariant;
  loading?: boolean;
  pt?: string;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  variant,
  loading = false,
  pt,
}) => {
  return (
    <>
      <NavBar />
      <Wrapper pt={pt} loading={loading} variant={variant}>
        {children}
      </Wrapper>
    </>
  );
};
