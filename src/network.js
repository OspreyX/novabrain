
var Network = module.exports = function(__options) {

    var me = {};

    //
    // Network > configure
    //
    // Configure the network
    // 
    // @return this
    //
    this.configure = function(options) {
        
        options = options || {};
        options.backprop = options.backprop || {};
        options.genetic  = options.genetic  || {};

        me = {};

        if (options instanceof Network) {
            me = options.export();
        } else {
            me.numberOfInputs                  = options.numberOfInputs || 2;
            me.numberOfOutputs                 = options.numberOfOutputs || 1;
            me.numberOfHiddenLayers            = options.numberOfHiddenLayers || 1;
            me.numberOfNeuronsPerHiddenLayers  = options.numberOfNeuronsPerHiddenLayers 
                                                 || Math.max(3, Math.floor(me.numberOfInputs / 2));
            me.backprop = {
                iterations    : options.backprop.iterations   || 20000,
                learningRate  : options.backprop.learningRate || 0.3,
                momentum      : options.backprop.momentum     || 0.1,
                errorRate     : options.backprop.errorRate    || 0.005,
            };

            me.genetic = {
                population    : options.genetic.population    || 30,
                iterations    : options.genetic.iterations    || 2000,
                mutationRate  : options.genetic.mutationRate  || 0.3,
                variationRate : options.genetic.variationRate || 0.3,
                survivalRate  : options.genetic.survivalRate  || 0.3,
                errorRate     : options.genetic.errorRate     || 0.005,
            };

            if (Array.isArray(options.layers)) {
                me.layers = JSON.parse(JSON.stringify(options.layers));
            } else {
                me.layers = [];
                me.layers[0] = Network.createLayer(me.numberOfInputs, 1);
                for (var i = 1; i < me.numberOfHiddenLayers + 1; i++) {
                    me.layers[i] = Network.createLayer(me.numberOfNeuronsPerHiddenLayers, me.layers[i - 1].length);
                }
                me.layers[me.layers.length] = Network.createLayer(me.numberOfOutputs, me.layers[me.layers.length - 1].length);
            }
        }

        return this;
    };

    //
    // Network > run
    //
    // Return an array of sigmoid activations
    // 
    // @param  Array : Input values
    // @return Array
    //
    this.run = function(input) {
        if (!Array.isArray(me.layers)) {
            throw new Error('Network must be initialized with options or must be trained');
        }
        if (!(Array.isArray(input) && input.length === me.numberOfInputs)) {
            throw new Error('Network::run expected an array of ' + me.numberOfInputs + ' inputs');
        }
        var outputs = [];
        for (var layerId = 1; layerId < me.layers.length; layerId++) {
            outputs = input = Network.outputLayer(me.layers[layerId], input);
        }
        return outputs;
    };

    //
    // Network > export
    //
    // Returns network options
    // 
    // @return Object 
    //
    this.export = function() {
        return JSON.parse(JSON.stringify(me, function(key,value) {
            if (key=="changes") return undefined;
            else return value;
        }));
    };

    //
    // Network > train
    //
    // Train the network with back propagation
    // 
    // @param  Array    : Training data
    // @param  Function : Callback for log
    // @param  Integer  : Callback period
    // @return Object
    //
    this.train = function(data, callback, callbackPeriod) {

        // Init the network with training data
        if (!Array.isArray(me.layers)) {
            this.configure({
                numberOfInputs  : data[0].input.length,
                numberOfOutputs : data[0].output.length,
            });
        }

        if (!(Array.isArray(data[0].input) && data[0].input.length === me.numberOfInputs)) {
            throw new Error('Network::run expected an array of ' + me.numberOfInputs + ' inputs');
        }

        if (!(Array.isArray(data[0].output) && data[0].output.length === me.numberOfOutputs)) {
            throw new Error('Network::run expected an array of ' + me.numberOfOutputs + ' outputs');
        }

        var iterations      = me.backprop.iterations;
        var errorRate       = me.backprop.errorRate;
        var callbackPeriod  = callbackPeriod || 10;
        var error           = 1;
        for (var i = 0; i < iterations && error > errorRate; i++) {
            var sum = 0;
            for (var j = 0; j < data.length; j++) {
                sum += Network.backprop.trainPattern(this, me, data[j].input, data[j].output);
            }
            error = sum / data.length;
            if (callback && (i % callbackPeriod == 0)) {
                callback({ error: error, iterations: i });
            }
        }
        return { error: error, iterations: i };
    };

    //
    // Network > evolve
    //
    // Train the network with genetic algorithm
    // 
    // @param  Array    : Training data
    // @param  Function : Callback for log
    // @param  Integer  : Callback period
    // @return Object
    //
    this.evolve = function(data, callback, callbackPeriod) {

        // Init the network with training data
        if (!Array.isArray(me.layers)) {
            this.configure({
                numberOfInputs  : data[0].input.length,
                numberOfOutputs : data[0].output.length,
            });
        }

        if (!(Array.isArray(data[0].input) && data[0].input.length === me.numberOfInputs)) {
            throw new Error('Network::run expected an array of ' + me.numberOfInputs + ' inputs');
        }

        if (!(Array.isArray(data[0].output) && data[0].output.length === me.numberOfOutputs)) {
            throw new Error('Network::run expected an array of ' + me.numberOfOutputs + ' outputs');
        }

        var networks = [];
        var error = 1;
        var callbackPeriod = callbackPeriod || 10;

        for (var i = 0; i < me.genetic.population; i++) {
            networks.push(new Network(this));
        }

        for(var i = 0; i < me.genetic.iterations; i++) {

            for (var j = 0, jmax = networks.length; j < jmax; j++) {

                error = 0;
                data.forEach(function(set) {
                    error += Network.genetic.getErrorSum(networks[j].run(set.input), set.output);
                });

                networks[j].__fitness = error;

                if (callback && (i % callbackPeriod == 0)) {
                    callback({ error: error, iterations: i });
                }

                if (error <= me.genetic.errorRate) {
                    this.configure(networks[0]);
                    return { error: error, iterations: i };
                }
            };

            networks = Network.genetic.epoch(me, networks);
        }

        this.configure(networks[0]);

        return { error: error, iterations: i };
    };

    if (__options) {
        this.configure(__options);
    }
};

//-------------------------------------------------------------------------------------------------
// Helpers
//-------------------------------------------------------------------------------------------------

Network.zeros = function(size) {
    var results = [];
    for (var i = 0; i < size; i++) {
        results.push(0);
    }
    return results;
};

Network.randos = function(size) {
    var results = [];
    for (var i = 0; i < size; i++) {
        results.push(Math.random() * 0.4 - 0.2);
    }
    return results;
};

Network.createLayer = function(numberOfNeurons, numberOfInputsPerNeuron) {
    var layer = [];
    for (var i = 0; i < numberOfNeurons; i++) {
        layer[i] = {
            bias: Math.random() * 0.4 - 0.2,
            weights: Network.randos(numberOfInputsPerNeuron),
            changes: Network.zeros(numberOfInputsPerNeuron),
        };
    }
    return layer;
};

Network.outputLayer = function(layer, input) {
    var results = [];
    for (var neuronId = 0; neuronId < layer.length; neuronId++) {
        var neuron = layer[neuronId];
        var sum = neuron.bias;
        for (var k = 0; k < neuron.weights.length; k++) {
            sum += neuron.weights[k] * input[k];
        }
        results.push(1 / (1 + Math.exp(-sum)));
    }
    return results;
};

Network.backprop = {

    getOutputs: function(me, input) {
        var outputs = [];
        var data    = outputs[0] = input.slice();
        for (var layerId = 1; layerId < me.layers.length; layerId++) {
            data = outputs[layerId] = Network.outputLayer(me.layers[layerId], data);
        }
        return outputs;
    },

    getErrorSum: function(errors) {
        var sum = 0;
        for (var i = 0; i < errors.length; i++) {
            sum += Math.pow(errors[i], 2);
        }
        return sum / errors.length;
    },

    trainPattern: function(network, me, input, target) {

        var learningRate = me.backprop.learningRate;
        var momentum     = me.backprop.momentum;
        var errors       = [];
        var deltas       = [];
        var outputs      = Network.backprop.getOutputs(me, input);

        // Calculate errors and deltas

        for (var layerId = me.layers.length - 1; layerId >= 0; layerId--) {
            errors[layerId] = [];
            deltas[layerId] = [];
            for (var neuronId = 0; neuronId < me.layers[layerId].length; neuronId++) {
                var output = outputs[layerId][neuronId];
                var error  = 0;
                if (layerId === me.layers.length - 1) {
                    error = target[neuronId] - output;
                } else {
                    var d = deltas[layerId + 1];
                    for (var k = 0; k < d.length; k++) {
                        error += d[k] * me.layers[layerId + 1][k].weights[neuronId];
                    }
                }
                errors[layerId][neuronId] = error;
                deltas[layerId][neuronId] = error * output * (1 - output);
            }
        }

        // Back propagate
        // Store neuron changes for the next backprop

        for (var layerId = 1; layerId < me.layers.length; layerId++) {
            var incoming = outputs[layerId - 1];
            for (var neuronId = 0; neuronId < me.layers[layerId].length; neuronId++) {
                var delta  = deltas[layerId][neuronId];
                var neuron = me.layers[layerId][neuronId];
                if (!neuron.changes) {
                    neuron.changes = Network.zeros(neuron.weights.length);
                }
                for (var k = 0; k < incoming.length; k++) {
                    var change = neuron.changes[k];
                    change = (learningRate * delta * incoming[k]) + (momentum * change);
                    neuron.changes[k]  = change;
                    neuron.weights[k] += change;
                }
                neuron.bias += learningRate * delta;
            }
        }

        return Network.backprop.getErrorSum(errors[me.layers.length - 1]);
    }

};

Network.genetic = {

    getErrorSum: function (a, b) {
        var sumError = 0;
        for (var i = a.length - 1; i >= 0; i--) {
            sumError += Math.abs(a[i] - b[i]);
        };
        return sumError;
    },

    mutate: function(me, previous) {
        previous.layers.forEach(function(layer) {
            layer.forEach(function(neuron) {
                neuron.weights.forEach(function(weight, i) {
                    if(Math.random() < me.genetic.mutationRate) {
                        neuron.weights[i] += (Math.random() * 2 - 1) * me.genetic.variationRate;
                    }
                });
                if(Math.random() < me.genetic.mutationRate) {
                    neuron.bias += (Math.random() * 2 - 1) * me.genetic.variationRate;
                }
            });
        });
        return previous;
    },

    epoch: function (me, networks) {
        networks.sort(function(a, b) { return a.__fitness - b.__fitness; });
        var count = networks.length;
        var kills = Math.floor(me.genetic.survivalRate * count);
        networks.splice(kills);
        for(var i = 0, imax = count - kills; i < imax; i++) {
            var previous = networks[Math.floor(Math.random() * kills)].export();
            networks.push(new Network(Network.genetic.mutate(me, previous)));

        }
        return networks;
    },

};
