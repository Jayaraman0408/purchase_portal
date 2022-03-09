const db = require("../models");
const _ = require('lodash');
const moment = require('moment');
const Product = db.product

const ObjectId = require('mongodb').ObjectID;
var XLSX = require("xlsx");
var multer      = require('multer');

var postStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        let fileName = '', postName;
        if(typeof req.body.postName !== "undefined") {
            postName = req.body.postName.toLowerCase().replace(/ /g, '-');
            filename += postName;
        }
        fileName += new Date().getTime();
        fileName += ".xlsx";
        callback(null, fileName);
    }
});


exports.uploadProduct = (req,res)=>{
    
    var uploadPost = multer({storage: postStorage}).single('uploaded_file');
uploadPost(req, res, function(err) {
   
    if(err) {
        return res.end("error uploading file");
    }
    console.log(req.file)
    var workBook = XLSX.readFile(req.file.path);
    var sheet_name_list = workBook.SheetNames;
    var jsonObject = XLSX.utils.sheet_to_json(workBook.Sheets[sheet_name_list[0]]);
    console.log(jsonObject)

    jsonObject.map(value=>{

        Product.find({"product_ean":value.product_ean}).exec(function (err, productDetails) {
             if(productDetails){
                Product.update({_id:ObjectId(productDetails._id)},{$set:{'product_ean':jsonObject.product_ean,'product_name':jsonObject.product_name,
      'qty':jsonObject.qty,
      'cost_perunit':jsonObject.cost_perunit,
      'selling_price':jsonObject.selling_price,
      'mrp':jsonObject.mrp,
      'total_cost':jsonObject.total_cost,'status':jsonObject.status
    }},(err, productValue) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "Product Updated Successfully!", data: productValue });
      })
            }else{
                const products = new Product({
                    product_ean: value.product_ean,
                    product_name: value.product_name,
                    qty: value.qty,
                    cost_perunit: value.cost_perunit,
                    selling_price: value.selling_price,
                    mrp : value.mrp,
                    total_cost: value.total_cost
                  });
                  products.save((err, productData) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                      }
                      res.send({ message: "Product Created Successfully!", data: productData });
                })
            }
        })
        
    })

    
    // Products.find().exec(function (err, productDetails) {

    // })
    // res.end("file uploaded");
});
}