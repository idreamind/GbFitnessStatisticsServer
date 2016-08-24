/**
 * Created by dreamind on 22.08.2016.
 */
'use strict';
var ctrl = require('./Controllers');

function Router() {
    var $ = this;

    $.match = (req, res, next) => {
        if (!req.path) next();

        let l_r = ctrl.match.length;
        for (let i = 0; i < l_r; ++i) {
            let item = ctrl.match[i];
            if (req.path === item.req_str)
                return item.ctrl(req, res);
        }
        res.redirect("/");
    };

    return $;
}

module.exports = new Router();