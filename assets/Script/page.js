

let Page = cc.Class({
    extends: cc.Component,
    properties: {
    },

    onLoad: function(){
        this.bind_buttons();
    },

    update: function () {

    },

    bind_buttons: function() {
        let bind_buttons = function(node, listener) {
            for(let key in node.children){
                let child = node.children[key];
                let btn = child.getComponent(cc.Button);
                if(btn){
                    child.on("click", function(event) {
                        let fun = listener["on_" + child.name];
                        if(fun){
                            fun.call(listener, child, event)
                        }
                    })
                }

                bind_buttons(child, listener);
            }
        };

        bind_buttons(this.node, this);
    }

});

export {Page}