import Assets from 'asset_manager/model/Assets';
import AssetView from 'asset_manager/view/AssetView';
import config from 'asset_manager/config/config';

describe('AssetView', () => {
  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    var coll = new Assets();
    var model = coll.add({ src: 'test' });
    testContext.view = new AssetView({
      config: {},
      model
    });
    document.body.innerHTML = '<div id="fixtures"></div>';
    document.body
      .querySelector('#fixtures')
      .appendChild(testContext.view.render().el);
  });

  afterEach(() => {
    testContext.view.remove();
  });

  test('Object exists', () => {
    expect(AssetView).toBeTruthy();
  });

  test('Has correct prefix', () => {
    expect(testContext.view.pfx).toEqual('');
  });

  test('Initial base path is present', () => {
    var coll = new Assets();
    var model = coll.add({ src: 'test' });

    testContext.view = new AssetView({
      config: config,
      model
    });
    expect(testContext.view.config.basePath).toBeTruthy();
  });

  test('Updating the target adds the base path to the src', () => {
    const coll = new Assets();
    const model = coll.add({ src: 'test' });
    const assetView = new AssetView({
      config: config,
      model
    });

    config.basePath = '/img/';
    assetView.updateTarget(model);

    expect(model.attributes.src).toMatch('/img/test');
  });
});
