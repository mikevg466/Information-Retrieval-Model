const express = require('express');
const router = new express.Router();
const Page = require('../../db/models/page');
module.exports = router;

router.get('/', (req, res, next) => {
    if(req.query){
    }
    Page.findAll()
      .then(pages => res.status(200).json(pages))
      .catch(next);
});
