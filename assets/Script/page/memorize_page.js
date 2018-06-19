import {WordCardItem} from "../item/word_card_item";
import {Manager} from "../manager/manager";
import {Page} from "./page";

let MemorizePage = cc.Class({
    extends: Page,

    properties: {
        layout_card: cc.Node
    },

    ctor() {
        this.cur_word_list  = [];
        this.cur_word_index = -1;
    },

    onLoad() {
        cc.loader.loadRes("items/word_card_item", function(err, prefab) {
            if(prefab && typeof prefab === "object") {
                let node = cc.instantiate(prefab);
                if(node) {
                    this.card_item = node.getComponent(WordCardItem);
                    this.layout_card.addChild(node);

                }
            }

        }.bind(this));
    },

    start() {
        this.card_item.show_word(Manager.instance.getNextWord())
    },

    update(dt) {},

    on_btn_previous() {
        this.to_previous_word();
    },

    on_btn_next() {
        this.to_next_word();
    },

    to_next_word() {
        let word;
        if(this.cur_word_index >= this.cur_word_list.length - 1) {
            word = Manager.instance.getNextWord();
            this.cur_word_list.push(word);
            this.cur_word_index = this.cur_word_index - 1;
        } else {
            word = this.cur_word_list[Math.min(++this.cur_word_index, this.cur_word_list.length - 1)];
        }

        this.card_item.show_word(word)
    },

    to_previous_word() {
        let word = this.cur_word_list[Math.max(--this.cur_word_index, 0)];
        this.card_item.show_word(word)
    },


});
