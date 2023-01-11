const paypal=require('paypal-rest-sdk')
require('dotenv').config()

paypal.configure({
    'made':'sandbox',
    'client_id':process.env.CLIENT_ID,
    'client_secret':process.env.CLIENT_SECRET
})

const paypalgate=(req,res)=>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5050/",
            "cancel_url": "http://localhost:5050/checkout"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "300",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total":"300"
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, async function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);

                }
          }
        }
      });
    }

module.exports={
    paypalgate
}