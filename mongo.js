const mongoose = require('mongoose');
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const uriMongo = `mongodb+srv://nahuelnievas30:${password}@fullstackopen.mpykiwn.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpen`;
mongoose.set('strictQuery', false);
mongoose.connect(uriMongo);

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
});

const Person = mongoose.model('Person', personSchema);
if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
    return;
}

const objPerson = new Person({
    name: name,
    number: number
});

objPerson.save().then(result => {
    console.log(`added ${objPerson.name} number ${objPerson.number} to phonebook`);
    mongoose.connection.close()
})