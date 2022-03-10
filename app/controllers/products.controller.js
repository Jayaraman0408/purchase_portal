const db = require("../models");
const _ = require('lodash');
const moment = require('moment');
const Product = db.product

const ObjectId = require('mongodb').ObjectID;
var XLSX = require("xlsx");
var multer = require('multer');

var postStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        let fileName = '', postName;
        if (typeof req.body.postName !== "undefined") {
            postName = req.body.postName.toLowerCase().replace(/ /g, '-');
            filename += postName;
        }
        fileName += new Date().getTime();
        fileName += ".xlsx";
        callback(null, fileName);
    }
});

// API to upload the product information into the database. All products should be created via upload only

exports.uploadProduct = (req, res) => {

    var uploadPost = multer({ storage: postStorage }).single('uploaded_file');
    uploadPost(req, res, function (err) {
        if (err) {
            return res.end("error uploading file");
        }
        var workBook = XLSX.readFile(req.file.path);
        var sheet_name_list = workBook.SheetNames;
        var jsonObject = XLSX.utils.sheet_to_json(workBook.Sheets[sheet_name_list[0]]);

        const getData = async () => {
            return Promise.all(
                jsonObject.map(async (value) => {
                    var productCheck = await Product.find({ "product_ean": value.product_ean})
                    if(productCheck.length > 0){
                        productCheck.map(async dataValue => {
                            if (dataValue.product_ean == value.product_ean) {
                                var productUpdate = await Product.updateMany({ "product_ean": value.product_ean }, {
                                    $set: {
                                        'product_name': value.product_name,
                                        'qty': value.qty,
                                        'cost_perunit': value.cost_perunit,
                                        'selling_price': value.selling_price,
                                        'mrp': value.mrp,
                                        'total_cost': value.total_cost, 'status': value.status
                                    }
                                }, { multi: true })
                            }else{
                                const products = new Product({
                                    product_ean: value.product_ean,
                                    product_name: value.product_name,
                                    qty: value.qty,
                                    cost_perunit: value.cost_perunit,
                                    selling_price: value.selling_price,
                                    mrp: value.mrp,
                                    total_cost: value.total_cost
                                });
                                var productCreate = await products.save()
                            }
                        })
                    }else{
                        const products = new Product({
                            product_ean: value.product_ean,
                            product_name: value.product_name,
                            qty: value.qty,
                            cost_perunit: value.cost_perunit,
                            selling_price: value.selling_price,
                            mrp: value.mrp,
                            total_cost: value.total_cost
                        });
                        var productCreate = await products.save()
                    }
                })


            )
        }

        getData().then(async () => {
            res.status(200).send("Product Created/Updated Successfully")
        })
    });
}

// API to get Product Details 

exports.getProducts = (req, res) => {
    Product.find().exec(function (err, productDetails) {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } else {
            res.send({ data: productDetails });
        }
    })
}