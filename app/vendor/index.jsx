define(function(require,exports, module) {

    var Layout = require('./share/layout');

    var IndexReactApp = {

        getInstance:function(model,options){
            var modelData = new Backbone.Model(model);
            return function (){
                switch(options){
                    default:
                        ReactDOM.render(<Layout data={modelData} />, document.getElementById('indexView'));
                        break;
                }
            }();
        }

    };

    module.exports = IndexReactApp;
});