const express = require('express');
const router = express.Router();
const braintree = require('braintree');

// We need to load the environment variable 
const dotenv = require('dotenv')

dotenv.config()

var mID = process.env.MERCHANT_ID;
var pbKey = process.env.PUBLIC_KEY;
var pvtKey = process.env.PRIVATE_KEY;

router.post('/', (req, res, next) => {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: mID,
    publicKey: pbKey,
    privateKey: pvtKey
  });

  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  const newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;