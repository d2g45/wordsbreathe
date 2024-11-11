import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import "@/styles/main.scss";
import App from "./app";
import Gallery from "./components/Gallery";
import Modal from "./components/Modal";
import Tabs from "./components/Tabs";

// import header from "./modules/header";
import images from "./modules/images";
import animation from "./modules/animation";
import FormModal from "./components/FormModal";

// configure components here
const components = [];

// modals
components.push({
  selector: ".js-modal",
  Component: Modal,
});

components.push({
  selector: ".js-tabs",
  Component: Tabs,
});

components.push({
  selector: ".js-gallery",
  Component: Gallery,
});

components.push({
  selector: ".js-form-modal",
});
Component: FormModal;

window.App = new App({
  // modules: [header, images, animation],
  modules: [images, animation],
  components,
});
