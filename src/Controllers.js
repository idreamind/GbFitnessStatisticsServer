/**
 * Created by dreamind on 22.08.2016.
 */
'use strict';
const KEY = '1234567890987654321';

var mysql = require('mysql'),
    pool  = mysql.createPool({
        connectionLimit : 10,
        host            : 'localhost',
        user            : 'root',
        password        : '',
        database        : 'bot_db'
    });

function Address(req_str, ctrl) {
    this.req_str = req_str;
    this.ctrl = ctrl;
}

function Controllers() {
    var $ = this;

    $.match = [
        new Address('/sign_in', controllerSignIn),
        new Address('/load_data', controllerLoadData)
    ];

    //------------------------------------------------------------------------------------------------------------------
    function controllerSignIn(req, res) {
        let user = req.body.user,
            pass = req.body.pass;

        if (user === 'admin' && pass === '12918') {
            res.send({
                success: true,
                key: KEY
            });
        } else {
            res.send({
                success: false,
                key: undefined
            });
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    function controllerLoadData(req, res) {
        console.log(req.body.key);
        if (req.body.key === KEY) {
            pool.getConnection(function(err, connection) {
                connection.query( 'SELECT * FROM bot_users', function(err, rows) {
                    connection.release();
                    var obj = [];
                    rows.forEach((row) => {
                        obj.push({
                            user_id: row.user_id,
                            name: row.first_name + ((row.last_name) ? ' ' + row.last_name : ''),
                            time: (row.time) ? row.time.toString() : undefined
                        });
                    });
                    res.send({
                        success: true,
                        data: obj
                    });
                });
            });
        } else {
            res.send({
                success: false,
                data: undefined
            });
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    return $;
}

module.exports = new Controllers();