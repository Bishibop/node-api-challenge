const projectDb = require('../data/helpers/projectModel.js');
const actionDb = require('../data/helpers/actionModel.js');

const express = require('express');

const router = express.Router();

router.use('/:id', validateProjectId);

router.post('/', validateProject, (req, res) => {
  projectDb.insert(req.body).then(project => {
    res.status(201).json(project);
  }).catch(e => {
    res.status(500).json({
      errorMessage: "There was an error while saving the project to the database"
    });
  });
});

router.get('/', (req, res) => {
  projectDb.get().then(projects => {
    res.status(200).json(projects);
  }).catch(e => {
    res.status(500).json({
      errorMessage: "The projects information could not be retrieved."
    });
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.project);
});

router.get('/:id/actions', (req, res) => {
  res.status(200).json(req.project.actions);
});

router.post('/:id/actions', validateAction, (req, res) => {
  const newAction = {...req.body, project_id: req.params.id};
  actionDb.insert(newAction).then(action => {
    res.status(201).json(action);
  }).catch(e => {
    console.log('posting an action error: ', e);
    res.status(500).json({
      errorMessage: "There was an error while saving the action to the database"
    });
  });
});

router.put('/:id', (req, res) => {
  projectDb.update(req.project.id, req.body).then(project => {
    if (project) {
      res.status(200).json(project);
    } else {
      throw "Project with specified ID does not exist";
    }
  }).catch(e => {
    console.log('put error: ', e);
    res.status(500).json({error: "The project information could not be modified." });
  });
});

router.delete('/:id', (req, res) => {
  projectDb.remove(req.project.id).then(numRecordsDeleted => {
    if (numRecordsDeleted) {
      res.status(200).json({recordsDeleted: numRecordsDeleted});
    } else {
      throw "Project with specified ID does not exist";
    }
  }).catch(e => {
    res.status(500).json({error: "The post could not be removed" });
  });
});

function validateProject(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({
      message: "missing project data"
    });
    // Don't need to test for `completed` because it is optional
  } else if (!req.body.name || !req.body.description ) {
    res.status(400).json({
      message: "missing required data fields: name and description"
    });
  } else {
    next()
  }
}

function validateProjectId(req, res, next) {
  projectDb.get(req.params.id).then(project => {
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(400).json({
        message: 'invalid project id'
      });
    }
  });
}

function validateAction(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({
      message: "missing action data"
    });
    // Don't need to test for `completed` because it is optional
  } else if (!req.body.notes || !req.body.description ) {
    res.status(400).json({
      message: "missing required data fields: notes and description"
    });
  } else {
    next()
  }
}

module.exports = router;
