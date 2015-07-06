define([
    "../var/CLASS",
    "../var/SEL",
    "../var/DATA",
    "./isMobile"
], function(CLASS, SEL, DATA, isMobile) {

    /**
     * @param {Node} $
     * @constructor
     */
    var Root = function($) {
        var self = this;
        /** @type {Panel} */
        this.panel = null;
        /** @type {Panel} */
        this.firstPanel = null;
        /** @type {Panel} */
        this.lastPanel = null;
        /** @type {Number} */
        this.depth = 0;
        /** @type {Node} */
        this.$ = $;

        /**
         * Initialization function
         */
        this.init = function() {
            setInitializeOn();
            setSlideAxis();
            setTransitionTimer();
            setTransition();
        };
        /**
         * Adds animation to panels. Must be called *after* adding panels.
         */
        this.setAnimation = function() {
            $.addClass(CLASS.ANIMATE.DEFAULT);
        };
        this.removeAnimation = function() {
            $.removeClass(CLASS.ANIMATE.DEFAULT);
        };

        function setInitializeOn() {
            self.initializeOn = $.data(DATA.INITIALIZE_ON) || "immediate";
        }
        function setSlideAxis() {
            /** @type {String} */
            self.slideAxis = $.data(DATA.SLIDE_AXIS).match(/^y$/i) ? "y" : "x";
        }
        function setTransitionTimer() {
            self.transitionTimer = +$.data(DATA.TRANSITION_TIMER) || 0;
        }
        function setTransition() {
            if (self.transitionTimer > 0) {
                self.timer = setInterval(self.next, self.transitionTimer);
            } else {
                $.on('click', SEL.TRANSITION, function(event) {
                    // todo: figure out a better way to call this
                    var goTo = self.$.data(DATA.GO_TO, undefined, event.target);
                    if (goTo.match(/^prev$/i)) {
                        self.prev();
                    } else {
                        self.next();
                    }
                });
            }
        }

        /**
         * Transitions to the next or previous panel
         * @param {string} direction
         */
        function transition(direction) {
            var transitionNext = direction == "next";
            direction = transitionNext ? "next" : "prev";
            if (
                self.panel.panel &&
                self.panel.panel[direction] &&
                (
                    (self.panel.groupInDevice === "desktop" && isMobile() === true) ||
                    (self.panel.groupInDevice === "mobile" && isMobile() === false)
                )
            ) {
                self.panel.panel[direction].prepareForTransition(transitionNext);
                self.panel.panel.hide(transitionNext);
                self.panel.panel[direction].show();
                self.panel.panel = self.panel.panel[direction];
            } else if (self.panel[direction]) {
                self.panel[direction].prepareForTransition(transitionNext);
                self.panel.hide(transitionNext);
                self.panel[direction].show();
                self.panel = self.panel[direction];
            } else {
                (function(panel) {
                    self[panel].prepareForTransition(transitionNext);
                    self.panel.hide(transitionNext);
                    self[panel].show();
                    self.panel = self[panel];
                })(transitionNext ? "firstPanel" : "lastPanel");
            }
        }

        this.next = function() {
            transition("next");
        };
        this.prev = function() {
            transition("prev");
        };
    };

    return Root;
});