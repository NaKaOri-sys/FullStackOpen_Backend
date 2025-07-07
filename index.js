const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World<h1/>')
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (!person) {
        res.status(404).end();
        return;
    }
    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!persons.find(p => p.id === id)) {
        res.status(404).end();
        return;
    }
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    let errorResponse = validateCreatePerson(person)
    if (errorResponse) {
        res.status(400).json({
            error: errorResponse
        });
        return;
    }
    persons = persons.concat(person);
    res.json(person);
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
    if (persons.find(p => p.name === body.name)) {
        return 'name must be unique';
    }
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