module.exports = {
  run(editor, sender) {
    const elements = $('.gjs-block-category');
    const blocks = $('.gjs-blocks-c');
    elements.each(el => {
      $(elements[el]).addClass('gjs-open');
    });
    blocks.each(el => {
      $(blocks[el]).show();
    });
  },

  stop() {
    console.log('Stop Open Dropdowns');
  }
};
