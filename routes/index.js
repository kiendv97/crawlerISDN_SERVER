var express = require('express');
var router = express.Router();
var ISDNModel = require('../model/ISDN');
const sendDing  = require('../utils/Send_ding');
const convert_content = require('../utils/Convert_content');
/* GET home page. */

router.post(`/setinfo`, async function (req, res, next) {
  try {
    const paramsQuery = Object.assign({}, req.body);
    console.log(paramsQuery.keyword);

    const ISDN = await ISDNModel.findOneAndUpdate({ keyword: paramsQuery.keyword }, { $set: { status: 1, reponsedAt: Date.now(), content: paramsQuery.content } });
    if (ISDN !== null) {
      console.log(ISDN);
     const  finalContent = await  convert_content(ISDN.content)
       await sendDing(finalContent);
      res.status(200).send({
        status: 1,
        result: ISDN.content
      })
    } else {
      res.status(200).send({
        status: 0,
        result: 'not existed'
      })
    }
  } catch (error) {
    console.log(error);
    
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
      status: 0, //pending

    }

    const response = await ISDNModel.findOne({ keyword: newISDN.keyword });
    const checkRequest5Minutes = response? new Date(Date.now() - response.updatedAt).getMinutes(): 0;
    console.log(response);
    if (response === null) {
      const result = await ISDNModel.create(newISDN);
      console.log('create');

      res.status(200).send({
        status: 1,
        result: 'create'
      })

    } else if (checkRequest5Minutes > 5) {
      await ISDNModel.updateOne({ keyword: newISDN.keyword }, { $set: { status: 0, updatedAt: Date.now() } });
      console.log('update');
      res.status(200).send({
        status: 1,
        result: 'update'
      })
    } else {
      res.status(203).send({
        status: 0,
        result: 'request must be greater 5 minute'
      })
    }






  } catch (error) {
    console.log(error);
    
    res.status(500).send({
      status: 0,
      result: error
    })
  }
});
router.get('/getdetails', async (req, res, next) => {
  const paramsQuery = Object.assign({}, req.query, { status: 1 });
  console.log(paramsQuery);

  try {
    const response = await ISDNModel.findOne({ $and: [paramsQuery] }, null, { sort: { updatedAt: -1 } });
    if (response) {
      res.status(200).send({
        status: 1,
        result: response
      })
    } else {
      res.status(203).send({
        status: 0,
        result: ''
      })
    }

  } catch (error) {
    res.status(500).send({
      status: 0,
      result: error
    })
  }
});
router.get('/getkeyword', async (req, res, next) => {
  try {
    // test //
    //  const oldDate = 1564106730500;
    // const newDate = Date.now();
    // // console.log(Date.now());
    // console.log(new Date(1564106730500));

    // console.log(new Date());
    // console.log(new Date(newDate - oldDate).getMinutes());

    const listKeyword = await ISDNModel.aggregate([
      { $match: { status: { $eq: 0 } } },
      { $group: { _id: '$keyword' } }, 
      {$limit: 1}
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
