define([
    "../var/CLASS",
    "../var/DATA"
], function(CLASS, DATA) {

    /**
     * @param {Node} [$]
     * @param {Panel|Root} [parent]
     * @constructor
     */
    var Panel = function($, parent) {
        var self = this;
        /** @type {Number} */
        this.id = 0;
        /** @type {Node} */
        this.$ = $;
        /** @type {Panel} */
        this.next = null;
        /** @type {Panel} */
        this.prev = null;
        /** @type {Panel|Root} */
        this.parent = parent || null;
        /** @type {Panel} */
        this.panel = null;

        /**
         * Initialization function
         */
        this.init = function() {
            setPanelDepth();
            setGroupInDevice();
            setSlideAxis();
            setInitialPosition();
        };
        function setPanelDepth() {
            /** @type {Number} */
            self.depth = +self.parent.depth + 1;
        }
        function setGroupInDevice() {
            /** @type {String} */
            self.groupInDevice = $.data(DATA.GROUP_IN_DEVICE) == "desktop" ? "desktop" : "mobile";
        }
        function setSlideAxis() {
            /** @type {String} */
            self.slideAxis = $.data(DATA.SLIDE_AXIS).match(/^y$/i) ?
                "y" :
                (self.parent.slideAxis == "y" ?
                    "y" :
                    "x");
        }
        function setInitialPosition() {
            /** @type {String} */
            self.initialPosition = self.slideAxis == "y" ? "top" : "right";
            if (self.id > 0) {
                $.addClass(CLASS.HIDE.PREFIX + self.initialPosition);
            }
        }

        /**
         * Determines whether to transition to the next sibling, or to the next child.
         * @param isMobile
         * @returns {boolean}
         */
        this.transitionContents = function(isMobile) {
            if (self.groupInDevice == "desktop") return isMobile;
            else if (self.groupInDevice == "mobile") return !isMobile;
            return false;
        };

        // todo: change this to jpanel-show / jpanel-hide, and use data-initial-position in the CSS
        this.show = function() {
            $.removeClass(CLASS.HIDE.LEFT);
            $.removeClass(CLASS.HIDE.RIGHT);
            $.removeClass(CLASS.HIDE.TOP);
            $.removeClass(CLASS.HIDE.BOTTOM);
        };

        this.hide = function(transitionNext) {
            switch (self.initialPosition) {
                case "top":
                    $.addClass(transitionNext ? CLASS.HIDE.BOTTOM : CLASS.HIDE.TOP);
                    break;
                case "left":
                    $.addClass(transitionNext ? CLASS.HIDE.RIGHT : CLASS.HIDE.LEFT);
                    break;
                case "bottom":
                    $.addClass(transitionNext ? CLASS.HIDE.TOP : CLASS.HIDE.BOTTOM);
                    break;
                default: // right
                    $.addClass(transitionNext ? CLASS.HIDE.LEFT : CLASS.HIDE.RIGHT);
                    break;
            }
        };

        this.prepareForTransition = function(transitionNext) {
            $.addClass(CLASS.DISPLAY_NONE);
            this.show();
            $.flushCSS();
            this.hide(!transitionNext);
            $.flushCSS();
            $.removeClass(CLASS.DISPLAY_NONE);
            $.flushCSS();
        };
    };

    return Panel;
});