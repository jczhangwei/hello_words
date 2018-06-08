import {Page} from "./page";
import {MainScene} from "../scene/main_scene";

cc.Class({
    extends: Page,
    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this._super();
    },

    // called every frame
    update: function (dt) {

    },

    on_btn_cancel: function(btn, event) {
        MainScene.show_page("main_page");
    },

});
