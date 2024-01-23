import urlJoin from 'proper-url-join';

import {
  URL_HOSTS,
  URL_LOGIN,
  URL_SUBSCRIPTION,
  STATUS_NETWORK_ERROR,
  STATUS_NOT_AUTHORIZED
} from "./constants.js";

const RESPONSE_ERROR = {
  message: STATUS_NETWORK_ERROR
};

class Cacti {
  constructor() { }

  setUrl(url) {
    this.url = url;
  }

  setToken(token) {
    this.token = token;
  }

  async getHosts() {
    if (!this.url) {
      return RESPONSE_ERROR;
    }

    if (!this.token) {
      return {
        message: STATUS_NOT_AUTHORIZED
      };
    }

    const url = urlJoin(this.url, URL_HOSTS);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Token': this.token
      }
    }).catch(() => {
      return RESPONSE_ERROR;
    });

    if (!response) {
      return RESPONSE_ERROR;
    }

    const json = await response.json().catch(() => {
      return RESPONSE_ERROR;
    });

    return json;
  }

  async login(username, password) {
    if (!this.url) {
      return RESPONSE_ERROR;
    }

    const url = urlJoin(this.url, URL_LOGIN);
    const body = "username=" + username + "&password=" + password;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    }).catch(() => {
      return RESPONSE_ERROR;
    });

    if (!response) {
      return RESPONSE_ERROR;
    }

    const json = await response.json().catch(() => {
      return RESPONSE_ERROR;
    });

    return json;
  }

  async sendSubscription(subscription, method) {
    if (!this.url) {
      return RESPONSE_ERROR;
    }

    if (!this.token) {
      return {
        message: STATUS_NOT_AUTHORIZED
      };
    }

    const url = urlJoin(this.url, URL_SUBSCRIPTION);

    const response = await fetch(url, {
      method,
      headers: {
        'Token': this.token
      },
      body: JSON.stringify(subscription),
    });

    if (!response) {
      return RESPONSE_ERROR;
    }

    const json = await response.json().catch(() => {
      return RESPONSE_ERROR;
    });

    return json;
  }
}

export default Cacti;
