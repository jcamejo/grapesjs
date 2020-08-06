const swv = 'sw-visibility';
const expt = 'export-template';
const osm = 'open-sm';
const otm = 'open-tm';
const cs = 'comp-settings';
const ocs = 'open-comp-settings';
const ola = 'open-layers';
const obl = 'open-blocks';
const ful = 'fullscreen';
const prv = 'preview';

export default {
  stylePrefix: 'pn-',

  // Default panels fa-sliders for features
  defaults: [
    {
      id: 'commands',
      buttons: [{}]
    },
    {
      id: 'options',
      buttons: [
        {
          id: prv,
          title: '<span>PREVIEW</span>',
          className: 'fa fa-eye',
          command: prv,
          context: prv,
          attributes: { title: 'Preview' }
        },
        {
          id: ful,
          title: '<span>FULLSCREEN</span>',
          className: 'fa fa-arrows-alt',
          command: ful,
          context: ful,
          attributes: { title: 'Fullscreen' }
        }
      ]
    },
    {
      id: 'views',
      buttons: [
        {
          id: cs,
          className: 'fa fa-cog',
          command: ocs,
          togglable: 0,
          attributes: { title: 'Settings' }
        },
        {
          id: obl,
          className: 'fa fa-th-large',
          command: obl,
          togglable: 0,
          attributes: { title: 'Open Blocks' }
        }
      ]
    }
  ],

  // Editor model
  em: null,

  // Delay before show children buttons (in milliseconds)
  delayBtnsShow: 300
};
