require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');
const app = express();
app.use(express.json());
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World<h1/>')
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    })
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        res.json(person);
    }).catch(error => {
        console.error('error get by id', error.message);
        res.status(500).json(error);
    });
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(data => {
        if (!data) {
            res.status(400).json({ 'error': 'no persons found given ID.' }).end();
            return;
        }
        console.log('data', data);
        res.status(200).json(data).end();
    }).catch(error => {
        console.error('error delete', error);
        res.status(500).json(error);
    });
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number
    });
    let errorResponse = validateCreatePerson(person)
    if (errorResponse) {
        res.status(400).json({
            error: errorResponse
        });
        return;
    }
    person.save().then(p => {
        res.json(person);
    });
});

const validateCreatePerson = (body) => {
    if (!body.name && !body.number) {
        return 'name and number is missing';
    }
    if (!body.name) {
        return 'name is missing.';
    }
    if (!body.number) {
        return 'number is missing.';
    }
    // if (Person.find(p => p.name === body.name)) {
    //     return 'name must be unique';
    // }
}

const generateId = () => {
    let min = persons.length;
    let max = min + 100;
    return Math.floor(Math.random() * (max - min) + min);
};

app.get('/info', (req, res) => {
    let today = new Date();
    let htmlResponse = `
    <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${today}</p>
    </div>`;
    res.send(htmlResponse).end();
});

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)