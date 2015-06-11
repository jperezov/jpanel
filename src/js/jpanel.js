/**
 * Copyright (c) 2015 Jonathan Perez.
 * Licensed under the MIT License.
 */

(function() {
    /**
     * Class Constants
     * @const
     */
    var CLASS = {
        ROOT: 'jpanel-root',
        NODE: 'jpanel-node',
        TRANSITION: 'jpanel-transition', // paired with data-go-to="next|prev|#"
        HIDE: {
            PREFIX: 'jpanel-hide-',
            LEFT: 'jpanel-hide-left',
            RIGHT: 'jpanel-hide-right',
            TOP: 'jpanel-hide-top',
            BOTTOM: 'jpanel-hide-bottom'
        },
        ANIMATE: {
            DEFAULT: 'jpanel-animate',
            FAST: 'jpanel-animate-fast'
        }
    };
    /**
     * Selector Constants
     * @const
     */
    var SEL = {
        ROOT: '.' + CLASS.ROOT,
        NODE: '.' + CLASS.NODE,
        TRANSITION: '.' + CLASS.TRANSITION
    };
    /**
     * Data Constants
     * @const
     */
    var DATA = {
        ROOT: 'jp-root',
        INITIALIZE_ON: 'jp-initialize-on',
        SLIDE_AXIS: 'jp-slide-axis',
        INITIAL_POSITION: 'jp-initial-position',
        GROUP_IN_DEVICE: 'jp-group-in-device',
        TRANSITION_TIMER: 'jp-transition-timer',
        GO_TO: 'jp-go-to'
    };

    /**
     * Custom wrapper for HTML DOM elements
     * @param {node|HTMLElement} [node]
     * @constructor
     */
    var Node = function(node) {
        /** @type {node|HTMLElement} */
        var $ = node;
        var self = this;
        this.$ = node; // used for debugging. todo: remove when done.

        /**
         * Returns the first child matching the given selector
         * @param {string} selector
         * @param {node|HTMLElement} [node]
         * @returns {Node|null}
         */
        this.find = function(selector, node) {
            node = node || $;
            var element = node.querySelectorAll(selector)[0];
            return element ? new Node(element) : null;
        };
        /**
         * Returns the next sibling with class name className or CLASS.NODE_CLASS
         * @param {string} [className]
         * @returns {Node|null}
         * @see C
         */
        this.next = function(className) {
            var sibling = $;
            var findClass = className || CLASS.NODE;
            do {
                sibling = sibling.nextSibling;
            } while (
                sibling &&
                sibling.nodeType !== 1 &&
                self.hasClass(findClass, sibling) === false
            );
            return sibling ? new Node(sibling) : null;
        };
        /**
         * Get or set custom data attributes.
         * 'data-' automatically appended.
         * @param {string} key
         * @param {*} [val]
         * @param {node|HTMLElement} [node]
         * @returns {string}
         */
        this.data = function(key, val, node) {
            node = node || $;
            key = 'data-' + key;
            if (val !== undefined) {
                // Setter
                node.setAttribute(key, val);
            } else {
                // Getter
                return node.getAttribute(key) || "";
            }
        };
        /**
         * Add a class to the DOM element
         * @param {string} className
         * @param {node|HTMLElement} [node]
         */
        this.addClass = function(className, node) {
            node = node || $;
            if (node.classList) {
                node.classList.add(className);
            } else {
                node.className += ' ' + className;
            }
        };
        /**
         * Remove a class from the DOM element
         * @param {string} className
         * @param {node|HTMLElement} [node]
         */
        this.removeClass = function(className, node) {
            node = node || $;
            if (node.classList) {
                node.classList.remove(className);
            } else {
                node.className = node.className.replace(
                    new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '
                );
            }
        };
        /**
         * Checks to see if the DOM element has the given class name
         * @param {string} className
         * @param {node|HTMLElement} [node]
         * @return {boolean}
         */
        this.hasClass = function(className, node) {
            node = node || $;
            if (node.classList) {
                return node.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(node.className);
            }
        };
        /**
         *
         * @param {string} selector
         * @param {node|HTMLElement} [node]
         * @returns {boolean}
         */
        this.matches = function(selector, node) {
            node = node || $;
            var _matches = (node.matches || node.matchesSelector || node.msMatchesSelector || node.mozMatchesSelector || node.webkitMatchesSelector || node.oMatchesSelector);

            if (_matches) {
                return _matches.call(node, selector);
            } else {
                var nodes = node.parentNode.querySelectorAll(selector);
                for (var i = nodes.length; i--;) {
                    if (nodes[i] === node)
                        return true;
                }
                return false;
            }
        };
        /**
         * Attach an event listener to the DOM element
         * todo: figure out how to add third parameter on overloaded method
         * @param {string} eventName
         * @param {function} handler
         */
        this.on = function(eventName, handler) {
            var args = [].slice.call(arguments);
            if (args.length === 3) {
                /** @type {string} */
                var selector = arguments[1];
                handler = arguments[2];
            }
            function runHandler(event) {
                var selectorMatches = selector ? self.matches(selector, event.target) : true;
                if (selectorMatches) handler.call($, event);
            }
            if ($.addEventListener) {
                $.addEventListener(eventName, runHandler);
            } else {
                $.attachEvent('on' + eventName, runHandler);
            }
        };
    };

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
         * @returns {*}
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

        this.transition = function(functionName, timeout) {
            timeout = timeout || 0;
            setTimeout(function() { self[functionName](); }, timeout);
        };
    };
    /**
     * @param {Node} $
     * @constructor
     */
    var Root = function($) {
        var self = this;
        /** @type {Panel} */
        this.panel = null;
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

        this.next = function() {
            if (self.panel.next){
                self.panel.hide(true);
                self.panel.next.show();
                self.panel = self.panel.next;
            }
        };
        this.prev = function() {
            if (self.panel.prev){
                self.panel.hide(false);
                self.panel.prev.show();
                self.panel = self.panel.prev;
            }
        };
    };

    var timers = {
        timerID: 0,
        timers: [],
        add: function(fn) {
            this.timers.push(fn);
        },
        start: function() {
            if (this.timerID) return;
            (function runNext() {
                if (timers.timers.length > 0) {
                    for (var i = 0; i < timers.timers.length; i++) {
                        if (!!timers.timers[i]() == false) {
                            timers.timers.splice(i, 1);
                            i--;
                        }
                    }
                    timers.timerID = setTimeout(runNext, 0);
                }
            })();
        },
        stop: function() {
            clearTimeout(this.timerID);
            this.timerID = 0;
        }
    };

    /** @constructor */
    var Jpanel = function() {
        var self = this;
        /**
         * A list of roots. <i>Not</i> an array.
         * @type {Root[]}
         */
        this.root = {};

        this.init = function() {
            //
            var roots = document.querySelectorAll(SEL.ROOT);
            var rootCount = 0;
            if (roots.length === 0) return false;
            for (var rKey in roots) {
                if (roots.hasOwnProperty(rKey) && rKey != "length") {
                    /** @type {Node} */
                    var rootNode = new Node(roots[rKey]);
                    var rootName = rootNode.data(DATA.ROOT) || rootCount++;
                    // todo: make sure this name-conflict-preventor thing works.
                    if (self.root[rootName]) rootName += rootCount;
                    self.root[rootName] = new Root(rootNode);
                    (function(root) {
                        timers.add(function() {
                            root.init();
                            addPanels(root);
                            root.setAnimation();
                        });
                    })(self.root[rootName]);
                }
            }
            timers.start();
        };

        //todo: add timers to separate out each panel addition
        /**
         * Adds a panel group based on the jpanel-root name.
         * @param {Root} root
         */
        function addPanels(root) {
            /**
             * Add all the panels
             * @param {Panel} panel
             * @param {Panel} prev
             */
            root.panel = (function a(panel, prev) {
                panel.id = prev? prev.id + 1 : 0;
                panel.init();

                var nextPanel = panel.$.next(CLASS.NODE);
                panel.prev = prev;
                panel.next = nextPanel ? new Panel(nextPanel, panel.parent) : null;

                // Add sub-panels if appropriate
                var subPanel = panel.$.find(SEL.NODE) || null;
                if (subPanel) {
                    panel.panel = a(new Panel(subPanel, panel), null);
                }

                // Terminal condition
                if (panel.next == null) {
                    while (panel.prev !== null) {
                        if (panel.prev.depth !== panel.depth) {
                            return panel;
                        }
                        panel = panel.prev;
                    }
                    return panel;
                }
                return a(panel.next, panel);
            })(new Panel(root.$.find(SEL.NODE), root), null);
        }

        // todo: figure this out.
        this.initializeOn = function(initCondition) {
            var initConditions = {
                immediate: function() {
                    //
                },
                onLoad: function() {
                    //
                },
                onRender: function() {
                    //
                },
                custom: function() {
                    //
                }
            };
            if (initConditions[initCondition]) {
                initConditions[initCondition]();
            } else {
                initConditions.immediate();
            }
        };
    };

    /**
     * Throws an alert for our library
     * todo: only throw an alert if in "dev" mode. Add "dev" mode.
     * @param err
     */
    function throwAlert(err) {
        if (console !== undefined && typeof console.log == "function") {
            console.log("jPanel error: " + err);
        } else {
            // todo: Add this back once I add in "dev" mode.
            //alert("jPanel error: " + err);
        }
    }
    window.Jpanel = new Jpanel();
    window.Jpanel.init();
})();