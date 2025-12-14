let Callbacks = {};

const loadCallbacks = ( callbacks ) => {
    Callbacks = callbacks;
};

const getCallbacks = ( key ) => {
    return Callbacks[key] || [];
}

module.exports = {
    getCallbacks,
    loadCallbacks
};
