
let instance;

let MainScene = cc.Class({
    extends: cc.Component,

    properties: {
        pages: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        instance = this;
        this.pages = this.node.getChildByName("pages");
    },

    start: function () {
        MainScene.show_page("main_page");
    },

    // called every frame
    update: function (dt) {

    },
});

MainScene.show_page = function(page_name) {
    console.log("show page " + page_name);
    if(instance){
        let page_node = instance.pages.getChildByName(page_name);
        if(page_node){
            if(page_node.active){
                return;
            }

            for(let key in instance.pages.children){
                let child = instance.pages.children[key];
                child.active = false;
            }

            page_node.active = true;
        }
    }
};

export {MainScene}