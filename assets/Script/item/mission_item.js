import {Manager} from "../manager/manager";
import {UIBase} from "../ui_base";
import {MainScene} from "../scene/main_scene";

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

    onLoad() {
        this._super();
    },

    start() {

    },

    update(dt) {},

    init(lession) {
        this._lession_name = lession.name;
        this.txt_name.string = lession.name;
        this.txt_desc.string = lession.desc;
    },

    on_mission_item(){
        if(Manager.instance.isWordsNeedReview()){

        }
        Manager.instance.startLesson(this._lession_name);
        MainScene.show_page("memorize_page")
    }


});

export {MissionItem}