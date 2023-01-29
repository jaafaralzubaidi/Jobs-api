const Job = require("../models/jobs");
const geoCoder = require("../utils/geocoder");
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFilters = require("../utils/apiFilters");
// Get all jobs => /api/v1/jobs
exports.getJobs = catchAsyncErrors(async (req, res, next) => {

    const apiFilters = new APIFilters(Job.find(), req.query).filter();

    const jobs = await apiFilters.query;

    res.status(200).json({
        success: true,
        result: jobs.length,
        data: jobs
    })
});



// Create a new job => api/v1/job/new
exports.newJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.create(req.body);
    // console.log(req.body)
    res.status(200).json({
        success: true,
        message: "Job created",
        data: job
    })
});


// Not working correctly
// Search job within radius => /api/v1/jobs/:zip/:distance
exports.getJobInRadius = catchAsyncErrors(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    // Getting latitude & longitude from geocoder with zipcode
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963; //earth radius

    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
});



// Update a job => api/v1/job/:id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job) {
        // return res.status(404).json({
        //     success: false,
        //     message: "Job not found!"
        // });
        return next(new ErrorHandler('Job not found.', 404))
    }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Job is updated",
        data: job
    }
    )
});

// Get single job with id and slug => api/v1/job/:id/:slug
exports.getJob = catchAsyncErrors(async (req, res, next) => {

    const job = await Job.find({ $and: [{ _id: req.params.id }, { slug: req.params.slug }] });
    if (!job || job.length === 0)
        return next(new ErrorHandler('Job not found.', 404))

    res.status(200).json({
        success: true,
        data: job
    })

});


// Delete a job api/v1/job/:id
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    let job = await Job.findById(req.params.id);
    if (!job)
        return next(new ErrorHandler('Job not found.', 404))

    job = await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Job is deleted",
    }
    )
});




// Get stats about a topic(job) => api/v1/stats/:topic
exports.jobStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await Job.aggregate([
        {
            $match: { $text: { $search: "\"" + req.params.topic + "\"" } }
        },
        {
            $group: {
                _id: { $toUpper: '$experience' },
                totalJobs: { $sum: 1 },
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' }

            }
        }
    ]);

    if (stats.length === 0)
        return next(new ErrorHandler(`No stats found for - ${req.params.topic}`, 200))

    res.status(200).json({
        success: true,
        data: stats
    })

}); 
