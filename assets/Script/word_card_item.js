import * as Manager from "./manager";

var WordCardItem = cc.Class({
    extends: cc.Component,

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