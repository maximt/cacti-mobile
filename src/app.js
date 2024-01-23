import {
  HOST_DOWN,
  HOST_UP,
  HOST_RECOVERY,
} from "./constants";

function createApp(CactiClient, Storage) {
  const app = {
    cactiClient: CactiClient,
    storage: Storage,
    hosts: [],
    message: "",
    token: "",
    username: "",
    password: "",
    lastUpdated: null,
    hostDownOnly: false,
    hostFilterQuery: "",
    countDownHosts: 0,
    countUpHosts: 0,
    countTotalHosts: 0,
    countFilteredHosts: 0,
    sortCol: null,
    sortAsc: false,
    notification: false,

    toggleHosts() {
      this.hostDownOnly = !this.hostDownOnly;
      this.storage.setItem("hostDownOnly", this.hostDownOnly);
    },

    load() {
      this.username = this.storage.getItem("username");
      this.token = this.storage.getItem("token");
      this.password = '';

      this.checkNotification();
    },

    async save() {
      this.isOpen = false;

      if (this.username && this.password) {
        this.login();
        this.unsubscribe();
        this.subscribe();
      }
    },

    async login() {
      this.storage.setItem("token", '');

      const data = await this.cactiClient.login(this.username, this.password);
      this.message = data.message;
      this.hosts = [];
      this.storage.setItem("token", data.token);
      this.password = '';

      if (data.token) {
        this.update();
      }
    },

    async subscribe() {
      const registration = await navigator.serviceWorker.ready;
      /*global PUSH_APP_PUBLIC_KEY*/
      /*eslint no-undef: "error"*/
      const subscription_new = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PUSH_APP_PUBLIC_KEY,
      });

      await this.sendSubscription(subscription_new, 'POST');
      this.notification = true;
    },

    async unsubscribe() {
      const registration = await navigator.serviceWorker.ready;
      const subscription_old = await registration.pushManager.getSubscription();

      if (subscription_old) {
        await subscription_old.unsubscribe();
        await this.sendSubscription(subscription_old, 'DELETE');
        this.notification = false;
      }
    },

    async sendSubscription(subscription, method) {
      const key = subscription.getKey('p256dh');
      const token = subscription.getKey('auth');
      const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

      const subscription_data = {
        endpoint: subscription.endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        contentEncoding
      }

      await this.cactiClient.sendSubscription(subscription_data, method);
    },

    async checkNotification() {
      const registration = await navigator.serviceWorker.ready;
      const subscription_old = await registration.pushManager.getSubscription();

      this.notification = !!subscription_old;

      return this.notification;
    },

    async toggleNotification() {
      const notification = await this.checkNotification();
      if (notification) {
        this.unsubscribe();
      } else {
        this.subscribe();
      }
    },

    async update() {
      this.cactiClient.setToken(
        this.storage.getItem("token")
      );

      const data = await this.cactiClient.getHosts();

      this.message = data.message;
      this.hosts = data.hosts;
      this.updateStats();
    },

    sort(col) {
      this.sortCol = col || this.sortCol || "description";

      // if (!asc && this.sortCol === col)
      //     this.sortAsc = !this.sortAsc

      // HOST_DOWN always first
      this.hosts.sort((a, b) => {
        if (a["status"] == b["status"]) {
          if (a[this.sortCol] < b[this.sortCol]) return this.sortAsc ? 1 : -1;
          if (a[this.sortCol] > b[this.sortCol]) return this.sortAsc ? -1 : 1;
        }

        if (a["status"] == HOST_DOWN) return -1;
        if (a["status"] == HOST_RECOVERY) return -1;

        return 0;
      });
    },

    filterHosts() {
      if (!this.hosts) {
        return [];
      }

      this.sort();
      let hosts = this.hosts;

      // this.hostDownOnly = true
      // this.hostFilterQuery = '31'
      if (this.hostDownOnly) {
        hosts = hosts.filter((h) => h.status == HOST_DOWN);
      }

      if (this.hostFilterQuery) {
        const query = this.hostFilterQuery.toLowerCase();
        hosts = hosts.filter(
          (h) =>
            (h.description && h.description.toLowerCase().includes(query)) ||
            (h.hostname && h.hostname.toLowerCase().includes(query))
        );
      }

      this.countFilteredHosts = hosts.length;

      return hosts;
    },
    updateStats() {
      if (!this.hosts) {
        return;
      }

      this.lastUpdated = new Date().toLocaleTimeString();
      this.countTotalHosts = this.hosts.length;

      this.countUpHosts = this.hosts.filter(
        (host) => host.status == HOST_UP
      ).length;
      this.countDownHosts = this.countTotalHosts - this.countUpHosts;
    },
  };

  app.load();

  return app;
}

export default createApp;
