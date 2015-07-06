define([
    "../core",
    "../var/document",
    "../var/getComputedStyle"
], function(jPanel, document, getComputedStyle) {

    var isMobile = jPanel.isMobile = (function() {
        // todo: add a check to see if #jpanel-mobile-check already exists
        document.body.insertAdjacentHTML('afterend', '<span id="jpanel-mobile-check"></span>');
        var mobileNode = document.getElementById("jpanel-mobile-check");
        return function() {
            if (getComputedStyle) {
                return +getComputedStyle(mobileNode, null).getPropertyValue('z-index') === 2;
            } else if (mobileNode.currentStyle){
                return +mobileNode.currentStyle.zIndex === 2;
            }
        };
    })();

    return isMobile;
});