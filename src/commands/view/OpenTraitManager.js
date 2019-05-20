const $ = require('backbone').$;

module.exports = {
  run(editor, sender) {
    this.sender = sender;

    var config = editor.Config;
    var pfx = config.stylePrefix;
    var tm = editor.TraitManager;
    var sm = editor.StyleManager;
    var panelC;

    if (!this.$cn) {
      var tmView = tm.getTraitsViewer();
      var confTm = tm.getConfig();

      this.$cn = $('<div></div>');
      this.$cn2 = $('<div></div>');
      this.$cnWrap = $(
        '<div class="gjs-sm-sectors gjs-one-bg gjs-two-color"></div>'
      );
      this.$cnSector = $('<div class="gjs-sm-sector no-select"></div>');
      this.$cnTitle = $('<div class="gjs-sm-title"></div>');
      this.$cnTitleInner = $(
        '<i id="gjs-sm-caret" class="fa fa-caret-right"></i>'
      );
      this.$cnTextInnet = $('<span>Basic</span>');
      this.$cnProperties = $(
        '<div class="gjs-sm-properties" style="display: none;"></div>'
      );

      this.$cnTitle.append(this.$cnTitleInner);
      this.$cnTitle.append(this.$cnTextInnet);
      this.$cnSector.append(this.$cnTitle);
      this.$cnSector.append(this.$cnProperties);
      // this.$cnProperties.append();
      this.$cnWrap.append(this.$cnSector);

      this.$cnTitle.bind('click', () => {
        this.toggleMenu();
      });

      this.$cn2.append(
        `<div class="${pfx}traits-label">${confTm.labelContainer}</div>`
      );
      this.$cn2.append(this.$cnWrap);
      this.$cn.append(this.$cn2);

      this.$header = $('<div>').append(
        `<div class="${confTm.stylePrefix}header">${confTm.textNoElement}</div>`
      );

      this.$cn.append(this.$header);

      // this.$cn2.append(
      //   `<div class="${pfx}traits-label">${confTm.labelContainer}</div>`
      // );
      // this.$cn2.append(tmView.render().el);
      this.$cnProperties.append(tmView.render().el);

      //adding style manager in trait manager;
      const smView = sm.render();
      this.$cn2.append('<div class="gjs-traits-label">Style settings</div>');
      this.$cn2.append(smView);

      var panels = editor.Panels;

      if (!panels.getPanel('views-container'))
        panelC = panels.addPanel({ id: 'views-container' });
      else panelC = panels.getPanel('views-container');

      panelC
        .set('appendContent', this.$cn.get(0))
        .trigger('change:appendContent');

      this.target = editor.getModel();
      this.listenTo(this.target, 'component:toggled', this.toggleTm);
    }

    this.toggleTm();
  },

  toggleMenu() {
    if (this.$cnSector.hasClass('gjs-sm-open')) {
      this.$cnSector.removeClass('gjs-sm-open');
      this.$cnTitleInner.removeClass('fa-caret-down');
      this.$cnTitleInner.addClass('fa-caret-right');
      this.$cnProperties.hide();
    } else {
      this.$cnSector.addClass('gjs-sm-open');
      this.$cnTitleInner.removeClass('fa-caret-right');
      this.$cnTitleInner.addClass('fa-caret-down');
      this.$cnProperties.show();
    }
  },

  /**
   * Toggle Trait Manager visibility
   * @private
   */
  toggleTm() {
    const sender = this.sender;
    if (sender && sender.get && !sender.get('active')) return;

    if (this.target.getSelectedAll().length === 1) {
      this.$cn2.show();
      this.$header.hide();
    } else {
      this.$cn2.hide();
      this.$header.show();
    }
  },

  stop() {
    this.$cn2 && this.$cn2.hide();
    this.$header && this.$header.hide();
  }
};
