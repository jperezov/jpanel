define([
    "../core/init"
], function(jPanel) {

    jPanel.init();

    if (typeof define === "function" && define.amd) {
        // Remain anonymous if AMD library is available
        define(function() {
            return jPanel;
        });
    } else {
        // Otherwise register jPanel as a global
        window.jPanel = jPanel;
    }
});