import Vue from "vue";
import 'video.js/dist/video-js.css';
import "swiper";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "./rem";
import App from "./App";
import { router } from "./router";
import "lib-flexible/flexible";
require("swiper/swiper-bundle.css");


import {
    Field,
    CellGroup,
    Button,
    Form,
    RadioGroup,
    Radio,
    Icon,
    Card,
    Toast,
    Tab,
    Tabs,
    Divider,
    Uploader,
    Grid,
    GridItem,
    Image as VanImage,
    Col,
    Row,
    Popup,
    List,
    PullRefresh,
    Dialog,
} from "vant";
Vue.use(Field);
Vue.use(CellGroup);
Vue.use(Button);
Vue.use(Form);
Vue.use(Radio);
Vue.use(RadioGroup);

Vue.use(Icon);
Vue.use(Card);
Vue.use(Toast);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Divider);
Vue.use(Uploader);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(VanImage);
Vue.use(Col);
Vue.use(Row);
Vue.use(VueAwesomeSwiper /* { default options with global component } */ );
Vue.use(Popup);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Dialog);

new Vue({
    router,
    el: "#app",
    render: (h) => h(App),
});