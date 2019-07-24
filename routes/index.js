var express = require('express');
var router = express.Router();
var ISDNModel = require('../model/ISDN');
/* GET home page. */
router.post(`/setinfo`, async function (req, res, next) {
  try {
    const paramsQuery = Object.assign({}, req.params);
    const ISDN = await ISDNModel.updateOne({keyword: paramsQuery.keyword},{$set: {status: 1, updatedAt: Date.now(), content: paramsQuery.content}});
    if (ISDN) {
      res.status(200).send({
        status: 1,
        result: ISDN
      })
    }
  } catch (error) {
    res.status(500).send({
      status: 0,
      result: error
    })
  }
});
router.get('/check', async (req, res, next) => {
  const paramsQuery = Object.assign({}, req.query);
  try {
    const newISDN = {
      telco: paramsQuery.telco || 'mobi',
      keyword: paramsQuery.keyword || 0,
      user: paramsQuery.user || 'admin',
      content: paramsQuery.content || '',
      status: 0
      
    }

    const response = await ISDNModel.create(newISDN);

    res.status(200).send({
      status: 1,
      result: response
    })
  } catch (error) {
    res.status(500).send({
      status: 0,
      result: error
    })
  }
});
router.get('/getdetails', async (req, res, next) => {
  const paramsQuery = Object.assign({}, req.query);
  try {
    const response = await ISDNModel.findOne({ $and: [{ keyword: paramsQuery.keyword, telco: paramsQuery.telco }] });

    res.status(200).send({
      status: 1,
      result: response
    })
  } catch (error) {
    res.status(500).send({
      status: 0,
      result: error
    })
  }
});
router.get('/getkeyword', async (req, res, next) => {
  try {
    const listKeyword = await ISDNModel.aggregate([
      { $match: {status: {$eq: 0}}},
      {$group: {_id: '$keyword'}}
    ]);
    res.status(200).send({
      status: 1,
      result: listKeyword
    })
  } catch (error) {
    res.status(500).send({
      status: 0,
      result: error
    })
  }
   
})
module.exports = router;
