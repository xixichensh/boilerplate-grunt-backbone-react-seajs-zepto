define(function(require,exports, module) {

    var BackboneMixin = {
        componentDidMount: function () {
            this.getBackboneModel().bind('change', this.forceUpdate.bind(this, null));
        },
        componentWillUnmount: function () {
            this.getBackboneModel().unbind(null, null, this);
        }
    };

    var Layout = React.createClass({
        mixins: [BackboneMixin],

        getBackboneModel: function () {
            return this.props.data;
        },

        render: function () {

            return (
                <section>
                    
                    Hello World
					
                </section>
            );
        }
    });
    module.exports = Layout;
});