const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

function verifyExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;
  const searchAccount = customers.find((customers) => customers.cpf === cpf);
  if (!searchAccount) {
    return res.status(400).send({ error: 'Account not found' });
  }

  req.searchAccount = searchAccount;
  return next();
}

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

app.get('/statement', verifyExistsAccountCPF, (req, res) => {
  const { searchAccount } = req;
  return res.json(searchAccount.statement);
});

app.post('/deposit', verifyExistsAccountCPF, (req, res) => {
  const { searchAccount } = req;
  const { description, amount } = req.body;
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'Credit',
  };
  searchAccount.statement = statementOperation; 
  return res.status(201).send({ message: 'Deposit ok' });
});

app.listen(3333);
