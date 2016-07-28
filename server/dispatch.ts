

/// <reference path="../typings/express/express.d.ts" />


import Express = require('express');

var Schema = require('schema-client');
var amazon = require('amazon-product-api');
var sails = require('sails');


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


interface CallInfo {
    fn: string,
    params: any[],
    domain?: string
}


var d = 0;


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
