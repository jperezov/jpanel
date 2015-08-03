define([
    'intern!object',
    'intern/chai!assert',
    'require',
    'src/js/core'
], function (registerSuite, assert, require, jPanel) {

    registerSuite({
        name: 'core',

        'prototype': function () {
            assert.equal(jPanel.fn, jPanel.prototype);
        },
        'extend': function() {
            var obj = {
                val1: 0,
                val2: 1
            };
            jPanel.extend(obj);
            assert.equal(jPanel.val1, obj.val1);
            assert.equal(jPanel.val2, obj.val2);
        }
    });
});