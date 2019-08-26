---
title: Component Manager
---

# Component Manager

The Component is the base element for template composition. It is atomic, so elements like images, text boxes, maps, etc. fit the definition of a Component. The concept of the component was made to allow the developer to bind different behaviors to different elements. Like for example, opening the Asset Manager on double click of the image.

::: warning
This guide is referring to GrapesJS v0.14.67 or higher
:::

[[toc]]


## How Components work?

Let's see in detail how components work by looking at all steps from adding an HTML string to the editor.

This is how we can add new components to the canvas:

```js
// Append components directly to the canvas
editor.addComponents(`<div>
  <img src="https://path/image" />
  <span title="foo">Hello world!!!</span>
</div>`);

// or into some, already defined, component.
// For instance, appending to a selected component would be:
editor.getSelected().append(`<div>...`);

// Actually, editor.addComponents is an alias of...
editor.getWrapper().append(`<div>...`);
```

::: tip
If you need to append a component in a specific position, you can use `at` option. To add a component on top of all others (in the same collection) you would use
```js
component.append('<div>...', { at: 0 })
```
or in the middle
```js
const { length } = component.components();
component.append('<div>...', { at: parseInt(length / 2, 10) })
```
:::

### Component Definition

In the first step the HTML string is parsed and trasformed to what is called **Component Definition**, so the result of the input would be:

```js
{
  tagName: 'div',
  components: [
    {
      type: 'image',
      attributes: { src: 'https://path/image' },
    }, {
      tagName: 'span',
      type: 'text',
      attributes: { title: 'foo' },
      components: [{
        type: 'textnode',
        content: 'Hello wdsforld!!!'
      }]
    }
  ]
}
```

The real **Component Definition** would be a little bit bigger so we reduced the JSON for the sake of simplicity.

You can notice the result is similar to what is generally called a **Virtual DOM**, a lightweight rappresentation of the DOM element. This actually helps the editor to keep track of the state of our elements and make performance-friendly changes/updates.
The meaning of properties like `tagName`, `attributes` and `components` are quite obvious, but what about `type`?! This particular property specifies the actual **Component** of our **Component Definition** (you check the list of default components [below](#built-in-components)) and if it's omitted, the default one will be used `type: 'default'`.
At this point, a good question would be, how the editor assignes those types by starting from a simple HTML string? This step is identified as **Component Recognition** and it's explained in detail in the next paragraph.

### Component Recognition and Component Type Stack

As we said before, when you pass an HTML string as a component to the editor, that string is parsed and compiled to the [Component Definition](#component-definition) with a new `type` property. To understand what `type` should be assigned, for each parsed HTML Element, the editor iterates over all the defined components, called **Component Type Stack**, and checks via `isComponent` method (we will see it later) if that component type is appropriate for that element. The Component Type Stack is just a simple array of components but the important part is the order of those components. Any new added Custom Component (we'll see later how to create them) goes on top of the Component Type Stack and each element returned from the parser iterates the stack from top to bottom (the last element of the stack is the `default` one), the iteration stops once one of the component returns a truthy value from the `isComponent` method.

SVG - ComponentTypeStack

::: tip
If you're importing big chunks of HTML code you might want to improve the performances by skipping the parsing and the component recognition steps by passing directly Component Definiton objects or using the JSX syntax. Read more about it here...TODO
:::


### Component Creation

Once the **Component Definition** is ready and the type is assigned, the [Component](api/component) instance can be created (known also as the **Model**). Let's step back to our previous example with the HTML string, the result of the `append` method is an array of added components.

```js
const component = editor.addComponents(`<div>
  <img src="https://path/image" />
  <span title="foo">Hello world!!!</span>
</div>`)[0];
```

The Component instance contains properties and methods which allows you to obtain its data and change them.
You can read properties with the `get` method, like, for example, the `type`
```js
const componentType = component.get('type'); // eg. 'image'
```
and to update properties you'd use `set`, which might change the way a component behavies in the canvas.
```js
// Make the component not draggable
component.set('draggable', false);
```
You can also use methods like `getAttributes`, `setAttributes`, `components`, etc.

```js
const innerComponents = component.components();
// Update component content
component.components(`<div>Component 1</div><div>Component 2</div>`);
```

Each component can define its own properties and methods but all of them will always extend, at least, the `default` one (then you will see how to create new custom components and how to extend the already defined) so it's good to check the [Component API](api/component) to see all available properties and methods.

The **main purpose of the Component** is to keep track of its data and to return them when necessary. One common thing you might need to ask from the component is to show its current HTML

```js
const componentHTML = component.toHTML();
```

This will return a string containing the HTML of the component and all of its children.
The component implements also `toJSON` methods so you can get its JSON structure in this way

```js
JSON.stringify(component)
```

::: tip
For storing/loading all the components you should rely on the [Storage Manager](modules/storage)
:::

The Component instance is responable for the **final data** (eg. HTML, JSON) of your templates, so if you need, for example, to update/add some attribute in the HTML you need to update its component (eg. `component.addAttributes({ title: 'Title added' })`), so the Component/Model is your **Source of Truth**.



### Component Rendering

Another important thing of components is how they are rendered in the **canvas**, this aspect is handled by the **View** of the component. It has nothing to do with the **final data**, you can return a big `<div>...</div>` string as HTML of your component but render it as a simple image in the canvas (think about placeholders for complex/dynamic data).

So, by default, the view of components is automatically synced with the data of its models (you can't have a View without a Model). If you update the attribute of the component or append a new one as a child, the view will render it in the canvas.
Unfotunatelly, sometimes, you might need some additional logic to handle better the component result. Think about allowing a user build its `<table>` element, for this specific case you might want to add custom buttons in the canvas, so it'd be easier adding/removing columns/rows. To handle those cases you can rely on the View, where you can add additional DOM component, attach events, etc. All of this will be completely unrelated with the final HTML of the `<table>` (the result the user would expect) as it handled by the Model.
Once the component is rendered (when you actually see it in the canvas) you can always access its View and the DOM element.

```js
const component = editor.getSelected();
// Get the View
const view = component.getView();
// Get the DOM element
const el =  component.getEl();
```

So generally, the View is something you wouldn't need to change as the default one handles already the sync with the Model but in case you'd need more control over elements (eg. custom UI in canvas) you'll probably need to create a custom component and extend the default View with your logic. We'll see later how to create custom components.


So far we have seen the core concept behind Components and how they work. The **Model/Component** is the **source of truth** for the final code of templates (eg. the HTML export relies on it) and the *View/ComponentView* is what is used by the editor to **preview our components** to users in the canvas.


TODO
A more advanced use case of custom components is an implementation of a custom renderer inside of them





## Built-in Components

Here below you can see the list of built-in components, ordered by their position in the Component Type Stack

* [`cell`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTableCell.js) - Component for handle `<td>` and `<th>` elements
* [`row`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTableRow.js) - Component for handle `<tr>` elements
* [`table`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTable.js) - Component for handle `<table>` elements
* [`thead`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTableHead.js) - Component for handle `<thead>` elements
* [`tbody`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTableBody.js) - Component for handle `<tbody>` elements
* [`tfoot`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTableFoot.js) - Component for handle `<tfoot>` elements
* [`map`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentMap.js) - Component for handle `<a>` elements
* [`link`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentLink.js) - Component for handle `<a>` elements
* [`label`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentLabel.js) - Component for handle properly `<label>` elements
* [`video`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentVideo.js) - Component for videos
* [`image`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentImage.js) - Component for images
* [`script`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentScript.js) - Component for handle `<script>` elements
* [`svg`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentSvg.js) - Component for handle SVG elements
* [`comment`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentComment.js) - Component for comments (might be useful for email editors)
* [`textnode`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentTextNode.js) - Similar to the textnode in DOM definition, so a text element without a tag element.
* [`text`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentText.js) - A simple text component that can be edited inline
* [`wrapper`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/ComponentWrapper.js) - The canvas need to contain a root component, a wrapper, this component was made to identify it
* [`default`](https://github.com/artf/grapesjs/blob/dev/src/dom_components/model/Component.js) - Default base component





## Define new Component

Now that we know how components work, we can start exploring the process of creating new **Custom Components**.

Let's say we want to make the editor understand and handle better `<input>` elements

First of all, place your components inside a plugin




--- OLD

## Component recognition

But now, how does the editor recognize which Component to bind to the `img` element and what to do with the `span` one?
Each Component inherits, from the base one, a particular static method

```js
/**
 * @param {HTMLElement} el
 * @return {Object}
 */
isComponent: function(el) {
  ...
}
```

This method gives us the possibility to recognize and bind component types to each HTMLElement (div, img, iframe, etc.). Each **HTML string/element** introduced inside the canvas will be processed by `isComponent` of all available types and if it matches, the object represented the type should be returned. The method `isComponent` **is skipped** if you add the component object (`{ type: 'my-custom-type', tagName: 'div', attribute: {...}, ...}`) or declare the type explicitly on the element (`<div data-gjs-type="my-custom-type">...</div>`)

For example, with the image component this method looks like:

```js
// Image component
isComponent: function(el) {
  if(el.tagName == 'IMG')
    return {type: 'image'};
}
```

Let's try with something that might look a little bit tricky. What about a Google Map?!? Google Maps are generally embedded as `iframe`s, but the template can be composed by a lot of different `iframe`s. How can I tell the editor that a particular iframe is actually a Google's Map? Well, you'll have to figure out the right pattern, you have the `HTMLElement` so you can make all the checks you want. In this particular case this pattern is used:

```js
// Map component
isComponent: function(el) {
	if(el.tagName == 'IFRAME' && /maps\.google\.com/.test(el.src)) {
		return {type: 'map', src: el.src};
	}
},
```

In addition to `tagName` check, we also used the `src` property, but you can actually override it with your own logic by extending the built-in component.



## Define new Component

Let's see an example with another HTML element that is not handled by default Component types. What about `input` elements?

With the default GrapesJS configuration `input`s are treated like any other element; you can move it around, style it, etc. However, we'd like to handle this type of element more specifically. In this case, we have to create a new Component type.

Let's define few specs for our new *Input* type:

* Can be dropped only inside `form` elements
* Can't drop other elements inside it
* Can change the type of the input (text, password, email, etc.)
* Can make it required for the form

To define a new Component type you need to choose from which built-in Component inherit its properties, in our case we just gonna choose the default one. Let's see a complete example of the new type definition

```js
// Get DomComponents module
var comps = editor.DomComponents;

// Get the model and the view from the default Component type
var defaultType = comps.getType('default');
var defaultModel = defaultType.model;
var defaultView = defaultType.view;

var inputTypes = [
  {value: 'text', name: 'Text'},
  {value: 'email', name: 'Email'},
  {value: 'password', name: 'Password'},
  {value: 'number', name: 'Number'},
];

// The `input` will be the Component type ID
comps.addType('input', {
  // Define the Model
  model: defaultModel.extend({
    // Extend default properties
    defaults: Object.assign({}, defaultModel.prototype.defaults, {
      // Can be dropped only inside `form` elements
      draggable: 'form, form *',
      // Can't drop other elements inside it
      droppable: false,
      // Traits (Settings)
      traits: ['name', 'placeholder', {
          // Change the type of the input (text, password, email, etc.)
          type: 'select',
          label: 'Type',
          name: 'type',
          options: inputTypes,
        },{
          // Can make it required for the form
          type: 'checkbox',
          label: 'Required',
          name: 'required',
      }],
    }),
  },
  // The second argument of .extend are static methods and we'll put inside our
  // isComponent() method. As you're putting a new Component type on top of the stack,
  // not declaring isComponent() might probably break stuff, especially if you extend
  // the default one.
  {
    isComponent: function(el) {
      if(el.tagName == 'INPUT'){
        return {type: 'input'};
      }
    },
  }),

  // Define the View
  view: defaultType.view,
});
```

The code above is pretty much self-explanatory and as you see a lot of work is basically done on top of the Model properties.
The *View* is just extending the default one, so to cover also this part let's add some random behavior.

```js
comps.addType('input', {
  model: {...},
  view: defaultType.view.extend({
    // Bind events
    events: {
      // If you want to bind the event to children elements
      // 'click .someChildrenClass': 'methodName',
      click: 'handleClick',
      dblclick: function(){
        alert('Hi!');
      }
    },

    // It doesn't make too much sense this method inside the component
    // but it's ok as an example
    randomHex: function() {
      return '#' + Math.floor(Math.random()*16777216).toString(16);
    },

    handleClick: function(e) {
      this.model.set('style', {color: this.randomHex()}); // <- Affects the final HTML code
      this.el.style.backgroundColor = this.randomHex(); // <- Doesn't affect the final HTML code
      // Tip: updating the model will reflect the changes to the view, so, in this case,
      // if you put the model change after the DOM one this will override the backgroundColor
      // change made before
    },

    // The render() should return 'this'
    render: function () {
      // Extend the original render method
      defaultType.view.prototype.render.apply(this, arguments);
      this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
      return this;
    },
  }),
});
```

From the example above you can notice few interesting things: how to bind events, how to update directly the DOM and how to update the model. The difference between updating the DOM and the model is that the HTML code (the one you get with `editor.getHtml()`) is generated from the *Model* so updating directly the DOM will not affect it, it's just the change for the canvas.



## Update Component type

Here an example of how easily you can update/override the component

```js
var originalMap = comps.getType('map');

comps.addType('map', {
  model: originalMap.model.extend({
    // Override how the component is rendered to HTML
    toHTML: function() {
      return '<div>My Custom Map</div>';
    },
  }, {
    isComponent: function(el) {
      // ... new logic for isComponent
		},
  }),
  view: originalMap.view
});
```

## Improvement over addType <Badge text="0.14.50+"/>

Now, with the [0.14.50](https://github.com/artf/grapesjs/releases/tag/v0.14.50) release, defining new components or extending them is a bit easier (without breaking the old process)

* If you don't specify the type to extend, the `default` one will be used. In that case, you just
use objects for `model` and `view`
* The `defaults` property, in the `model`, will be merged automatically with defaults of the parent component
* If you use an object in `model` you can specify `isComponent` outside or omit it. In this case,
the `isComponent` is not mandatory but without it means the parser won't be able to identify the component
if not explicitly declared (eg. `<div data-gjs-type="new-component">...</div>`)

**Before**
```js
const defaultType = comps.getType('default');

comps.addType('new-component', {
  model: defaultType.model.extend({
    defaults: {
      ...defaultType.model.prototype.defaults,
      someprop: 'somevalue',
    },
    ...
  }, {
    // Even if it returns false, declaring isComponent is mandatory
    isComponent(el) {
      return false;
    },
  }),
  view: defaultType.view.extend({ ... });
});
```

**After**
```js
comps.addType('new-component', {
  // We can even omit isComponent here, as `false` return will be the default behavior
  isComponent: el => false,
  model: {
    defaults: {
      someprop: 'somevalue',
    },
    ...
  },
  view: { ... };
});
```
* If you need to extend some component, you can use `extend` and `extendView` property.
* You can now omit `view` property if you don't need to change it

**Before**
```js
const originalMap = comps.getType('map');

comps.addType('map', {
  model: originalMap.model.extend({
    ...
  }, {
    isComponent(el) {
      // ... usually, you'd reuse the same logic
    },
  }),
  // Even if I do nothing in view, I have to specify it
  view: originalMap.view
});
```
**After**

The `map` type is already defined, so it will be used as a base for the model and view.
We can skip `isComponent` if the recognition logic is the same of the extended component.
```js
comps.addType('map', {
  model: { ... },
});
```
Extend the `model` and `view` with some other, already defined, components.
```js
comps.addType('map', {
  extend: 'other-defined-component',
  model: { ... }, // Will extend 'other-defined-component'
  view: { ... }, // Will extend 'other-defined-component'
  // `isComponent` will be taken from `map`
});
```
```js
comps.addType('map', {
  extend: 'other-defined-component',
  model: { ... }, // Will extend 'other-defined-component'
  extendView: 'other-defined-component-2',
  view: { ... }, // Will extend 'other-defined-component-2'
  // `isComponent` will be taken from `map`
});
```

### Extend parent functions <Badge text="0.14.60+"/>

When you need to reuse functions, of the parent you're extending, you can avoid writing something like this in any function:
```js
domc.getType('parent-type').model.prototype.init.apply(this, arguments);
```
by using `extendFn` and `extendFnView` arrays:
```js
domc.addType('new-type', {
  extend: 'parent-type',
  extendFn: ['init'], // array of model functions to extend
  model: {
    init() {
      // do something;
    },
  }
});
```
The same would be for the view by using `extendFnView`



## Lifecycle Hooks

Each component triggers different lifecycle hooks, which allows you to add custom actions at their specific stages.
We can distinguish 2 different types of hooks: **global** and **local**.
You define **local** hooks when you create/extend a component type (usually via some `model`/`view` method) and the reason is to react to an event of that
particular component type. Instead, the **global** one, will be called indistinctly on any component (you listen to them via `editor.on`) and you can make
use of them for a more generic use case or also listen to them inside other components.

Let's see below the flow of all hooks:

* **Local hook**: `model.init()` method, executed once the model of the component is initiliazed
* **Global hook**: `component:create` event, called right after `model.init()`. The model is passed as an argument to the callback function.
  Es. `editor.on('component:create', model => console.log('created', model))`
* **Local hook**: `view.init()` method, executed once the view of the component is initiliazed
* **Local hook**: `view.onRender()` method, executed once the component is rendered on the canvas
* **Global hook**: `component:mount` event, called right after `view.onRender()`. The model is passed as an argument to the callback function.
* **Local hook**: `model.updated()` method, executes when some property of the model is updated.
* **Global hook**: `component:update` event, called after `model.updated()`. The model is passed as an argument to the callback function.
  You can also listen to specific property change via `component:update:{propertyName}`
* **Local hook**: `model.removed()` method, executed when the component is removed.
* **Global hook**: `component:remove` event, called after `model.removed()`. The model is passed as an argument to the callback function.

Below you can find an example usage of all the hooks

```js
editor.DomComponents.addType('test-component', {
  model: {
    defaults: {
      testprop: 1,
    },
    init() {
      console.log('Local hook: model.init');
      this.listenTo(this, 'change:testprop', this.handlePropChange);
      // Here we can listen global hooks with editor.on('...')
    },
    updated(property, value, prevValue) {
      console.log('Local hook: model.updated',
        'property', property, 'value', value, 'prevValue', prevValue);
    },
    removed() {
      console.log('Local hook: model.removed');
    },
    handlePropChange() {
      console.log('The value of testprop', this.get('testprop'));
    }
  },
  view: {
    init() {
      console.log('Local hook: view.init');
    },
    onRender() {
      console.log('Local hook: view.onRender');
    },
  },
});

// A block for the custom component
editor.BlockManager.add('test-component', {
  label: 'Test Component',
  content: '<div data-gjs-type="test-component">Test Component</div>',
});

// Global hooks
editor.on(`component:create`, model => console.log('Global hook: component:create', model.get('type')));
editor.on(`component:mount`, model => console.log('Global hook: component:mount', model.get('type')));
editor.on(`component:update:testprop`, model => console.log('Global hook: component:update:testprop', model.get('type')));
editor.on(`component:remove`, model => console.log('Global hook: component:remove', model.get('type')));
```





## Components & JS

If you want to know how to create Components with javascript attached (eg. counters, galleries, slideshows, etc.) check the dedicated page
[Components & JS](Components-js.html)




## Hints

```html
<div id="gjs">
 ...
 <cutom-element></cutom-element>
 ...
</div>

<script>
 var editor = grapesjs.init({
      container : '#gjs',
      fromElement: true,
  });

  editor.DomComponents.addType('cutom-element-type', {...});
</script>
```

In the example above the editor will not get the new type from the HTML because the content is already parsed and appended, so it'll get it only with new components (eg. from Blocks)

Solution 1: turn off `autorender`

```html
<script>
 var editor = grapesjs.init({
      autorender: 0,
      container : '#gjs',
      fromElement: true,
  });

  editor.DomComponents.addType('cutom-element-type', {...});

  // after all new types
  editor.render();
</script>
```
Solution 2: put all the stuff inside a plugin ([Creating plugins](Plugins.html))

