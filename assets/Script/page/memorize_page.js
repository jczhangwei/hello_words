import {WordCardItem} from "../item/word_card_item";
import {Manager} from "../manager/manager";
import {Page} from "./page";

let MemorizePage = cc.Class({
    extends: Page,

    properties: {},

    ctor() {
        this.cur_word_list      = [];
        this.cur_word_index     = -1;
    },

    onLoad() {
        this._super();

        this.layout_card = this.node.getChildByName("layout_card");
        cc.loader.loadRes("items/word_card_item", (err, prefab) => {
            if(prefab && typeof prefab === "object") {
                let node = cc.instantiate(prefab);
                if(node) {
                    this.card_item = node.getComponent(WordCardItem);
                    this.layout_card.addChild(node);
                    this.card_item.show_word(Manager.instance.getNextWord());

                }
            }

        });

    },

    start() {

    },

    update(dt) {},

    start_play() {
        if(!this.card_item) {
            return;
        }
        this.card_item.show_word(Manager.instance.getNextWord());
    },

    on_btn_previous() {
        if(!this.card_item) {
            return;
        }
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
            this.cur_word_index++;
        } else {
            word = this.cur_word_list[Math.min(++this.cur_word_index, this.cur_word_list.length - 1)];
        }

        this.card_item.show_word(word);
    },

    to_previous_word() {
        this.cur_word_index = Math.max(--this.cur_word_index, 0);
        let word            = this.cur_word_list[this.cur_word_index];
        this.card_item.show_word(word);
    },

    finsh_group() {

    }

});
