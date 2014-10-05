
var underscore = require("underscore");

var formator = module.exports = {};

// ------------------------------------------------------------------------------------------------
//
// MAKE
//
// [{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}
//
// ------------------------------------------------------------------------------------------------

formator.make = function(hashes) {
    var hash = underscore(hashes).reduce(function(memo, hash) {
        return underscore(memo).extend(hash);
    }, {});
    return this.fromHash(hash);
};

// ------------------------------------------------------------------------------------------------
//
// FROM HASH
//
// {a: 6, b: 7} -> {a: 0, b: 1}
//
// ------------------------------------------------------------------------------------------------

formator.fromHash = function(hash) {
    var lookup = {};
    var index = 0;
    for (var i in hash) {
        lookup[i] = index++;
    }
    return lookup;
}

// ------------------------------------------------------------------------------------------------
//
// TO ARRAY
//
// {a: 0, b: 1}, {a: 6} -> [6, 0]
//
// ------------------------------------------------------------------------------------------------

formator.toArray = function(lookup, hash) {
    var array = [];
    for (var i in lookup) {
        array[lookup[i]] = hash[i] || 0;
    }
    return array;
}

// ------------------------------------------------------------------------------------------------
//
// TO HASH
//
// {a: 0, b: 1}, [6, 7] -> {a: 6, b: 7}
//
// ------------------------------------------------------------------------------------------------

formator.toHash = function(lookup, array) {
    var hash = {};
    for (var i in lookup) {
        hash[i] = array[lookup[i]];
    }
    return hash;
}

// ------------------------------------------------------------------------------------------------
//
// FROM ARRAY
//
// ??? -> ???
//
// ------------------------------------------------------------------------------------------------

formator.fromArray = function(array) {
    var lookup = {};
    var z = 0;
    var i = array.length;
    while (i-- > 0) {
        lookup[array[i]] = z++;
    };
    return lookup;
}
