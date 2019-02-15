module.exports = {
  run(editor, sender) {
    const elements = $('.gjs-block-categories').children();
    $(elements[0])
      .find('.gjs-blocks-c')
      .show();
    $(elements[0]).addClass('gjs-open');
  },

  stop() {
    console.log('Stop Open Layouts');
  }
};
