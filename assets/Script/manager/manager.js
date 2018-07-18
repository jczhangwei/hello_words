// let _ = require("underscore");
/**
 * 每个完成30分钟复习的一批单词为一个大组 group, 每个完成5分钟复习的组为一个小组，
 * 小组是临时的，不保存， 完成30分钟复习以后的大组保存为一个 group，
 * 以后按照大组来复习
 *
 */

/**
 * learn_type, 每个单词的学习状态， state的值对应当前已完成的阶段，state值为空等同于 NOT_START
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
    REVIEW5        : "review5",
    REVIEW30       : "review30",
    REVIEW_AFTER   : "review_after",
};

let Manager = cc.Class({
    name   : "Manager",
    extends: cc.Class,

    ctor() {
        this.init();
        this.library = null;

        this._cur_lesson   = null;
        this._cur_group    = null;
        this._learn_status = null;

        this._start_learn_time = 0;
        this._group_start_time = 0;

        this.word_num_per_group   = 10;
        this.group_num_per_course = 6;


        // 在学习过程中每五分钟一个的小组，临时数据，不保存
        this._little_groups = [];

        this.info = {
            cur_lesson_name: null,
            lessons        : [
                {
                    name     : "gre",
                    desc     : "GRE",
                    libraries: [
                        "gre"
                    ],

                    // 下面几个数据是咋学习或复习过程中的数据
                    learn_status   : LearnStatus.NOT_START,
                    cur_group      : [],
                    cur_group_index: 0,
                    // 每次30分钟学完的单词记为一组
                    groups         : [
                        // {
                        //     words: ["abandon"]
                        // },
                        /*.....*/
                    ],


                    words_info: {
                        abandon: {
                            learn_section: LearnSection.NOT_START.name,
                            learn_time   : {
                                review_m5 : null,
                                review_m30: null,
                                review_h12: null,
                                review_d2 : null,
                                review_d4 : null,
                                review_d8 : null,
                                review_d15: null,
                                review_d30: null,
                            }
                        }
                    },
                    words     : {
                        pass      : {},
                        not_start : {},
                        learn     : ["abandon"],
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

        };

        // init 其实应该做在创建课程的时候
        // this.info.lessons[0].words.not_start = this.getWordsForVocabulary("gre");

    },

    properties: {},

    init() {
        this.initLoader();
    },

    initLoader() {
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

    loadVocabulary(callback) {
        cc.loader.loadRes("db/library.json", function(err, data) {
            window.library = this.library = data;
            this.info.lessons[0].words.not_start = this.getWordsForVocabulary("gre");

            if(callback) {
                callback();
            }
        }.bind(this));
    },

    getVocabularyNames() {
        return this.vocabulary.SheetNames;
    },

    /**
     * 获得一个词典的单词个数
     * @param sheet_name
     * @returns {*}
     */
    getWordCount(vocabulary_name) {

        let item = _.find(this.library.list, function(item) {
            return item.name == vocabulary_name;
        });

        return item.words.length;
    },

    /**
     * 获得一个词典的单词列表
     * @param vocabulary_name
     * @returns {*|undefined}
     */
    getWordsForVocabulary(vocabulary_name) {
        let item = _.find(this.library.list, function(item) {
            return item.name === vocabulary_name;
        });

        return _.union(item.words);
    },

    /**
     * 获得单词库列表信息
     */
    getVoculbaryInfos() {
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

    /**
     * 创建课程，在课程创建页面点击确定后执行
     * @param name
     * @param libraries
     */
    createLesson: function(name, libraries) {
        // let lesson = {
        //     name        : name,
        //     libraries   : libraries,
        //     groups      : [],
        //     target_words: [],
        //     words       : {
        //         pass      : [],
        //         not_start : [],
        //         learn     : [],
        //         review_m5 : [],
        //         review_m30: [],
        //         review_h12: [],
        //         review_d2 : [],
        //         review_d4 : [],
        //         review_d8 : [],
        //         review_d15: [],
        //         review_d30: [],
        //         finish    : [],
        //     }
        // };
        //
        // _.each(function(library_name) {
        //     lesson.words.learn = _.union(lesson.words.not_start, this.getWordsForVocabulary(library_name));
        // });
        //
        // _.each(function(library_name) {
        //     lesson.target_words = this.getWordsForVocabulary(library_name);
        // });
        //
        // this.info.lessons.push(lesson)

    },

    getLessonByName(lesson_name) {
        let lesson = _.findWhere(this.info.lessons, {name: lesson_name});
        if(!lesson) {
            console.warn("Error: can't find lesson by name " + lesson_name);
            return;
        }

        return lesson;
    },

    isWordsNeedReview() {

    },

    isLessonNotFinish(lesson_name) {
        let lesson = _.findWhere(this.info.lessons, {name: lesson_name});
        return lesson && lesson.learn_status && lesson.learn_status !== LearnStatus.NOT_START;
    },

    getLessonStatus(lesson_name) {
        let lesson = _.findWhere(this.info.lessons, {name: lesson_name});
        return lesson && lesson.learn_status;
    },

    startLesson(lesson_name, learn_status) {
        learn_status = learn_status || LearnStatus.LEARN_NEW_WORDS;
        let lesson   = this.getLessonByName(lesson_name);
        if(!lesson) {
            return;
        }

        this.info.cur_lesson_name = lesson_name;
        let cur_lesson            = this._cur_lesson = _.findWhere(this.info.lessons, {name: lesson_name});
        let not_finish = cur_lesson.learn_status && cur_lesson.learn_status !== LearnStatus.NOT_START;
        if(!not_finish || cur_lesson.learn_status !== learn_status) {
            this._cur_lesson.learn_status    = learn_status;
            this._cur_lesson.cur_group       = [];
            this._cur_lesson.groups          = [];
            this._cur_lesson.cur_group_index = 0;
        }
    },

    toNextGroup: function() {
        this._cur_lesson.cur_group = [];
        this._cur_lesson.groups.push(this._cur_lesson.cur_group);
        this._cur_lesson.cur_group_index++;
    },

    reviewGroup: function() {
        this._cur_lesson.learn_status = LearnStatus.REVIEW5;

    },

    reviewGroups: function() {

    },

    /**
     * 在学习过程中，得到下一个要学的单词
     */
    getNextWord() {
        if(!this._cur_lesson) {
            return;
        }

        if(this._cur_lesson._learn_status === LearnStatus.LEARN_NEW_WORDS) {
            return this.getNextLearnWord();
        } else if(this._cur_lesson._learn_status === LearnStatus.REVIEW_AFTER) {
            return this.getNextReviewWord();
        }
    },

    getGroupWord(group_index, word_index) {
        if(!this._cur_lesson) {
            console.warn("Error: can't find current lesson.");
            return;
        }

        let group = this._cur_lesson.groups[group_index];
        if(group){
            return group[word_index];
        }

    },

    // set word reviewed, upgrade its section
    reviewWord(word) {
        // todo
    },

    /**
     * todo
     * 在学习过程中，得到下一个要学习的单词
     */
    getNextLearnWord() {
        if(this._learn_status === LearnStatus.LEARN_NEW_WORDS) {
            let word = this._cur_lesson.words.not_start.shift();
            if(!word || this.isGroupFinish() || this.isCourseFinish()) {
                return;
            }

            // add to group
            let cur_group = this._cur_lesson.cur_group;
            if(!cur_group || this.isGroupFinish()) {
                this._cur_lesson.cur_group = cur_group = [];
                this._cur_lesson.groups = cur_group;
            }
            let little_group = cur_group[this._cur_group.length - 1];
            if(!little_group) {
                little_group = [];
                this._little_groups.push(little_group);
            }
            little_group.push(word);

            // add learn progress info
            this._cur_lesson.words_info[word] = {
                learn_section: LearnSection.NOT_START.name,
                learn_time   : {
                    review_m5: this.getCurTime(),
                }
            };

            return word;
        }
    },

    /**
     * todo
     * 在复习过程中，得到下一个要复习的单词
     */
    getNextReviewWord() {

    },

    isGroupFinish() {
        return this._cur_lesson.cur_group.length >= this.word_num_per_group;
    },

    isCourseFinish() {
        return this.isGroupFinish() && this._cur_lesson.groups.length >= this.group_num_per_course;
    },

    getCurTime: function() {
        return Date.now();
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
        if(w) {
            return w.desc1;

        }
    }


});

Manager.instance = new Manager();

export {Manager, LearnSection, LearnStatus}