
module.exports = (fn) => {
    return (req, res, next) => {
        // Supports both async and sync route handlers.
        // If `fn` is sync, Promise.resolve will wrap the return value.
        // If `fn` is async (returns a promise), it will be awaited.
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
