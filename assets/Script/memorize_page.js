import {WordCardItem} from "./word_card_item";
import {Manager} from "./manager";
import {Page} from "./page";

cc.Class({
    name   : "memorize_page",
    extends: Page,

    properties: {
        layout_card: cc.Node
    },

    ctor() {

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
        this.card_item.show_word(Manager.instance.getNextWord())
    },

    on_btn_next() {
        this.card_item.show_word(Manager.instance.getNextWord())
    }
});
