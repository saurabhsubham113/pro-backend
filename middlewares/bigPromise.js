//use try catch with async-await || promise chaiing with then catch

module.exports = func => (req, res, next) =>
    Promise.resolve(func(req, res, next)).catch(next)