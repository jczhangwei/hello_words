import {Manager} from "../manager/manager";
import {UIBase} from "../ui_base";

let MissionItem = cc.Class({
    extends: UIBase,

    ctor() {

    },

    properties: {
        txt_name: {
            default: null,
            type   : cc.Label
        },

        txt_desc: {
            default: null,
            type   : cc.Label
        }
    },

    onLoad() {},

    start() {

    },

    update(dt) {},

    init(lession) {
        this.txt_name.string = lession.name;
        this.txt_desc.string = lession.desc;
    },



});

export {MissionItem}