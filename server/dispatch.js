/// <reference path="../typings/express/express.d.ts" />
"use strict";
var Schema = require('schema-client');
var amazon = require('amazon-product-api');
var sails = require('sails');
var path = require('path');
var root = require('root-path');
var base64 = require('base64-img');
var sch_client = new Schema.Client('afriknetmarket', 'WRvloJ7OlLsNCAjPFfp1wJcRwyNU5pQ2');
var a_id = sails.config.a1.id_1
    + sails.config.a2.id_2
    + sails.config.a3.id_3;
var key = sails.config.a1.key_1
    + sails.config.a2.key_2
    + sails.config.a3.key_3;
var aws_client = amazon.createClient({
    awsId: a_id,
    awsSecret: key,
    awsTag: sails.config.backend.aws.tag,
    domain: 'webservices.amazon.fr'
});
var d = 0;
function process(req, res) {
    var info = req.body;
    var params = info.params;
    switch (info.domain.toLowerCase()) {
        case 'schema':
            params.push(function (err, data) {
                process_response(err, data, res);
            });
            sch_client[info.fn].apply(sch_client, params);
            break;
        case 'aws':
        case 'amazon':
            aws_client[info.fn].apply(aws_client, params)
                .then(function (rslt) {
                process_response(null, rslt, res);
            }).catch(function (err) {
                process_response(err, null, res);
            });
            break;
    }
}
exports.process = process;
function upload_file(req, res) {
    var options = {
        dirname: root('/assets/images'),
        saveAs: function (__newFileStream, cb) {
            cb(null, path.basename(__newFileStream.filename));
        }
    };
    req['file']('file').upload(options, function (err, files) {
        if (err) {
            console.log('error');
        }
        else {
            console.log(files);
        }
        var path = files[0].fd;
        base64.base64(path, function (err, data) {
            var product_id = req.params['product_id'];
            var params = '/products/' + product_id + '/images?file[data][$binary]=' + data;
            sch_client['post'](params, function (err, result) {
            });
            /*

            sch_client[info.fn].apply(sch_client, params);

            POST /products/<id>/images?file[data][$binary]=<base64 encoded image data>&caption=<optional caption>
            */
        });
        res.send(files[0]);
    });
}
exports.upload_file = upload_file;
function process_response(err, data, res) {
    if (err) {
        res.status(500).send(err);
    }
    else {
        if (!data) {
            data = {};
        }
        res.send({
            response: data
        });
    }
}
//# sourceMappingURL=dispatch.js.map