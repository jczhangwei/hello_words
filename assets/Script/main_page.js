/**
 * Created by zhangwei on 2018/4/20.
 */

import {Page} from "./page";

Page.extend({
    // extends: Page,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame
    update: function (dt) {
        console.log(this.getA());
    },

    getA: function() {
        return "aaa";
    }
});
