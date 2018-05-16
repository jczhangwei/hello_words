
let Manager = cc.Class({

    vocabulary: null,

    ctor: function() {
        this.init();
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
            xhr.onload = function(oEvent) {
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
        cc.loader.loadRes("db/words.xlsx", function(err, data) {
            window.gre = this.vocabulary = XLSX.read(data, {type: "array"});

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