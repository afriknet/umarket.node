/// <reference path="../typings/express/express.d.ts" />
"use strict";
var Schema = require('schema-client');
var amazon = require('amazon-product-api');
var sch_client = new Schema.Client('afriknetmarket', 'WRvloJ7OlLsNCAjPFfp1wJcRwyNU5pQ2');
var aws_client = amazon.createClient({
    awsId: 'AKIAJ56TP7JGYQHLA5IA',
    awsSecret: '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',
    awsTag: 'afrikne-21',
    domain: 'webservices.amazon.fr',
});
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