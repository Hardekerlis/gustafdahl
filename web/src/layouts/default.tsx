import { Wrapper, WrapperVariant } from 'components';
import { NavBar } from 'components/NavBar';
import React from 'react';

interface DefaultLayoutProps {
  children?: React.ReactNode;
  variant?: WrapperVariant;
  loading?: boolean;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  variant,
  loading = false,
}) => {
  return (
    <>
      <NavBar />
      <Wrapper loading={loading} variant={variant}>
        {children}
      </Wrapper>
    </>
  );
};
