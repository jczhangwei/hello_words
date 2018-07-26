import {WordCardItem} from "../item/word_card_item";
import {Manager} from "../manager/manager";
import {Page} from "./page";
import {UIManager} from "../manager/ui_manager";

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

        this.btn_review = cc.find("btn_review", this.node).getComponent(cc.Button);
        this.btn_review.interactable = false;
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

    on_btn_review() {

    },

    to_next_word() {
        if(Manager.instance.isGroupFinish()){
            this.btn_review.interactable = true;
            UIManager.instance.showAlternativeDialog("学完一组，是否进入复习？", (dialog)=>{
                dialog.close();
                Manager.instance.reviewGroup();
            },(dialog)=>{
                dialog.close();
            });
            return;
        }
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
