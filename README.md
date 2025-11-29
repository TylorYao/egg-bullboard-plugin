# egg-bullboard-plugin

[![NPM version][npm-image]][npm-url]
[![Test coverage][codecov-image]][codecov-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-bullboard-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-bullboard-plugin
[codecov-image]: https://img.shields.io/codecov/c/github/TylorYao/egg-bullboard-plugin.svg?style=flat-square
[codecov-url]: https://codecov.io/github/TylorYao/egg-bullboard-plugin?branch=master
[snyk-image]: https://snyk.io/test/npm/egg-bullboard-plugin/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-bullboard-plugin
[download-image]: https://img.shields.io/npm/dm/egg-bullboard-plugin.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-bullboard-plugin

<!--
Description here.
-->

## Install

```bash
npm i egg-bullboard-plugin
```

> **Note:** If you're using EggJS v3, install the compatible version: `npm i egg-bullboard-plugin@3`

## Prerequisites

This plugin depends on the following EggJS plugins:

- **static plugin** (built-in): Required to serve BullBoard static assets
- **ejs plugin**: Required to render the BullBoard user interface, as it is written in EJS

Make sure these plugins are enabled in your application's plugin configuration.

## Usage

```js
// {app_root}/config/plugin.js
export default {
  bullboard: {
    enable: true,
    package: 'egg-bullboard-plugin',
  },
};
```

## Configuration

```js
// {app_root}/config/config.default.js
export default {
  bullboard: {
    client: {
      basePath: '', // the base path to view bullboard, eg: https://localhost:7001/{basePath}
      boardOptions: {}, // the createBullBoard options from @bull-board/api
    },
  },
};
```

see [src/config/config.default.ts](src/config/config.default.ts) for more detail.

## Example

After the plugin is loaded, the BullBoard client instance is mounted to the app. You can access it via `app.bullboard` to get the `BullBoardClient`, and use its API to manage BullMQ queues.

### Initializing Queues at App Startup

Queues should be instantiated and added to BullBoard during app initialization. Here's an example:

```js
// {app_root}/app.js
import { Queue } from 'bullmq';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

export default class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    // Access the BullBoard client instance
    const bullboard = this.app.bullboard;

    // Create your BullMQ queue instances
    const emailQueue = new Queue('email', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

    const notificationQueue = new Queue('notification', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

    // Add queues to BullBoard
    bullboard.instance.addQueue(new BullMQAdapter(emailQueue));
    bullboard.instance.addQueue(new BullMQAdapter(notificationQueue));

    // Store queues in app for later use
    this.app.queue = {
      email: emailQueue,
      notification: notificationQueue,
    };

    this.app.coreLogger.info(
      'BullMQ queues initialized and added to BullBoard'
    );
  }
}
```

### Using Queues in Your Application

Once queues are initialized, you can use them throughout your application:

```js
// {app_root}/app/controller/job.js
import { Controller } from 'egg';

class JobController extends Controller {
  async sendEmail() {
    const { ctx, app } = this;

    // Use the queue that was initialized in app.js
    await app.queue.email.add('send-email', {
      to: ctx.request.body.to,
      subject: ctx.request.body.subject,
      body: ctx.request.body.body,
    });

    ctx.body = { success: true, message: 'Email job added to queue' };
  }
}

export default JobController;
```

For more details about the `createBullBoard` API and available methods, please refer to the [@bull-board/api documentation](https://github.com/felixmosh/bull-board).

## Interface

### BullBoardClientOptions

Configuration options for a BullBoard client instance.

```typescript
interface BullBoardClientOptions {
  /**
   * The base path where BullBoard UI will be accessible.
   * For example, if basePath is '/admin/queues', the BullBoard will be available at https://localhost:7001/admin/queues
   */
  basePath: string;

  /**
   * Options passed to createBullBoard from @bull-board/api.
   * See @bull-board/api documentation for available options.
   * @see https://github.com/felixmosh/bull-board
   */
  boardOptions: BoardOptions;
}
```

### BullBoardConfig

Main configuration interface for the bullboard plugin.

```typescript
interface BullBoardConfig {
  /**
   * Default bullboard instance option.
   * Used when no specific client name is provided.
   */
  default?: BullBoardClientOptions;

  /**
   * Singleton case option declaration.
   * Use this when you only need one BullBoard instance.
   */
  client?: BullBoardClientOptions;

  /**
   * Multiple instances case option declaration.
   * Use this when you need multiple named BullBoard instances.
   * Keys are client names, values are BullBoardClientOptions.
   */
  clients?: {
    [clientName: string]: BullBoardClientOptions;
  };
}
```

## Questions & Suggestions

Please open an issue [here](https://github.com/TylorYao/egg-bullboard-plugin/issues).

## License

[MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=TylorYao/egg-bullboard-plugin)](https://github.com/TylorYao/egg-bullboard-plugin/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
