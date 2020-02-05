export default {
  /**
   * Function that gets called when the service worker detects a new version.
   * Unregisters the old service worker, then reloads the page in order to
   * register the new service worker.
   * @param {ServiceWorkerRegistration} reg
   */
  onUpdate(reg) {
    reg.unregister().then(() => {
      window.location.reload();
    });
  },
  /**
   * Function that gets called when a new service worker has been registered.
   * @param {ServiceWorkerRegistration} reg
   */
  onSuccess(reg) {
    console.info("Service worker registered successfully.");
  },
};
