import Backbone from 'backbone';
import Category from './Category';
import CategoryView from '../view/CategoryView';

export default Backbone.Collection.extend({
  model: Category
});
