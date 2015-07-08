define([
    "../var/CLASS",
    "../var/SEL",
    "../var/DATA",
    "../var/document",
    "../var/timers",
    "../core",
    "../core/node",
    "../core/panel",
    "../core/root"
], function(CLASS, SEL, DATA, document, timers, jPanel, Node, Panel, Root) {

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

    return jPanel;
});