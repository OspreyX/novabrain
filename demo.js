
var novabrain = require('./index');

var network = new novabrain.Network();

console.log('----------------------------------------------');
console.log('BACKPROP XOR TRAINING');
console.log('----------------------------------------------');

network.configure();

network.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(network.run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(network.run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(network.run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(network.run([1,1]) * 1) / 1);
console.log('');

console.log('----------------------------------------------');
console.log('GENETIC XOR TRAINING (UNSTABLE)');
console.log('----------------------------------------------');

network.configure({
    genetic : {
        population: 30,
        iterations: 2000,
        mutationRate: 0.3,
        variationRate: 0.8,
        survivalRate: 0.5,
    },
});

network.evolve([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
], function(data) {
    console.log(data);
}, 200);

console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(network.run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(network.run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(network.run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(network.run([1,1]) * 1) / 1);
console.log('');
//console.log(JSON.stringify(network.export(), null, 3));