export default app => {
  const { router, controller } = app;

  // router.get('/', controller.home.index);
  router.get('/plugin', controller.home.plugin);
  router.get('/config', controller.home.config);
  router.get('/client', controller.home.client);
};
