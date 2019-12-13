import Backbone from 'backbone';

const $ = Backbone.$;

export default {
  run(editor, sender) {
    this.sender = sender;
    const em = editor.getModel();

    var config = editor.Config;
    var pfx = config.stylePrefix;
    var tm = editor.TraitManager;
    var sm = editor.StyleManager;
    var sem = editor.SelectorManager;
    var panelC;
    var selectedComponent = editor.getSelected();

    if (!this.$cn) {
      var tmView = tm.getTraitsViewer();
      var confTm = tm.getConfig();

      this.$cn = $('<div class="container-1"></div>');
      this.$settingsContainer = $('<div class="container-2"></div>');
      this.$cn.append(this.$settingsContainer);

      this.$cnWrapTraits = $(
        '<div class="gjs-sm-sectors gjs-one-bg gjs-two-color gjs-trait-manager"></div>'
      );
      this.$cnTraitsBasic = $('<div class="gjs-sm-sector no-select"></div>');
      this.$cnTitleTraits = $('<div class="gjs-sm-title"></div>');
      this.$cnTitleTraitsInner = $(
        '<i id="gjs-sm-caret" class="gjs-caret fa fa-caret-right"></i>'
      );
      this.$cnTextInner = $('<span>Basic</span>');
      this.$cnTraits = $(
        '<div class="gjs-sm-properties" style="display: none;"></div>'
      );

      const semView = sem.render();
      this.$settingsContainer.append(semView);

      this.$cnTitleTraits.append(this.$cnTitleTraitsInner);
      this.$cnTitleTraits.append(this.$cnTextInner);
      this.$cnTraitsBasic.append(this.$cnTitleTraits);
      this.$cnTraitsBasic.append(this.$cnTraits);
      this.$cnWrapTraits.append(this.$cnTraitsBasic);

      this.$cnTitleTraits.bind('click', () => {
        this.toggleMenu(this.$cnTraitsBasic);
      });

      this.$settingsContainer.append(
        `<div class="${pfx}traits-label">${confTm.labelContainer}</div>`
      );
      this.$noActions = $('<h1> No actions </h1>');
      this.$settingsContainer.append(this.$noActions);
      this.$settingsContainer.append(this.$cnWrapTraits);

      this.$header = $('<div>').append(
        `<div class="${confTm.stylePrefix}header">${em.t(
          'traitManager.empty'
        )}</div>`
      );

      this.$cn.append(this.$header);

      this.$cnTraits.append(tmView.render().el);

      //adding style manager inside trait manager;
      const smView = sm.render();
      this.$settingsContainer.append(
        '<div class="gjs-traits-label">Style settings</div>'
      );

      this.$settingsContainer.append(smView);

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
    //Open by Default
    if (!this.$cnTraitsBasic.hasClass('gjs-sm-open')) {
      this.toggleMenu(this.$cnTraitsBasic);
    }
  },

  toggleMenu($section) {
    const element = $section.get(0);
    if ($section.hasClass('gjs-sm-open')) {
      $section.removeClass('gjs-sm-open');
      $('.gjs-caret', element).removeClass('fa-caret-down');
      $('.gjs-caret', element).addClass('fa-caret-right');
      $('.gjs-sm-properties', element).hide();
    } else {
      $section.addClass('gjs-sm-open');
      $('.gjs-caret', element).removeClass('fa-caret-right');
      $('.gjs-caret', element).addClass('fa-caret-down');
      $('.gjs-sm-properties', element).show();
    }
  },

  /**
   * Toggle Trait Manager visibility
   * @private
   */
  toggleTm() {
    const sender = this.sender;
    const target = this.target.getSelected();

    if (sender && sender.get && !sender.get('active')) return;

    if (this.target.getSelectedAll().length === 1) {
      this.$settingsContainer.show();
      this.$header.hide();

      if (target && target.get('traits').length == 0) {
        this.$cnWrapTraits.hide();
        this.$noActions.show();
      } else {
        this.$cnWrapTraits.show();
        this.$noActions.hide();
      }
    } else {
      this.$settingsContainer.hide();
      this.$header.show();
    }
  },

  stop() {
    this.$settingsContainer && this.$settingsContainer.hide();
    this.$header && this.$header.hide();
  }
};
