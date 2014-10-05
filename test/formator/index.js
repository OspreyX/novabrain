
var assert = require('assert');
var formator = require('./../../src/formator');

describe('Formator', function(){

    describe('#make', function(){
        it('should return', function() {
            var results = formator.make([{a: 1}, {b: 6, c: 7}]);
            assert.deepEqual(results, {a: 0, b: 1, c: 2});
        });
    });

    describe('#fromHash', function(){
        it('should return', function() {
            var results = formator.fromHash({a: 6, b: 7});
            assert.deepEqual(results, {a: 0, b: 1});
        });
    });

    describe('#toArray', function(){
        it('should return', function() {
            var results = formator.toArray({a: 0, b: 1}, {a: 6});
            assert.deepEqual(results, [6, 0]);
        });
    });

    describe('#toHash', function(){
        it('should return', function() {
            var results = formator.toHash({a: 0, b: 1}, [6, 7]);
            assert.deepEqual(results, {a: 6, b: 7});
        });
    });

    describe('#fromArray', function(){
        it('should return', function() {
            var results = formator.fromArray(['black', 'white']);
            assert.deepEqual(results, { white: 0, black: 1 });
        });
    });

});
