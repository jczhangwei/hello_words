/**
 * Created by zhangwei on 2018/4/20.
 */

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

    on_mission_item: function(btn, event) {

    },

    on_btn_new: function(btn, event) {
        MainScene.show_page("create_mission_page");
    }

});
