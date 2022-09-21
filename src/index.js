const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

app.get('/', (req, res) => {
  return res.json({ message: 'Tudo ok' });
});

app.post('/account', (req, res) => {
  const { cpf, name } = req.body;
  const customersAlreadyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if (customersAlreadyExists) {
    return res.status(400).send({ error: 'Existing CPF' });
  }

  customers.push({ cpf, name, _id: uuidv4(), statement: [] });

  return res.status(201).send({ message: 'Created' });
});

app.get('/statement/:cpf', (req, res) => {
  const { cpf } = req.params;
  const searchAccount = customers.find((customers) => customers.cpf === cpf);
  if (!searchAccount) {
    return res.status(400).send({ error: 'Account not found' });
  }
  return res.json(searchAccount.statement);
});

app.listen(3333);
