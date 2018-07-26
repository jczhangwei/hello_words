import {UIBase} from "../ui_base";

let Dialog = cc.Class({
    extends: UIBase,
    properties: {

    },

    open: function() {
        let dialogs = cc.find("Canvas/dialogs");
        if(dialogs) {
            dialogs.addChild(this.node);
        }
    },

    close: function() {
        this.node.destroy();
    },
});

export {Dialog}