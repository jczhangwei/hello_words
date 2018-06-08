import {UIBase} from "../ui_base";

let instance;
import {Manager} from "../manager/manager";

let MainScene = cc.Class({
    extends: UIBase,

    properties: {
        pages: cc.Node
    },

    // use this for initialization
    onLoad: function() {
        instance = this;
        this.pages = this.node.getChildByName("pages");

        Manager.instance.loadVocabulary(function() {
            cc.log(Manager.instance.library);
            cc.log(Manager.instance.info);
            MainScene.show_page("main_page");

        }.bind(this))
    },

    start: function() {

    },

    // called every frame
    update: function(dt) {

    },
});

function show_page_node(page_node) {
    for(let key in instance.pages.children) {
        let child = instance.pages.children[key];
        child.active = false;
    }

    page_node.active = true;
}

MainScene.show_page = function(page_name) {
    console.log("show page " + page_name);
    if(instance) {
        let page_node = instance.pages.getChildByName(page_name);
        if(page_node) {
            if(page_node.active) {
                return;
            }

            show_page_node(page_node);
        } else {
            cc.loader.loadRes("pages/" + page_name, function(err, prefab) {
                if(prefab && typeof prefab == "object") {
                    let node = cc.instantiate(prefab);
                    if(node) {
                        instance.pages.addChild(node);
                        show_page_node(node);

                    }
                }

            });
        }
    }
};

export {MainScene}