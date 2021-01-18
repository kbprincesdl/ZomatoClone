const express = require("express");

const https = require("https");
const qs = require("querystring");

const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");
//const order=require('./models/OrdersModel');
const app = express();

// app.use(express.urlencoded());

app.use(express.json());
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });


const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/paynow", [parseUrl, parseJson], (req, res) => {
  // Route for making payment
  // console.log(req);
  // console.log(qs.parse);
  //const queryParams = queryString.parse
  // const queryParams = req.params;
  // const amount=req.body.amount;
  // const customerId=req.body.name;
  // const customerEmail=req.body.email;
  // const customerPhone=req.body.phone;

  var paymentDetails = {

    amount: String(req.body.amount),
    customerId: String(req.body.name),
    customerEmail: String(req.body.email),
    customerPhone: String(req.body.phone)
   
    // amount: amount,
    // customerId:customerId,
    // customerEmail:customerEmail,
    // customerPhone: customerPhone
          // amount: "100",
          // customerId: "cust101",
          // customerEmail: "kbprincesdl@gmail.com",
          // customerPhone: "8147406788"
}
if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
    res.status(400).send('Payment failed here')
} else {
    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
    params['CUST_ID'] = paymentDetails.customerId;
    params['TXN_AMOUNT'] = paymentDetails.amount;
    params['CALLBACK_URL'] = 'http://localhost:4000/callback';
    params['EMAIL'] = paymentDetails.customerEmail;
    params['MOBILE_NO'] = paymentDetails.customerPhone;


    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
            form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
        res.end();
    });
}
});
app.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = '';

  req.on('data', function (data) {
     body += data;
  });

   req.on('end', function () {
     var html = "";
     var post_data = qs.parse(body);

     // received params in callback
     console.log('Callback Response: ', post_data, "\n");


     // verify the checksum
     var checksumhash = post_data.CHECKSUMHASH;
     // delete post_data.CHECKSUMHASH;
     var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
     console.log("Checksum Result => ", result, "\n");


     // Send Server-to-Server request to verify Order Status
     var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};

     checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

       params.CHECKSUMHASH = checksum;
       post_data = 'JsonData='+JSON.stringify(params);

       var options = {
         hostname: 'securegw-stage.paytm.in', // for staging
         // hostname: 'securegw.paytm.in', // for production
         port: 443,
         path: '/merchant-status/getTxnStatus',
         method: 'POST',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
         }
       };


       // Set up the request
       var response = "";
       var post_req = https.request(options, function(post_res) {
         post_res.on('data', function (chunk) {
           response += chunk;
         });

         post_res.on('end', function(){
           console.log('S2S Response: ', response, "\n");

           var _result = JSON.parse(response);
             if(_result.STATUS == 'TXN_SUCCESS') {
                // res.send('payment sucess')
                insertOrders(_result);
                 res.sendFile(__dirname + '/response.html');
               // res.sendFile(__dirname + `/response.html?${response}`);
               // res.sendFile(__dirname + `/response.html`+response);  
             }else {
                 //res.send('payment failed')
                 res.sendFile(__dirname + '/failure.html');
             }
           });
       });

       // post the data
       post_req.write(post_data);
       post_req.end();
      });
     });
});

// insertOrders=async(_result,res)=>{
//   console.log(_result.STATUS);
//   console.log(_result.RESPMSG);
//     // const curency = _result.CURRENCY;
//     // const msg = _result.RESPMSG;
    
//     // const UserOrders = new orders({ STATUS: curency, RESPMSG: msg});
//     // UserOrders.save();

  

//     try {
//       const newUser = new order({
//         'STATUS': _result.STATUS,
//         'RESPMSG': _result.RESPMSG
//       });

//       module.exports.create = async (newUser) => {
//         if (!newUser)
//             throw new Error('Missing product');
    
//         await order.create(newUser);
//     }
//       console.log('before save');
//       // let saveUser = await newUser.save(); //when fail its goes to catch
//       // console.log(saveUser); //when success it print.
//       console.log('after save');
//     } catch (err) {
//       console.log('err' + err);
//      // res.status(500).send(err);
//     }


// }



insertOrders=(_result)=>{

const mongoose = require('mongoose'); 

// Database Connection 
mongoose.connect('mongodb://localhost:27017/restaurant_db',{ 
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology: true
}); 

// User model 
const Orders = mongoose.model('order',{ 
  TXNID: { type: String }, 
  BANKTXNID: { type: String }, 
  ORDERID: { type: String }, 
  TXNAMOUNT: { type: String }, 
  STATUS: { type: String }, 
  TXNTYPE: { type: String }, 
  GATEWAYNAME: { type: String }, 
  RESPCODE: { type: String }, 
  RESPMSG: { type: String },
  BANKNAME: { type: String }, 
  MID: { type: String }, 
  PAYMENTMODE: { type: String }, 
  REFUNDAMT: { type: String }, 
  TXNDATE: { type: String }
	
}); 

var new_user = new Orders({ 
  TXNID: _result.TXNID, 
  BANKTXNID: _result.BANKTXNID, 
  ORDERID: _result.ORDERID, 
  TXNAMOUNT:_result.TXNAMOUNT, 
  STATUS: _result.STATUS, 
  TXNTYPE: _result.TXNTYPE, 
  GATEWAYNAME:_result.GATEWAYNAME, 
  RESPCODE: _result.RESPCODE, 
  RESPMSG:_result.RESPMSG,
  BANKNAME:_result.BANKNAME, 
  MID: _result.MID, 
  PAYMENTMODE:_result.PAYMENTMODE, 
  REFUNDAMT: _result.REFUNDAMT, 
  TXNDATE: _result.TXNDATE
}) 

new_user.save(function(err,result){ 
	if (err){ 
		console.log(err); 
	} 
	else{ 
		console.log(result) 
	} 
}) 



  
}

// app.get("/getorders", (req, res) => {
  
// const mongoose1 = require('mongoose'); 

// // Database Connection 
// mongoose1.connect('mongodb://localhost:27017/restaurant_db',{ 
// 	useNewUrlParser: true, 
// 	useCreateIndex: true, 
// 	useUnifiedTopology: true
// }); 


//   const Orders1 = mongoose1.model('order',{ 
//     TXNID: { type: String }, 
//     BANKTXNID: { type: String }, 
//     ORDERID: { type: String }, 
//     TXNAMOUNT: { type: String }, 
//     STATUS: { type: String }, 
//     TXNTYPE: { type: String }, 
//     GATEWAYNAME: { type: String }, 
//     RESPCODE: { type: String }, 
//     RESPMSG: { type: String },
//     BANKNAME: { type: String }, 
//     MID: { type: String }, 
//     PAYMENTMODE: { type: String }, 
//     REFUNDAMT: { type: String }, 
//     TXNDATE: { type: String }
    
//   }); 
  
//   Orders1.find()
//   .then(response =>res.status(200).json({ message : 'Orders fetch successsfully ' ,ordersresult :response}))
//   .catch(err => res.status(500).json( {message : err}))
// });

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});
