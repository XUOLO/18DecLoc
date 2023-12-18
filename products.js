var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelproduct = require('../models/product')
var validate = require('../validates/product')
const {validationResult} = require('express-validator');
 



router.get('/', async function (req, res, next) {
  console.log(req.query);
  var productsAll = await modelproduct.getall(req.query);
  responseData.responseReturn(res, 200, true, productsAll);
});
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    const product = await modelproduct.getOne(objectId);
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});
router.post('/add',validate.validator(),
  async function (req, res, next) {
    var errors = validationResult(req);
    if(!errors.isEmpty()){
      responseData.responseReturn(res, 400, false, errors.array().map(error=>error.msg));
      return;
    }
  // var product = await modelproduct.getByName(req.body.name);
  // if (product) {
  //   responseData.responseReturn(res, 404, false, "product da ton tai");
  // } 
  else {
    const newproduct = await modelproduct.createproduct({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
    })
    responseData.responseReturn(res, 200, true, newproduct);
  }
});
router.put('/edit/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

 

    var product = await modelproduct.findByIdAndUpdate(objectId, req.body, { returnDocument: 'after' });
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});

router.delete('/delete/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);

    await modelproduct.delete(objectId);
     responseData.responseReturn(res, 200, true, "Xoá thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});

module.exports = router;
