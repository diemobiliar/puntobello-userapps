import { IDetailsListStyles, IDetailsRowStyles } from '@fluentui/react';
import { getRootEnv } from '../utils';

const rootEnv = getRootEnv();

export const detailsRowStyles: Partial<IDetailsRowStyles> = {
  root: {
    width: '100%',
    marginTop: 10,
    borderRadius: 5,
    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
    transition: '0.15s background-color ease, 0.3s transform ease', 
    selector: {
      '&:hover': {
        backgroundColor: rootEnv.css['--spfx_color_grey_brightness_bright'],
        transform: 'scale(1.01)',
      },
    },
  },
  fields: {
    justifyContent: 'space-between',
    width: '100%',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 0,
    width: 'auto !important',
    padding: '8px 12px 8px 24px',
  },
};

export const detailsListStyles: Partial<IDetailsListStyles> = {
  root: {
    overflow: 'visible',
    marginTop: '-10px',
  },
};