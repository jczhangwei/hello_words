let LearnSection = {
    PASS      : {code: -1, name: "pass", near_time: 0, far_time: 0},
    LEARN     : {code: 0, name: "learn", near_time: 0, far_time: 0},
    REVIEW_M5 : {code: 1, name: "review_m5", near_time: 0, far_time: 0},
    REVIEW_M30: {code: 2, name: "review_m30", near_time: 0, far_time: 0},
    REVIEW_H12: {code: 3, name: "review_h12", near_time: 12, far_time: 16},
    REVIEW_D2 : {code: 4, name: "review_d2", near_time: 24, far_time: 48},
    REVIEW_D4 : {code: 5, name: "review_d4", near_time: 72, far_time: 120},
    REVIEW_D8 : {code: 6, name: "review_d8", near_time: 168, far_time: 192},
    REVIEW_D15: {code: 7, name: "review_d15", near_time: 336, far_time: 360},
    REVIEW_D30: {code: 8, name: "review_d30", near_time: 696, far_time: 720},

};

let lesson = {
    words: {
        abandon: {section: LearnSection.LEARN.name, learn_time: []},
        /*.....*/
    },

    groups: [
        {
            words: ["abandon"]
        },
        /*.....*/
    ]
};
let info   = {
    lessons: [
        lesson
    ] //Array of lessons

};

/**
 * learn_type 为空就是还没开始学， state的值对应刚刚完成了那一阶段
 * @type {Function|*}
 */

let k = cc.Sprite.extend({
    a:3
});

console.log(k);

cc.Class.extend({

});

let Manager = cc.Class({

    properties: {

    },

    ctor: function() {
        this.init();
        this.info = {
            lessons: [
                {
                    words: {
                        abandon: {section: LearnSection.LEARN.name, learn_time: []},
                        /*.....*/
                    },

                    groups: [
                        {
                            words: ["abandon"]
                        },
                        /*.....*/
                    ]
                }
            ] //Array of lessons

        }
    },

    init: function() {
        this.initLoader();
    },

    initLoader: function() {
        let arrayBufferHandler = function(item, callback) {
            let url = item.url;
            let xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload       = function(oEvent) {
                let data = new Uint8Array(xhr.response);
                if(data) {
                    callback(null, data);
                } else {
                    callback("Loading fail.");
                }
            };

            xhr.send(null);
        };

        cc.loader.addDownloadHandlers({
            'xlsx': arrayBufferHandler
        });
        cc.loader.addLoadHandlers({
            'xlsx': arrayBufferHandler

        });


    },

    // loadVocabulary: function(callback) {
    //     cc.loader.loadRes("db/words.xlsx", function(err, data) {
    //         window.gre = this.vocabulary = XLSX.read(data, {type: "array"});
    //
    //         if(callback) {
    //             callback();
    //         }
    //     }.bind(this));
    // },

    loadVocabulary: function(callback) {
        cc.loader.loadRes("db/words.json", function(err, data) {
            window.words = this.words = data;

            if(callback) {
                callback();
            }
        }.bind(this));
    },

    getVocabularyNames: function() {
        return this.vocabulary.SheetNames;
    },

    getWordCount: function(sheet_name) {

        let sheet = this.vocabulary.Sheets[sheet_name];
        if(sheet) {
            return sheet.length;

        }

        return 0;

    },


});

Manager.instance = new Manager();

export {Manager}
module.exports = Manager;