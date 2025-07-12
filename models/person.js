const mongoose = require('mongoose');
const uriMongo = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(uriMongo);

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
});
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});
const Person = mongoose.model('Person', personSchema);
module.exports = Person;