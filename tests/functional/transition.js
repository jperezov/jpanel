define([
    'intern!object',
    'intern/chai!assert',
    'require'
], function (registerSuite, assert, require) {
    var url = '../index.html';

    registerSuite({
        name: 'jPanel (functional)',

        'transition next': function () {
            return this.remote
                .get(require.toUrl(url))
                .findById('next')
                    .click()
                    .end()
                .findById('2')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, "Panel 2", 'Transitioning next should display the next panel');
                });
        },
        'transition prev': function () {
            return this.remote
                .get(require.toUrl(url))
                .findById('prev')
                    .click()
                    .end()
                .findById('3')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, "Panel 3", 'Transitioning back from the first panel should loop to the last');
                });
        },
        'transition infinite': function () {
            return this.remote
                .get(require.toUrl(url))
                .findById('next')
                    .click()
                    .click()
                    .click()
                    .click()
                    .click()
                    .end()
                .findById('2')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, "Panel 2", 'Transitioning past the last panel should loop to the start');
                });
        }
    });
});