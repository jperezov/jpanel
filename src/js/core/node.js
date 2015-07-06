define([
    "../var/CLASS"
], function(CLASS) {
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

    return Node;
});