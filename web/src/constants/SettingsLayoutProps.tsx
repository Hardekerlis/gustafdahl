import { WrapperVariant } from 'components';

const SettingsLayoutProps = {
  h: '100%',
  w: '100%',
  templateRows: 'repeat(20, 1fr)',
  templateColumns: 'repeat(5, 1fr)',
  gap: 4,
  variant: 'large' as WrapperVariant,
  pb: 5,
};

Object.freeze(SettingsLayoutProps);

export { SettingsLayoutProps };
