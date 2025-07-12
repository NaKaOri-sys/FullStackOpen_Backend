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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(result => {
        res.json(result);
    }).catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (!person) {
            res.status(404).json({ error: 'n' });
            return;
        }
        res.json(person);
    }).catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(data => {
        if (!data) {
            res.status(400).json({ 'error': 'no persons found given ID.' }).end();
            return;
        }
        console.log('data', data);
        res.status(200).json(data).end();
    }).catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const person = {
        number: body.number
    };

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true }).then(data => {
        if (!data) {
            res.status(400).json({ 'error': 'no persons found given ID.' }).end();
            return;
        }
        res.json(data).end();
    }).catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number
    });
    // let errorResponse = validateCreatePerson(person)
    // if (errorResponse) {
    //     res.status(400).json({
    //         error: errorResponse
    //     });
    //     return;
    // }
    person.save().then(p => {
        res.json(person);
    }).catch(error => next(error));
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

app.get('/info', (req, res, next) => {
    let today = new Date();
    Person.countDocuments().then(data => {
        let htmlResponse = `
        <div>
            <p>Phonebook has info for ${data} people</p>
            <p>${today}</p>
        </div>`;
        res.send(htmlResponse).end();
    }).catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).send({
            error: "The fields are required, and 'name' must have three characters."
        });
    }

    next(error)
}

app.use(errorHandler);
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)