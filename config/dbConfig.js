const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
})
    .then(() => console.log('connection to DB is successful'))
    .catch(e => {
        console.log(`connection to DB failed`);
        console.log(e.message);
        process.exit(1)
    })