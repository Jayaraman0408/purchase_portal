# purchase_portal

Api list and their json request (From given task):

1. Register API          : http://localhost:8080/api/auth/signup (POST method)
   register-json request : 
                            {
                            "username":"jayaraman",
                            "email":"jyram123@gmail.com",
                            "password":"jayaram007",
                            "phone": 8939797216,
                            "address": "Plot no.24, Moogambigai Nagar, Arasankalani, Sithalapakkam, Chennai-600126"
                            }
    
2. Sign in API           : http://localhost:8080/api/auth/signin (POST method)
   signIn-json request   :
                            {
                            "username":"jayaraman",
                            "password":"jayaram007"
                            }

3. Create/Update Order API : http://localhost:8080/api/createUpdateOrders (POST method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

Create/Update-json request : {
"_id": "622793ae81f6d6245c80d109",
"order_no" : "006",
"customer_id" : "6226d773527f17364afcf474",
"customer_name" : "jayaraman",
"customer_phone" : 8939797216,
"customer_address" : "Plot no.24, Moogambigai Nagar, Arasankalani, Sithalapakkam, Chennai-600126",
"ordered_products": [{
     "product_ean" : "801248973456701",
     "product_name":   "lays chips",
     "recieved_qty": 40,
     "cost_perunit":    7,
     "selling_price": 10,
     "mrp"         :   10,
     "total_cost"  :   280
   },
   {
     "product_ean" : "801248973459874",
     "product_name":   "kurkure chips",
     "recieved_qty": 40,
     "cost_perunit":    7,
     "selling_price": 10,
     "mrp"         :   10,
     "total_cost"  :   280
   }
   ],
"total_amount": 560,
"status":      "CANCELLED",
"created_by": "jayaraman"
}

4. Cancel Order API : http://localhost:8080/api/cancelOrders (POST method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API
Create/Update-json request : 
                                {
                                   "order_no" : "002",
                                   "status"   : "CANCELLED"
                                }

5. Customer list based on number of products purchase  API : http://localhost:8080/api/orderedProducts (POST method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

  json request : {
      "searchValue" : "jayaraman", 
      "sortBy": "Ascending"
  }
    searchValue is based on customerName.
6. ordered product count based on date API : http://localhost:8080/api/productCount (POST method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

json request : {
      "from": "01-03-2022",
        "to":   "10-03-2022"
  }

7. customers based on the number of products purchased API : http://localhost:8080/api/customerList (GET method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

no json- request needed

8. Upload product information and update product infomaion via upload API : http://localhost:8080/api/uploadProduct (POST method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

    Instead of json request need to add excel file from Postman for testing purpose :

        1. please select Body --> form-data
        2. In the key column type uploaded_file and then click select file and upload a csv file


ADDITIONAL GET API for data viewing purpose

1. API to get User Details - http://localhost:8080/api/getUsers (GET method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

2. API to get Order Details - http://localhost:8080/api/getOrders (GET method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API

3. API to get Product Details - http://localhost:8080/api/getProducts (GET method)- Please pass the   values in headers: key : x-access-token, value : access token value which you will get while hitting the signin API



