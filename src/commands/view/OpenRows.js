module.exports = {
  run(editor, sender) {
    const elements = $('.gjs-block-categories').children();
    $(elements[1])
      .find('.gjs-blocks-c')
      .show();
    $(elements[1]).addClass('gjs-open');
  },

  stop() {
    console.log('Stop Open Rows');
  }
};
