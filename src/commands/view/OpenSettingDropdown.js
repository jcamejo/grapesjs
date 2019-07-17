module.exports = {
  run(editor, sender) {
    const elements = $('.gjs-sm-sectors .gjs-sm-sector .gjs-sm-properties');
    const sector = $('.gjs-sm-sectors .gjs-sm-sector');
    const caret = $('.fa-caret-right');
    $(elements).show();
    $(sector).addClass('gjs-sm-open');
    $(caret).addClass('fa-caret-down');
    $(caret).removeClass('fa-caret-right');
  },

  stop() {
    console.log('Stop Open Setting Dropdowns');
  }
};
