/**
 * DispatcherController
 *
 * @description :: Server-side logic for managing dispatchers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var root = require('root-path');
var dispatcher = require(root('/server/dispatch'));

module.exports = {
    
    dispatch: function (req, res) {
        dispatcher.process(req, res);
    }

};

