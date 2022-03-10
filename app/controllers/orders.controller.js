const db = require("../models");
const _ = require('lodash');
const moment = require('moment');
const Order = db.order;
const ObjectId = require('mongodb').ObjectID;


// API to create order, update order.

exports.createUpdateOrders = (req, res) => {

  Order.find({ "order_no": req.body.order_no }).exec(function (err, orderDetails) {
    if(orderDetails.length > 0){
      Order.update({_id:ObjectId(orderDetails[0]._id)},{$set:{'order_no':req.body.order_no,'customer_id':req.body.customer_id,
      'customer_name':req.body.customer_name,
      'customer_phone':req.body.customer_phone,
      'customer_address':req.body.customer_address,
      'ordered_products':req.body.ordered_products,
      'total_amount':req.body.total_amount,'status':req.body.status
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
  })
    
}
// API to cancel order.
exports.cancelOrders = (req,res)=>{
var order_no = req.body.order_no;
var status = req.body.status;
if(!order_no){
  res.send(res.status(500).send({ message: "Order No. is missing" }))
}else if(!status){
  res.send(res.status(500).send({ message: "Status is missing" }))
}else{
  Order.update({"order_no":order_no},{$set:{'status':req.body.status}},(err, orderValue) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }else{
      res.send({ message: "Order Updated Successfully!", data: orderValue });
    }
  })
}
}
// Api to list customers based on the number of products purchased
exports.customerList = (req,res)=>{
    Order.find().exec(function (err, orderDetails) {
      if(orderDetails.length >0){
        var customerGroup = _.groupBy(orderDetails, 'customer_name');
        var customerResult = _.map(customerGroup, function (value, key) {
            var productPurchased = _.sumBy(value, function(data) { return data.ordered_products.length })
            return{
                customerName : key,
                totalProductPurchase : productPurchased
              }
        })
        res.status(200).send(customerResult);
      }else{
        res.status(500).send({message: "No Orders Found"} );
      }
        
      });
}
//  Api to list ordered product count based on date.
exports.productCount = (req,res)=>{
    var from = req.body.from
    var to = req.body.to
    if(!from){
      res.send(res.status(500).send({ message: "From Date is missing" }))
    }else if(!to){
      res.send(res.status(500).send({ message: "To Date is missing" }))
    }else{
      var fromDate = new Date(moment(from, "DD-MM-YYYY").startOf('day'));
      var toDate = new Date(moment(to, "DD-MM-YYYY").endOf('day'));
      Order.find({ "updatedAt": { $gte: fromDate, $lte: toDate } }).exec(function (err, orderDetails) {
        var productCount =[]
        orderDetails.map(valueData=>{
          valueData.ordered_products.map(dataValue=>{
            
            var productObj = {
              "product_ean" : dataValue.product_ean,
              "productName" : dataValue.product_name,
              "orderedCount"  : dataValue.recieved_qty,
              "orderedDate" : moment(valueData.updatedAt).format('DD-MM-YYYY')
            }
            productCount.push(productObj)
          })
        })
        res.status(200).send(productCount);
        });
    }
   

   
}
//  Create an api to list ordered products based on the customer. (Should include search and sort functionality)
exports.orderedProducts = (req,res)=>{
  var searchValue = req.body.searchValue
  var sortBy = req.body.sortBy
  if(searchValue && sortBy){
    Order.find({"customer_name":searchValue}).exec(function (err, productsList){
      var productArr = []
      productsList.map(value=>{
        value.ordered_products.map(data=>{
          data.customerName = value.customer_name
          data.updatedDate = value.updatedAt
          productArr.push(data)
        })
      })
       var productNameGrp = _.uniqBy(productArr,"product_name")
       var finalArr = []
        productNameGrp.map(dataVal=>{
          var finalObj = {
            "customerName" : dataVal.customerName,
            "productName":dataVal.product_name
          }
          finalArr.push(finalObj)
        })
        if(sortBy == "ASC" || sortBy == "Ascending" || sortBy == "ascending"){
          finalArr.sort(function(a, b){
            
            if(a.productName > b.productName) { return 1; }
        })
        res.status(200).send(finalArr);
        }else{
          finalArr.sort(function(a, b){
             if(a.productName < b.productName) { return -1; }
        })
        res.status(200).send(finalArr);
        }
        
    })
  }else{
    res.send(res.status(500).send({ message: "Customer or Sort Request is missing" }))
  }
  
 
}

// API to get Order Details 

exports.getOrders = (req,res)=>{
  Order.find().exec(function (err, orderDetails) {
    if(err){
      res.status(500).send({ message: err });
      return;
    }else{
      res.send({data: orderDetails});
    }
  })
}
