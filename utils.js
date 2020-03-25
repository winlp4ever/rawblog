const path = require('path');
const fs = require('fs');
const _cliProgress = require('cli-progress');
const request = require('request');
var AWS = require('aws-sdk');
AWS.config.loadFromPath(path.join(__dirname, 'aws-credentials', 'accessKeys.json'));


var uploadToS3 = function(jsonObject, fn) {
    s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var uploadParams = {
        Bucket: 'course-recording-q1-2020-taii', 
        Key: `qas/` + fn, 
        Body: JSON.stringify(jsonObject),
        ContentType: 'application/json; charset=utf-8'
    };

    s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}


module.exports = {
    uploadToS3: uploadToS3
}