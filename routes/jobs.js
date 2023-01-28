const express = require('express');

const router = express.Router();

// jobs controllers methods
const { getJobs, newJob, getJobInRadius, updateJob, deleteJob, getJob, jobStats } = require('../controller/jobsController');

router.route('/jobs').get(getJobs);
router.route('/job/:id/:slug').get(getJob);
router.route('/jobs/:zipcode/:distance').get(getJobInRadius);
router.route('/stats/:topic').get(jobStats);

router.route('/jobs/new').post(newJob);
router.route('/jobs/:id')
    .put(updateJob)
    .delete(deleteJob);

module.exports = router;


