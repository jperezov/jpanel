/**
 * Timer object
 */
define(function() {
    return {
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
});