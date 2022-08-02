const mongoose = require('mongoose');

const {NODE_PROJECT_HOST, NODE_PROJECT_DATABASE} = process.env
const mongoUrl =  `mongodb+srv://${NODE_PROJECT_HOST}/${NODE_PROJECT_DATABASE}`;

mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));
