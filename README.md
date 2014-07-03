# Novabrain

Novabrain is a Node.js [neural network](http://en.wikipedia.org/wiki/Artificial_neural_network) module.

```
$ npm install novabrain
```
### Back Propagation Training

This example shows how the neural network is trained to learn XOR

```javascript
var novabrain = require('novabrain');
var network = new novabrain.Network();

network.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
], function(data) {
    console.log(data);
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
```

### Genetic Algorithm Training

---

**!!! NEED HELP TO STABILIZE NETWORK EVOLVE METHOD !!!**

*
Evolve method implemented for tests but instable
From time to time a correct result is found but often fitness is locked to ~ 1.000 ....
*

---

This example shows how the neural network is trained to learn XOR

```javascript
var novabrain = require('novabrain');
var network = new novabrain.Network();

network.evolve([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
], function(data) {
    console.log(data);
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
```

### Mocha is used for unit testing
```
$ npm install mocha -g
$ mocha
$ mocha test
$ mocha test/base-network
$ mocha test/genetic-network
$ ...
```
