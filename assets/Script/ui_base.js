
let UIBase = cc.Class({
    extends: cc.Component,
    properties: {
    },

    onLoad: function(){
        this.bind_buttons();
    },

    init: function() {

    },

    update: function () {

    },

    bind_buttons: function() {
        function bind_button(node, listener) {
            let btn = node.getComponent(cc.Button);
            if(btn) {
                node.on("click", function(event) {
                    let s = "on_" + node.name;
                    let fun = listener[s];
                    if(fun) {
                        fun.call(listener, node, event)
                    }
                })
            }
        }

        let bind_buttons = function(node, listener) {
            bind_button(node, listener);
            for(let key in node.children){
                let child = node.children[key];

                if(!child.getComponent(UIBase)){
                    bind_buttons(child, listener);
                }
            }
        };

        bind_buttons(this.node, this);
    }

});

export {UIBase}