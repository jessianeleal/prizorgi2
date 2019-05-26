const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const { writeFileSync } = require('fs');
const { Parser } = require('json2csv');
const bodyParser = require('body-parser')


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AaU8tQfmz1_MFDTKuf84yYERXvdDt2ZFJVrxhNW_49DazF4A_F0VBuKyV5_nntyEdZqUa5Oq9ZBj65GV',
  'client_secret': 'EAZ8aFDU4lHHLy1bQqULYWqznf3dBknXZW3AH__zFC0bUs8AGUyR6RNbm-jHvqtikX7PsSqMO5vxuvKm'
});

const app = express();

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views')

app.get('/', (req, res) => res.render('index'));
app.get('/page-doar-furacoes', (req, res) => res.render('page-doar-furacoes'));
app.get('/page-doar-enchentes', (req, res) => res.render('page-doar-enchentes'));
app.get('/page-doar-fome', (req, res) => res.render('page-doar-fome'));
app.get('/page-doar-leitos', (req, res) => res.render('page-doar-leitos'));
app.get('/page-doar-brumadinho', (req, res) => res.render('page-doar-brumadinho'));
app.get('/cadastro-campanha', (req, res) => res.render('cadastro-campanha'));
app.get('/progresso-brumadinho', (req, res) => res.render('progresso-brumadinho'));


app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Doar para Brumadinho",
                "sku": "001",
                "price": "10.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "10.00"
        },
        "description": "Hat for the best team ever"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "10.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        paymentJSON = JSON.stringify(payment);
        res.render('progresso-brumadinho');
    }
});
});

app.get('/cancel', (req, res) => res.send('Cancelled'));



app.listen(3000, () => console.log('Server Started'));