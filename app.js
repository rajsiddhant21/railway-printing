const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const https = require('https');
const PaytmChecksum = require('./Paytmchecksum');
const Razorpay = require('razorpay');
const { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
let orderCheck = {};
let storedChecksum = "";
const app = express();
app.use(express.json());

async function connectMongo() {
    try {
        await mongoose.connect(`mongodb+srv://sid1707raj:aOXOz4F4vGCBik77@cluster0.gkezdde.mongodb.net/usersinfo?retryWrites=true&w=majority`)
    } catch (error) {
        console.log(error)
    }
}

connectMongo();

app.use('/', require('./src/routes/index'));

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.get('/order', async (req, res) => {
//     let amt = req.query.amount;

//     let key_id = 'rzp_test_jnd3OilwbYz87W';
//     let key_secret = 'Z5t9cD6urSXgRQ1aku2pQyPr';
//     let receipt = 'TS1989REC';

//     let instance = new Razorpay({
//         key_id,
//         key_secret
//     })
//     // creation of an order
//     let options = {
//         amount: amt,
//         currency: 'INR',
//         receipt: receipt
//     }
//     /* instance.orders.create(options, function (err, order) {
//          console.log(err)
//          res.send(order);
//      })*/

//     const order = await instance.orders.create(options);
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     orderCheck = order;
//     res.send(order);
// })

// app.post('/upilink', async (req, res) => {
//     let key_id = 'rzp_test_jnd3OilwbYz87W';
//     let key_secret = 'Z5t9cD6urSXgRQ1aku2pQyPr';
//     let receipt = 'TS1989REC';
//     // const amount = req.query.amount;
//     // let instance = new Razorpay({
//     //     key_id,
//     //     key_secret
//     // })
//     // let options = {
//     //     amount: amount,
//     //     currency: 'INR',
//     //     receipt: receipt
//     // }
//     // const order = await instance.orders.create(options);
//     // console.log(order)

//     // console.log(amount)

//     // console.log(instance.paymentLink.create)
//     // instance.paymentLink.create({
//     //     amount,
//     //     upi_link: true,
//     //     customer: {
//     //         name: "Siddhant Raj",
//     //         email: "Siddhant.Raj@example.com",
//     //         contact: "+919434564159"
//     //     },
//     //     notify: {
//     //         sms: true
//     //     }
//     // })

//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.send(btoa(`${key_id}:${key_secret}`))
// })

// app.post('/verify', (req, res) => {
//     let key_secret = 'Z5t9cD6urSXgRQ1aku2pQyPr';
//     const razorpaymentid = req.query.razorpaymentid
//     console.log(orderCheck) // server
//     console.log(key_secret)
//     let orderid = 'order_NRFBhSXbgYbCuN';
//     let paymentid = 'pay_NRFD8f50yCrvcZ';
//     /* const result = validatePaymentVerification({
//          "order_id": "order_NRFBhSXbgYbCuN", // server
//          "razorpay_payment_id": "pay_NRFD8f50yCrvcZ" // on the fly
//      }, 'SHA256', key_secret);*/
//     //console.log(result)
//     let generatedSignature = crypto.createHmac("SHA256", key_secret).update(orderid + "|" + paymentid).digest('hex')
//     console.log(generatedSignature)
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.send('verify')
// })

// app.get('/onlyapi', (req, res) => {
//     var paytmParams = {};
//     let amt = req.query.amount
//     let mid = 'ZusSGY70735055292374';
//     let website = 'WEBSTAGING';
//     let mkey = 'RWptVqcLQmH@PB9b';
//     let noww = Date.now();
//     paytmParams.body = {
//         'requestType': 'Payment',
//         'mid': mid,
//         'websiteName': website,
//         "channel_id": 'WEB',
//         'orderId': 'ORDERID_TS1989-' + noww,
//         'txnAmount': {
//             'value': amt,
//             'currency': 'INR'
//         },
//         'userInfo': {
//             'custId': 'TS_1989'
//         },
//         'callbackUrl': 'http://localhost:9000/onlyapicb?orderid=ORDERID_TS1989-' + noww + '&amount=' + amt,
//     }

//     PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), mkey).then((checksum) => {
//         storedChecksum = checksum;
//         paytmParams.head = {
//             "signature": checksum
//         };
//         let post_data = JSON.stringify(paytmParams);
//         let options = {
//             hostname: 'securegw-stage.paytm.in',
//             port: 443,
//             path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=ORDERID_TS1989-${noww}`,
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Content-Length': post_data.length
//             }
//         }
//         console.log(JSON.stringify(paytmParams))
//         fetch(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${mid}&orderId=ORDERID_TS1989-${noww}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Content-Length': post_data.length,
//                 head: {
//                     "signature": checksum
//                 }
//             },
//             body: JSON.stringify(paytmParams)
//         }).then((Res) => {
//             Res.json().then((data) => {
//                 res.setHeader("Access-Control-Allow-Origin", "*");
//                 res.setHeader('content-type', 'application/json');
//                 console.log(data);
//                 data.paytmparams = paytmParams.body;
//                 res.send(data)
//             })

//         }).catch((err) => {
//             console.log(err)
//             res.send(err.message)
//         })

//     })
// })

// app.post('/onlyapicb', (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     console.log(req.query)
//     console.log(req.body)
//     var paytmParams = {};
//     let amt = req.query.amount
//     let mid = 'ZusSGY70735055292374';
//     let website = 'WEBSTAGING';
//     let mkey = 'RWptVqcLQmH@PB9b';
//     let noww = Date.now();
//     const body = {
//         'mid': mid,
//         'orderId': req.query.orderid,
//     }
//     PaytmChecksum.generateSignature(JSON.stringify(body), mkey).then((checksum) => {
//         const head = {
//             signature: checksum
//         }
//         fetch(`https://securegw-stage.paytm.in/v3/order/status`, {
//             method: 'POST',
//             body: JSON.stringify({
//                 body,
//                 head
//             })
//         })
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 console.log(data)
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     })

//     res.send('response got')
// })



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});