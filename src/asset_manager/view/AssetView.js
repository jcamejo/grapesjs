import Backbone from 'backbone';
import { clone } from 'underscore';

export default Backbone.View.extend({
  initialize(o = {}) {
    this.options = o;
    this.collection = o.collection;
    const config = o.config || {};
    this.config = config;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.em = config.em;
    this.className = this.pfx + 'asset';
    this.listenTo(this.model, 'destroy remove', this.remove);
    this.model.view = this;
    const init = this.init && this.init.bind(this);
    init && init(o);
  },

  template() {
    const pfx = this.pfx;
    return `
      <div class="${pfx}preview-cont">
        ${this.getPreview()}
      </div>
      <div class="${pfx}meta">
        ${this.getInfo()}
      </div>
      <div class="${pfx}close" data-toggle="asset-remove">
        &Cross;
      </div>
    `;
  },

  /**
   * Update target if exists
   * @param {Model} target
   * @private
   * */
  updateTarget(target) {
    const config = this.config;
    const model = this.model;
    const { basePath } = config;
    let imagePath;

    if (target && target.set) {
      target.set('attributes', clone(target.get('attributes')));

      if (this.model.attributes.external) {
        imagePath = this.model.attributes.src;
      } else {
        imagePath = basePath + model.getFilename();
      }

      target.set('src', imagePath);
    }
  },

  getPreview() {
    return '';
  },

  getInfo() {
    return '';
  },

  render() {
    const el = this.el;
    el.innerHTML = this.template(this, this.model);
    el.className = this.className;
    return this;
  }
});
