var express = require('express');
var router = express.Router();
var ISDNModel = require('../model/ISDN');
/* GET home page. */
router.get(`/setinfo`, async function (req, res, next) {
  try {
    const paramsQuery = Object.assign({}, req.query);

    const newISDN = {
      telco: paramsQuery.telco || 'mobi',
      keyword: paramsQuery.keyword || 0,
      user: paramsQuery.user || 'admin',
      content: paramsQuery.content || '',
      status: 1,
      updatedAt: Date.now()
    }
    const ISDN = await ISDNModel.create(newISDN);
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

    // const status = await ISDNModel.aggregate([
    //   { $match: {keyword: paramsQuery.keyword}},
    //   {$group: {status: '$status'}}
    // ]);

    const response = await ISDNModel.create(paramsQuery);

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
      { $match: {status: 0}},
      {groupBy: {keyword: '$keyword'}}
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
