define(function() {

    var version = "@VERSION";
    var jPanel = function() {
        //
    };
    jPanel.fn = jPanel.prototype = {
        jpanel: version,
        constructor: jPanel,
        modules: [] // Array of included modules
    };
    jPanel.extend = jPanel.fn.extend = function(obj) {
        var name, src, copy;
        if (obj !== null) {
            for (name in obj) {
                src = this[name];
                copy = obj[name];
                if (this === copy) {
                    continue;
                }
                if (copy !== undefined) {
                    this[name] = copy;
                }
            }
        }
        return this;
    };
    jPanel.extend({
        root: {}
    });

    return jPanel;
});