const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var { User } = require('../models/user');

// => localhost:3000/user/
router.get('/', (req, res) => {
    User.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

        User.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving User :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.post('/', (req, res) => {
    var dir = './uploads', form = null;
    if(!fs.existsSync(dir))
        fs.mkdirSync(dir);
    var user = new User();
    form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, './uploads');

    form.parse(req, function(err, fields, files) {
        //Converting requested strigify object into JSON format
        req["body"] = JSON.parse(fields.data);

        user.first_name = req["body"].first_name;
        user.last_name = req["body"].last_name;
        user.email = req["body"].email;
        user.phone = req["body"].phone;

        //If parameter "files" contains a file
        if(fields.attachment) {
            let filename = fields.attachment.split('\\');
            user.profile_pic = filename[filename.length - 1];
        }
    });
    user.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Save :' + JSON.stringify(err, undefined, 2)); }
    });

});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        profile_pic: req.body.profile_pic
    };
    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in User Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;
