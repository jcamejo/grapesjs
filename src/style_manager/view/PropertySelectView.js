import Backbone from 'backbone';
import PropertyView from './PropertyView';

const $ = Backbone.$;

export default PropertyView.extend({
  templateInput() {
    const pfx = this.pfx;
    const ppfx = this.ppfx;
    //TODO: span being an id, Add this to a class
    return `
      <div class="${ppfx}field ${ppfx}select">
        <span id="${pfx}input-holder"></span>
        <div class="${ppfx}sel-arrow">
          <div class="${ppfx}d-s-arrow"></div>
        </div>
      </div>
    `;
  },

  initialize(...args) {
    PropertyView.prototype.initialize.apply(this, args);
    this.listenTo(this.model, 'change:options', this.updateOptions);
  },

  updateOptions() {
    this.input = null;
    this.onRender();
  },

  onRender() {
    var pfx = this.pfx;
    const { em } = this;
    const options = this.model.getOptions();

    if (!this.input) {
      let optionsStr = '';

      options.forEach(option => {
        let name = option.name || option.value;
        if (name == 'empty') {
          name = em.t(`styleManager.properties.${this.property}-empty`);
        }
        let style = option.style ? option.style.replace(/"/g, '&quot;') : '';
        let styleAttr = style ? `style="${style}"` : '';
        let value = option.value.replace(/"/g, '&quot;');
        optionsStr += `<option value="${value}" ${styleAttr}>${name}</option>`;
      });

      const inputH = this.el.querySelector(`#${pfx}input-holder`);
      inputH.innerHTML = `<select>${optionsStr}</select>`;
      this.input = inputH.firstChild;
    }
  }
});
