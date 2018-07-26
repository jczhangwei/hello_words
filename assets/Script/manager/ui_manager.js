import {AlternativeDialog} from "../dialog/alternative_dialog";
import {Manager} from "./manager";
import {WordCardItem} from "../item/word_card_item";

let UITypes = {
    Item: "item",
    page: "page",
    Dialog: "dialog",
};

let UIManager = cc.Class({
    name   : "UIManager",
    extends: cc.Class,

    ctor() {

    },

    showAlternativeDialog: function(content, ok_callback, cancel_callback) {
        this.loadUI(UITypes.Dialog, "alternative_dialog", (node, dialog)=>{
            dialog.set_desc(content);
            dialog.set_callback(()=>{
                cancel_callback && cancel_callback(dialog);
                dialog.close();
            }, ()=>{
                ok_callback && ok_callback(dialog);
                dialog.close();
            });
            dialog.open();
        }, AlternativeDialog);


    },

    loadUI: function(type, name, callback, type_class, parent) {
        cc.loader.loadRes(type + "s/" + name, (err, prefab) => {
            if(prefab && typeof prefab === "object") {
                let node = cc.instantiate(prefab);
                if(node) {
                    let controller;
                    if(type_class) {
                        controller = node.getComponent(type_class);
                    }

                    if(parent) {
                        parent.addChild(node);
                    }

                    if(callback){
                        callback(node, controller);
                    }

                }
            }

        });
    }

});

UIManager.instance = new UIManager();

export {UIManager}