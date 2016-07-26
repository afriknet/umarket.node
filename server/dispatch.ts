

/// <reference path="../typings/express/express.d.ts" />


import Express = require('express');

var Schema = require('schema-client');
var amazon = require('amazon-product-api');


var sch_client = new Schema.Client('afriknetmarket', 'WRvloJ7OlLsNCAjPFfp1wJcRwyNU5pQ2');

var aws_client = amazon.createClient({
  awsId: 'AKIAJ56TP7JGYQHLA5IA',
  awsSecret: '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',
  awsTag: 'afrikne-21',
  domain: 'webservices.amazon.fr',
});


interface CallInfo {
    fn: string,
    params: any[],
    domain?: string
}



export function process(req: Express.Request, res: Express.Response) {

    var info: CallInfo = req.body;

    var params: any[] = info.params;

    switch (info.domain.toLowerCase()) {

        case 'schema':

            params.push((err, data) => {
                process_response(err, data, res);
            });

            sch_client[info.fn].apply(sch_client, params);

            break;
        case 'aws':
        case 'amazon':

            aws_client[info.fn].apply(aws_client, params)
                .then(rslt => {
                    process_response(null, rslt, res);
                }).catch(err => {
                    process_response(err, null, res);
                });

            break;
    }

}



function process_response(err: any, data: any, res: Express.Response) {

    if (err) {

        res.status(500).send(err);

    } else {

        if (!data) {
            data = {}
        }

        res.send({
            response: data
        });
    }

}
