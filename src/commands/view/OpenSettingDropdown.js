module.exports = {
  run(editor, sender) {
    const elements = $('.gjs-sm-sectors .gjs-sm-sector .gjs-sm-properties');
    const sector = $('.gjs-sm-sectors .gjs-sm-sector');
    $(elements).show();
    $(sector).addClass('gjs-sm-open');
  },

  stop() {
    console.log('Stop Open Setting Dropdowns');
  }
};
