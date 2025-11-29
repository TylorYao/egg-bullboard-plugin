import assert from 'node:assert';
import { mm, MockApplication } from '@eggjs/mock';

describe('test/index.test.ts', () => {
  let app: MockApplication;
  before(() => {
    app = mm.app({
      baseDir: 'apps/example',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /plugin', async () => {
    const pluginRes = await app.httpRequest().get('/plugin').expect(200);
    assert.strictEqual(pluginRes.body.enable, true);
    assert(pluginRes.body.dependencies.includes('static'));
    assert(pluginRes.body.dependencies.includes('ejs'));
  });
  it('should GET /client', async () => {
    const clientRest = await app.httpRequest().get('/client').expect(200);
    assert(clientRest.body.instance);
  });
});
