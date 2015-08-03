define([
    'intern!object',
    'intern/chai!assert',
    'require',
    'src/js/core/node'
], function (registerSuite, assert, require, Node) {

    registerSuite({
        name: 'node',

        'find': function () {
            var div = document.createElement("div");
            var p = document.createElement("p");
            div.appendChild(p);
            p.innerHTML = "hello";
            p.className = "findMe";
            assert.equal(Node.find("findMe", div).$.innerHTML, p.innerHTML);
        }
    });
});