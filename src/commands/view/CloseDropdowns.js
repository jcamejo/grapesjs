module.exports = {
  run(editor, sender) {
    const elements = $('.gjs-open');
    const blocks = $('.gjs-blocks-c');
    elements.each(el => {
      $(elements[el]).removeClass('gjs-open');
    });
    blocks.each(el => {
      $(blocks[el]).hide();
    });
  },

  stop() {
    console.log('Stop Close DropDown');
  }
};
