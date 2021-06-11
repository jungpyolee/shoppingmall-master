const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");
//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/", (req, res) => {
  // 받아온 정보들을 DB에 넣어줌
  const product = new Product(req.body);

  product.save((err) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({ success: true });
  });
});

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장을 해주면 된다
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/products", (req, res) => {
  // product collection에있는 모든 상품정보 가져오기

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  // console.log("req.body.filters", req.body.filters);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      // console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  } else {
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  }
  // id = 123, 456, 789 type= array
  router.get("/products_by_id", (req, res) => {
    let type = req.query.type;
    let productIds = req.query.id;

    if (type === "array") {
      //id = 123, 456, 789 를
      //productIds = ['123', '456','789']로 바꾸기
      let ids = req.query.id.split(",");
      productIds = ids.map((item) => {
        return item;
      });
    }
    //productId를 이용해서 DB에서 productIds와 같은 상품의 정보를 가져온다.

    Product.find({ _id: { $in: productIds } })
      .populate("writer")
      .exec((err, product) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(product);
      });
  });
});

module.exports = router;
