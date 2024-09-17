import { IButtonStyles } from '@fluentui/react';
import { getRootEnv } from '../utils/envconfig';

const rootEnv = getRootEnv();
const buttonStyles: IButtonStyles = {
  root: {
    background: rootEnv.css['--spfx_color_primary'],
    color: rootEnv.css['--spfx_color_widget_text'],
    float: 'right',
    borderRadius: rootEnv.css['--spfx_border_radius'],
    transition: 'transform 0.2s ease-in-out',
    padding: '5px 5px !important',
    selectors: {
      'body, p, h1, h2, h3, h4, h5, h6, li, a, span, div': {
        fontFamily: rootEnv.css['--spfx_font_family'],
      }
    }
  },
  rootHovered: {
    color: rootEnv.css['--spfx_color_widget_text'],
    transform: 'scale(1.06)'
  },
  rootPressed: {
    color: rootEnv.css['--spfx_color_widget_text'],
    transform: 'scale(1.06)'
  },
  rootExpanded: {
    color: rootEnv.css['--spfx_color_widget_text'],
    transform: 'scale(1.06)'
  },
  icon: {
    color: rootEnv.css['--spfx_color_widget_text'],
  },
  iconHovered: {
    color: rootEnv.css['--spfx_color_widget_text'],
  },
  iconPressed: {
    color: rootEnv.css['--spfx_color_widget_text'],
  },
  menuIcon: {
    color: rootEnv.css['--spfx_color_widget_text'],
  },
  label: {
    fontWeight: 'normal',
  },
};

export default buttonStyles;
