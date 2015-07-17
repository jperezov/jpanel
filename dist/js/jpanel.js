/**!
 * jPanel v0.2.0
 * Copyright (c) 2015 Jonathan Perez.
 * Licensed under the MIT License.
 */
(function() {
    /**
     * Class name constants
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
        },
        DISPLAY_NONE: 'jpanel-display-none'
    };

    /**
     * Selector constants
     * @const
     */
    var SEL = {
        ROOT: '.' + CLASS.ROOT,
        NODE: '.' + CLASS.NODE,
        TRANSITION: '.' + CLASS.TRANSITION
    };

    /**
     * Data attr constants
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

    var document = window.document;

    /**
     * Timer object
     */
    var timers = {
        timerID: 0,
        timers: [],
        add: function(fn) {
            this.timers.push(fn);
        },
        start: function() {
            if (this.timerID) return;
            var self = this;
            (function runNext() {
                if (self.timers.length > 0) {
                    for (var i = 0; i < self.timers.length; i++) {
                        if (self.timers[i]() === undefined) {
                            self.timers.splice(i, 1);
                            i--;
                        }
                    }
                    self.timerID = setTimeout(runNext, 0);
                }
            })();
        },
        stop: function() {
            clearTimeout(this.timerID);
            this.timerID = 0;
        }
    };



    var version = "0.2.0";
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

    /**
     * Custom wrapper for HTML DOM elements
     * @param {HTMLElement} [node]
     * @constructor
     */
    var Node = function(node) {
        /** @type {HTMLElement} */
        var $ = node;
        var self = this;
        this.$ = node; // used for debugging. todo: remove when done.

        /**
         * Returns the first child matching the given selector
         * @param {string} selector
         * @param {HTMLElement} [node]
         * @returns {Node|null}
         */
        this.find = function(selector, node) {
            node = node || $;
            var element = node.querySelector(selector);
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
            return sibling && self.hasClass(findClass, sibling) ? new Node(sibling) : null;
        };
        /**
         * Get or set custom data attributes.
         * 'data-' automatically appended.
         * @param {string} key
         * @param {*} [val]
         * @param {HTMLElement} [node]
         * @returns {string}
         */
        this.data = function(key, val, node) {
            node = node || $;
            key = 'data-' + key;
            if (val !== undefined) {
                node.setAttribute(key, val);
            } else {
                return node.getAttribute(key) || "";
            }
        };
        /**
         * Add a class to the DOM element
         * @param {string} className
         * @param {HTMLElement} [node]
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
         * @param {HTMLElement} [node]
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
         * @param {HTMLElement} [node]
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
         * @param {HTMLElement} [node]
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
        this.flushCSS = function() {
            var getOffMyChestIDE = $.offsetHeight;
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
    var getComputedStyle = window.getComputedStyle;



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
         * todo: fix sub-panel transitions on infinite scrolling
         * @param {string} direction
         * @param {Root|Panel} root
         */
        function transition(direction, root) {
            var transitionNext = direction === "next";
            direction = transitionNext ? "next" : "prev";
            if (root.panel.panel && root.panel.panel[direction] && root.panel.transitionContents(isMobile())) {
                transition(direction, root.panel);
            } else if (root.panel[direction]) {
                root.panel[direction].prepareForTransition(transitionNext);
                root.panel.hide(transitionNext);
                root.panel[direction].show();
                root.panel = root.panel[direction];
            } else {
                (function(panel) {
                    root[panel].prepareForTransition(transitionNext);
                    root.panel.hide(transitionNext);
                    root[panel].show();
                    root.panel = root[panel];
                })(transitionNext ? "firstPanel" : "lastPanel");
            }
        }

        this.next = function() {
            transition("next", self);
        };
        this.prev = function() {
            transition("prev", self);
        };
    };


    jPanel.extend({
        init: function() {
            //
            var roots = document.querySelectorAll(SEL.ROOT);
            var rootCount = 0;
            if (roots.length === 0) return false;
            /**
             * Initializes a given jPanel root.
             * @param root
             */
            function initRoot(root) {
                timers.add(function() {
                    root.init();
                    addPanels(root);
                    root.$.flushCSS();
                    root.setAnimation();
                });
            }
            for (var rKey in roots) {
                if (roots.hasOwnProperty(rKey) && rKey != "length") {
                    /** @type {Node} */
                    var rootNode = new Node(roots[rKey]);
                    var rootName = rootNode.data(DATA.ROOT) || rootCount++;
                    // todo: make sure this name-conflict-preventor thing works.
                    if (this.root[rootName]) rootName += rootCount;
                    this.root[rootName] = new Root(rootNode);
                    initRoot(this.root[rootName]);
                }
            }
            timers.start();
        },
        // todo: fill this out
        initializeOn: function(initCondition) {
            var initConditions = {
                immediate: function() {
                    //
                },
                load: function() {
                    //
                },
                render: function() {
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
        }
    });

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
            if (panel.next === null) {
                root.lastPanel = panel;
                while (panel.prev !== null) {
                    if (panel.prev.depth !== panel.depth) {
                        root.firstPanel = panel;
                        return panel;
                    }
                    panel = panel.prev;
                }
                root.firstPanel = panel;
                return panel;
            }
            return a(panel.next, panel);
        })(new Panel(root.$.find(SEL.NODE), root), null);
    }


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

}());