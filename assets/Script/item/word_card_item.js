import {Manager} from "../manager/manager";
import {UIBase} from "../ui_base";

let WordCardItem = cc.Class({
    extends: UIBase,

    properties: {},

    onLoad() {
        this._super();

        this.txt_word = this.node.getChildByName("word").getComponent(cc.Label);
        this.txt_desc = this.node.getChildByName("desc").getComponent(cc.Label);
    },

    start() {

    },

    update(dt) {},

    show_word(word) {
        console.log("word car show word: " + word);
        this.txt_word.string = word;
        this.txt_desc = Manager.instance.getWordDesc(word);
    }

});

export {WordCardItem}