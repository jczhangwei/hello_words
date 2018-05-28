// let _ = require("underscore");
/**
 * 每个完成30分钟复习的一批单词为一个大组 group, 每个完成5分钟复习的组为一个小组，
 * 小组是临时的，不保存， 完成30分钟复习以后的大组保存为一个 group，
 * 以后按照大组来复习
 *
 */

/**
 * learn_type, 每个单词的学习状态， state的值对应下一步需要做的阶段
 * @type {Function|*}
 */

let LearnSection = {
    PASS      : {code: -10, name: "pass", near_time: 0, far_time: 0},
    NOT_START : {code: -1, name: "not_start", near_time: 0, far_time: 0},
    LEARN     : {code: 0, name: "learn", near_time: 0, far_time: 0},
    REVIEW_M5 : {code: 1, name: "review_m5", near_time: 0, far_time: 0},
    REVIEW_M30: {code: 2, name: "review_m30", near_time: 0, far_time: 0},
    REVIEW_H12: {code: 3, name: "review_h12", near_time: 12, far_time: 16},
    REVIEW_D2 : {code: 4, name: "review_d2", near_time: 24, far_time: 48},
    REVIEW_D4 : {code: 5, name: "review_d4", near_time: 72, far_time: 120},
    REVIEW_D8 : {code: 6, name: "review_d8", near_time: 168, far_time: 192},
    REVIEW_D15: {code: 7, name: "review_d15", near_time: 336, far_time: 360},
    REVIEW_D30: {code: 8, name: "review_d30", near_time: 696, far_time: 720},
    FINISH    : {code: 9, name: "finish", near_time: 0, far_time: 0},

};

let LearnStatus = {
    NOT_START      : "not_start",
    LEARN_NEW_WORDS: "learn_new_words",
    REVIEW         : "review",
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

let Manager = cc.Class({
    name   : "Manager",
    extends: cc.Class,

    ctor: function() {
        this.init();
        this._cur_lesson   = null;
        this._learn_status = null;

        this.library = null;
        this.info  = {
            cur_lesson: "gre",
            lessons   : [
                {
                    name     : "gre",
                    libraries: [
                        "gre"
                    ],
                    groups   : [
                        {
                            words: ["abandon"]
                        },
                        /*.....*/
                    ],
                    words    : {
                        pass      : {},
                        not_start : {abandon: {section: LearnSection.LEARN.name, learn_time: []}},
                        learn     : {},
                        review_m5 : {},
                        review_m30: {},
                        review_h12: {},
                        review_d2 : {},
                        review_d4 : {},
                        review_d8 : {},
                        review_d15: {},
                        review_d30: {},
                        finish    : {},
                    }
                }
            ] //Array of lessons

        }
    },

    properties: {},

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

    loadVocabulary: function(callback) {
        cc.loader.loadRes("db/library.json", function(err, data) {
            window.library = this.library = data;

            if(callback) {
                callback();
            }
        }.bind(this));
    },

    getVocabularyNames: function() {
        return this.vocabulary.SheetNames;
    },

    /**
     * 获得一个词典的单词个数
     * @param sheet_name
     * @returns {*}
     */
    getWordCount: function(vocabulary_name) {

        let item = _.find(this.words.list, function(item) {
            return item.name == vocabulary_name;
        });

        return item.words.length;
    },

    /**
     * 获得一个词典的单词列表
     * @param vocabulary_name
     * @returns {*|undefined}
     */
    getWordsForVocabulary: function(vocabulary_name) {
        let item = _.find(this.words.list, function(item) {
            return item.name === vocabulary_name;
        });

        return _.union(item.words);
    },

    /**
     * 获得单词库列表信息
     */
    getVoculbaryInfos: function() {
        _.map(this.words.list, function(item) {
            return {
                name  : item.name,
                length: item.words.length
            }
        });
    },

    /**
     * 获取已创建的课程列表
     * @returns {*[]|*}
     */
    getLessions: function() {
        return this.info.lessons;
    },

    // 开始学习过程
    start_to_learn: function(lesson_name) {
        this._cur_lesson = lesson_name;

    },

    /**
     * 创建课程，在课程创建页面点击确定后执行
     * @param name
     * @param libraries
     */
    createLesson: function(name, libraries) {
        let lesson = {
            name     : name,
            libraries: libraries,
            groups   : [],
            words    : {
                pass      : [],
                not_start : [],
                learn     : [],
                review_m5 : [],
                review_m30: [],
                review_h12: [],
                review_d2 : [],
                review_d4 : [],
                review_d8 : [],
                review_d15: [],
                review_d30: [],
                finish    : [],
            }
        };

        _.each(function(library_name) {
            lesson.words.learn = _.union(lesson.words.not_start, this.getWordsForVocabulary(library_name));
        });

        this.info.lessons.push(lesson)

    },

    /**
     * 在学习过程中，得到下一个要学的单词
     */
    getNextWord() {
        // todo
        if(this._learn_status === LearnStatus.LEARN_NEW_WORDS) {
            return this._cur_lesson.words.learn.shift();
        } else {

        }
    },

    /**
     * todo
     * 在复习过程中，得到下一个要复习的单词
     */
    getNextReviewWord() {

    },

    /**
     * todo
     * 看完一个单词(无论是在学习还是在复习
     */
    onReadWord(word) {

    },

    /**
     * 获取课程中相应学习状态的单词列表
     * @param lesson_name
     * @param learn_sections
     */
    getWordsOfLessonByLearnSection(lesson_name, learn_sections) {
        if(!(learn_sections instanceof Array)) {
            learn_sections = [learn_sections]
        }
        let lesson = _.find(this.info.lessons, function(item) {
            return item.name === lesson_name;
        });

        if(lesson) {
            let res = [];
            _.each(learn_sections, function(learn_section) {
                res = _.union(res, lesson.words[learn_section]);
            });
            return res;
        }
    },

    getWordDesc(word) {
        let w = this.library.words[word];
        if(w){
        return w.desc1;

        }
    }


});

Manager.instance = new Manager();

export {Manager, LearnSection, LearnStatus}
module.exports = Manager;