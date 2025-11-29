import assert from 'node:assert';
import { Controller } from 'egg';

class HomeController extends Controller {
  async plugin() {
    this.ctx.body = this.app.plugins.bullboard;
  }
  async config() {
    this.ctx.body = this.app.config.bullboard;
  }
  async client() {
    console.log(`this.app.bullboard`, this.app.bullboard);
    this.ctx.body = this.app.bullboard;
  }
}

export default HomeController;
