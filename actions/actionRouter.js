const actionDb = require('../data/helpers/actionModel.js');

const express = require('express');

const router = express.Router();

router.use('/:id', validateActionId);

router.get('/', (req, res) => {
  actionDb.get().then(actions => {
    res.status(200).json(actions);
  }).catch(e => {
    res.status(500).json({
      errorMessage: "The actions information could not be retrieved."
    });
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.action);
});

router.put('/:id', (req, res) => {
  actionDb.update(req.action.id, req.body).then(action => {
    if (action) {
      res.status(200).json(action);
    } else {
      throw "Action with specified ID does not exist";
    }
  }).catch(e => {
    console.log('put error: ', e);
    res.status(500).json({error: "The action information could not be modified." });
  });
});

router.delete('/:id', (req, res) => {
  actionDb.remove(req.action.id).then(numRecordsDeleted => {
    if (numRecordsDeleted) {
      res.status(200).json({recordsDeleted: numRecordsDeleted});
    } else {
      throw "Action with specified ID does not exist";
    }
  }).catch(e => {
    res.status(500).json({error: "The action could not be removed" });
  });
});

function validateActionId(req, res, next) {
  actionDb.get(req.params.id).then(action => {
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(400).json({
        message: 'invalid action id'
      });
    }
  });
}

module.exports = router;
