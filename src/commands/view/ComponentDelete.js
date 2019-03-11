import { isArray } from 'underscore';

module.exports = {
  run(ed, sender, opts = {}) {
    let components = opts.component || ed.getSelectedAll();
    components = isArray(components) ? [...components] : [components];

    // It's important to deselect components first otherwise,
    // with undo, the component will be set with the wrong `collection`
    ed.select(null);

    components.forEach(component => {
      if (!component || !component.get('removable')) {
        console.warn('The element is not removable', component);
        return;
      }
      if (component) {
        const coll = component.collection;
        const pcoll = component.parent().collection;
        component.trigger('component:destroy');
        switch (component.attributes.tagName) {
          case 'input':
            const form = component.parent().parent().collection;
            coll && pcoll.remove(component.parent());
            if (pcoll.models.length <= 1) {
              coll && form.remove(pcoll.parent);
            }
            break;
          case 'img':
            coll && pcoll.remove(component.parent());
            break;
          default:
            break;
        }
        coll && coll.remove(component);
      }
    });

    return components;
  }
};
