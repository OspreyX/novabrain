
var novabrain = require('./index');

var network = new novabrain.Network();

network.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
], {
    callback: function(data) {
        console.log(data);
    }
});

console.log('');
console.log('----------------------------------------------');
console.log('XOR RESULTS');
console.log('----------------------------------------------');
console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(network.run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(network.run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(network.run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(network.run([1,1]) * 1) / 1);
console.log('');
console.log('----------------------------------------------');
console.log('');