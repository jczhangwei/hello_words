import {Page} from "./page";
import {MainScene} from "./main_scene";

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

    on_btn_add_library: function(btn, event) {
        MainScene.show_page("library_selection_page")
    }

});
