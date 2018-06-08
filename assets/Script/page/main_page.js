/**
 * Created by zhangwei on 2018/4/20.
 */

import {Page} from "./page";
import {MainScene} from "../scene/main_scene";
import {Manager} from "../manager/manager";
import {UIBase} from "../ui_base";

cc.Class({
    extends   : Page,
    properties: {
        list_content: cc.Node
    },

    // use this for initialization
    onLoad: function() {
        this._super();
        this.refreshList();
    },

    // called every frame
    update: function(dt) {

    },

    refreshList() {
        let lessons = Manager.instance.info.lessons;
        cc.loader.loadRes("items/mission_item", function(err, prefab) {
            lessons.forEach(lesson => {
                let newNode = cc.instantiate(prefab);
                this.list_content.addChild(newNode);
                let ui_base = newNode.getComponent(UIBase);
                ui_base.init(lesson);
            });
        });
    },

    on_mission_item: function(btn, event) {

    },

    on_btn_new: function(btn, event) {
        MainScene.show_page("create_mission_page");
    }

});
