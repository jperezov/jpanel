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
            var key = $.data(DATA.GROUP_IN_DEVICE);
            var groupInDevice = {
                mobile: "mobile",
                desktop: "desktop"
            };
            /** @type {String} */
            self.groupInDevice = groupInDevice[key] || null;
        }
        function setSlideAxis() {
            var key = $.data(DATA.SLIDE_AXIS).match(/^y$/i);
            var slideAxis = {
                x: "x",
                y: "y"
            };
            /** @type {String} */
            self.slideAxis =  slideAxis[key] || self.parent.slideAxis;
        }
        function setInitialPosition() {
            /** @type {String} */
            self.initialPosition = self.slideAxis === "y" ? "top" : "right";
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
            if (self.groupInDevice === "desktop") return isMobile;
            else if (self.groupInDevice === "mobile") return !isMobile;
            return false;
        };

        // todo: change this to jpanel-show / jpanel-hide, and use data-initial-position in the CSS
        this.show = function() {
            $.removeClass(CLASS.HIDE.LEFT);
            $.removeClass(CLASS.HIDE.RIGHT);
            $.removeClass(CLASS.HIDE.TOP);
            $.removeClass(CLASS.HIDE.BOTTOM);
        };
        /**
         * @param {boolean} transitionNext
         */
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
        /**
         * Appropriately positions the next or previous panel
         * @param {boolean} transitionNext
         */
        this.prepareForTransition = function(transitionNext) {
            $.addClass(CLASS.DISPLAY_NONE);
            this.show();
            $.flushCSS();
            this.hide(!transitionNext);
            $.flushCSS();
            $.removeClass(CLASS.DISPLAY_NONE);
            $.flushCSS();
        };
        /**
         * Resets positions of sub-panels before transitioning to their containers
         * @param transitionNext
         */
        this.resetSubPanels = function(transitionNext) {
            if (self.panel === null) return;
            var stopCondition = transitionNext? "id" : "next";
            var oppositeDirection = transitionNext? "prev" : "next";
            while (self.panel[stopCondition]) {
                self.panel.resetSubPanels(transitionNext);
                self.panel.hide(transitionNext);
                $.flushCSS();
                self.panel = self.panel[oppositeDirection];
            }
            self.panel.show();
            $.flushCSS();
        };
    };

    return Panel;
});