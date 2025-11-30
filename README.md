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

> **Note:** The latest version 3.x is primarily intended for Egg.js v3. Support for Egg.js v4 has been introduced in the 1.x release, but it is not yet fully tested.

## Prerequisites

This plugin depends on the following EggJS plugins:

- **static plugin** (built-in): Required to serve BullBoard static assets
- **view plugin** (built-in): Required to resolve BullBoard UI file render engine
- **ejs plugin**: Required to render the BullBoard UI, as it is written in EJS

Make sure these plugins are enabled in your application's plugin configuration.

## Usage

### Enable bullboard plugin

```js
// {app_root}/config/plugin.js
export default {
  bullboard: {
    enable: true,
    package: 'egg-bullboard-plugin',
  },
};
```

```js
// {app_root}/config/config.default.js
export default {
  bullboard: {
    client: {
      basePath: '',
      boardOptions: {},
    },
  },
};
```

- `basePath`: the base path to view bullboard, eg: `https://localhost:7001/{basePath}`
- `boardOptions`: the `createBullBoard` options from [@bull-board/api](https://github.com/felixmosh/bull-board)

see [src/config/config.default.ts](src/config/config.default.ts) for more detail.

### Configure view plugin

This maps `.ejs` file to the render engine of ejs, which by this case registered by egg-view-ejs.

```js
// {app_root}/config/plugin.js
export default {
  view: {
    mapping: {
      '.ejs': 'ejs',
    },
  },
};
```

### Configure ejs plugin

Recommend ejs rendering plugin but could be replaced, any capable one could do, as long as the ext mapping is correct. So regarding this the required egg-view-ejs dependency is removed for flexibility, BUT DON'T FORGET TO ENABLE ONE!!!

```js
// {app_root}/config/plugin.js
export default {
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
};
```

### Static plugin

Static plugin is enabled by default; this bullboard plugin will tweak its configuration to serve bullboard UI assets.

## Example

After the plugin is loaded, the `BullBoard` client instance is mounted to the app. You can access it via `app.bullboard` to get the `BullBoardClient`, and use its API to manage `BullMQ` queues.

### Adding Queues To Display Board

You could use `app.bullboard` api to add queue to display. Here's an example:

```js
// {app_root}/app.js
import { Queue } from 'bullmq';

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
    bullboard.addQueue(emailQueue);
    bullboard.instance.addQueue(notificationQueue);
  }
}
```

The `app.board` is an instance of `BullBoardClient`, on which the `instance` attr is an instance of `createBullBoard`;
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

### BullBoardClient

Provides a convenience wrapper for `BullMQAdapter` instantiation over the `BullBoard` Client API.

Note: Do not mix this encapsulated API with the original BullBoard Client API. For example, adding a BullMQ queue via `this.instance.addQueue` and removing it with `this.removeQueue` will fail silently, as the class instance has no track of those directly added queue instances.

```typescript
interface BullBoardClient {
  instance: ReturnType<typeof createBullBoard>;
  setQueues(queues: Queue[]): void;
  replaceQueues(queues: Queue[]): void;
  addQueue: (queue: Queue) => void;
  removeQueue: (queueOrName: string | Queue) => void;
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
