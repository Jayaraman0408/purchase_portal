const db = require("../models");
const _ = require('lodash');
const moment = require('moment');
const Order = db.order;
const ObjectId = require('mongodb').ObjectID;


exports.createOrders = (req, res) => {
    const order = new Order({
        order_no: req.body.order_no,
        customer_id: req.body.customer_id,
        customer_name: req.body.customer_name,
        customer_phone: req.body.customer_phone,
        customer_address: req.body.customer_address,
        ordered_products : req.body.ordered_products,
        total_amount: req.body.total_amount,
        status: req.body.status
      });
      order.save((err, orderData) => {
          if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Order Created Successfully!", data: orderData });
      })
}
exports.updateOrders = (req, res) => {
    if(req.body._id){
        let orderId = req.body._id
        const order = new Order({
            order_no: req.body.order_no,
            customer_id: req.body.customer_id,
            customer_name: req.body.customer_name,
            customer_phone: req.body.customer_phone,
            customer_address: req.body.customer_address,
            ordered_products : req.body.ordered_products,
            total_amount: req.body.total_amount,
            status: req.body.status
      });
      Order.update({_id:ObjectId(orderId)},{$set:{'order_no':order.order_no,'customer_id':order.customer_id,
      'customer_name':order.customer_name,
      'customer_phone':order.customer_phone,
      'customer_address':order.customer_address,
      'ordered_products':order.ordered_products,
      'total_amount':order.total_amount,'status':order.status
    }},(err, orderValue) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Order Updated Successfully!", data: orderValue });
      })
    }else{
        const order = new Order({
            order_no: req.body.order_no,
            customer_id: req.body.customer_id,
            customer_name: req.body.customer_name,
            customer_phone: req.body.customer_phone,
            customer_address: req.body.customer_address,
            ordered_products : req.body.ordered_products,
            total_amount: req.body.total_amount,
            status: req.body.status
          });
          order.save((err, orderData) => {
              if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                res.send({ message: "Order Created Successfully!", data: orderData });
          })
    }
}
exports.customerList = (req,res)=>{

    Order.find().exec(function (err, orderDetails) {
        var customerGroup = _.groupBy(orderDetails, 'customer_name');
        var customerResult = _.map(customerGroup, function (value, key) {
            var productPurchased = _.sumBy(value, function(data) { return data.ordered_products.length })
            return{
                customerName : key,
                totalProductPurchase : productPurchased
              }
        })
        res.status(200).send(customerResult);
      });
}
exports.productCount = (req,res)=>{

    var date = "08-03-2022"

    var fromDate = new Date(moment(date, "DD-MM-YYYY").startOf('day'));
    var toDate = new Date(moment(date, "DD-MM-YYYY").endOf('day'));

    console.log(fromDate)
    console.log(toDate)

    Order.find({ "updatedAt": { $gte: fromDate, $lte: toDate } }).exec(function (err, orderDetails) {
    //    console.log(orderDetails)
       var productCountGroup = _.groupBy(orderDetails, 'updatedAt');
         console.log(productCountGroup);

      });
}

