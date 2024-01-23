import "bootstrap";
import "@fortawesome/fontawesome-free/js/all.js";
import Alpine from "alpinejs";
import service from "./service";
import Cacti from "./cacti.js";
import createApp from "./app";

import "@fortawesome/fontawesome-free/css/all.css";
import "./style.scss";

const cacti = new Cacti();
/*global URL_API*/
/*eslint no-undef: "error"*/
cacti.setUrl(URL_API);

const app = createApp(cacti, localStorage);
service();

document.addEventListener("DOMContentLoaded", function () {
  Alpine.data("cacti", () => app);
  window.Alpine = Alpine;
  Alpine.start();
});
