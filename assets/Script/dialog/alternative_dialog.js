import {Manager} from "../manager/manager";
import {Dialog} from "dialog";

let AlternativeDialog = cc.Class({
    extends: Dialog,

    ctor() {

    },

    properties: {
        txt_desc: {
            default: null,
            type   : cc.Label
        }
    },

    onLoad() {
        this._super();
    },

    start() {

    },

    update(dt) {},

    set_desc: function(content) {
        this.txt_desc.string = content || "";
    },

    set_callback: function(left_callback, right_callback) {
        this._left_callback = left_callback;
        this._right_callback = right_callback;
    },

    on_btn_left: function() {
        if(this._left_callback) {
            this._left_callback();
        }
    },

    on_btn_right: function() {
        if(this._right_callback) {
            this._right_callback();
        }
    }

});

export {AlternativeDialog}