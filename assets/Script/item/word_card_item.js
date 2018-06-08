import * as Manager from "../manager/manager";
import {UIBase} from "../ui_base";

let WordCardItem = cc.Class({
    extends: UIBase,

    properties: {

    },

    onLoad () {},

    start () {

    },

    update (dt) {},

    show_word(word){
        Manager.instance.getWordDesc(word);
    }

});

export {WordCardItem}