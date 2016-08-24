/**
 * Created by dreamind on 22.08.2016.
 */
'use strict';

var express = require('express'),
    app = express(),
    morgan = require('morgan'),
    route = require('./src/Router'),
    body_parser = require('body-parser');

app.use(body_parser.json() );       // to support JSON-encoded bodies
app.use(body_parser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// A static server in the folder site:
app.use(express.static('../GbFitnessStatistics'));
// A server log. engine "morgan":
app.use(morgan('combined'));
// User requests:
app.use(route.match);

var server = app.listen(3000, () => {
    console.log('Example app listening on port %s!', server .address().port);
});
