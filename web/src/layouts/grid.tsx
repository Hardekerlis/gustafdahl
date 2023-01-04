import { BackgroundProps, Grid, GridProps } from '@chakra-ui/react';
import { Wrapper, WrapperVariant } from 'components';
import { NavBar } from 'components/NavBar';
import React from 'react';

type GridLayoutProps = GridProps & {
  children?: React.ReactNode;
  variant?: WrapperVariant;
  debug?: boolean;
  loading?: boolean;
};

const BackgroundColors: BackgroundProps['bgColor'] = ['gray.600'];

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  variant,
  debug = false,
  loading = true,
  ...props
}) => {
  return (
    <>
      <NavBar />

      <Wrapper loading={loading} variant={variant}>
        <Grid {...props}>
          {debug && children
            ? React.Children.map(children, child => {
                if (React.isValidElement<GridLayoutProps>(child)) {
                  return React.cloneElement(child, {
                    bgColor: BackgroundColors[
                      Math.floor(Math.random() * BackgroundColors.length)
                    ] as BackgroundProps['bgColor'],
                  });
                }

                return child;
              })
            : children}
        </Grid>
      </Wrapper>
    </>
  );
};
