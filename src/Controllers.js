/**
 * Created by dreamind on 22.08.2016.
 */
'use strict';
const KEY = '1234567890987654321';

var mysql = require('mysql'),
    fs = require('fs'),
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
        new Address('/load_data', controllerLoadData),
        new Address('/send', controllerSend),
        new Address('/get_sent_msg', controllerLoadSent)
    ];

    //------------------------------------------------------------------------------------------------------------------
    function controllerSignIn(req, res) {
        let user = req.body.user,
            pass = req.body.pass;

        fs.readFile('./files/file', 'utf8', (err, data) => {
            if (err) throw err;
            let sig_in_arr = data.split('#');
            if (user === sig_in_arr[0] && pass === sig_in_arr[1]) {
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
        });

    }
    //------------------------------------------------------------------------------------------------------------------
    function controllerLoadData(req, res) {
        if (req.body.key === KEY) {
            pool.getConnection((err, connection) => {
                connection.query('SELECT * FROM bot_users', (err, rows) => {
                    connection.release();
                    var obj = [];
                    rows.forEach((row) => {
                        obj.push({
                            user_id: row.user_id,
                            username: (row.username) ? row.username : '-',
                            name: row.first_name + ((row.last_name) ? ' ' + row.last_name : ''),
                            time: (row.time) ? row.time.toString() : undefined,
                            type: (row.type) ? row.type : 0
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
    function controllerSend(req, res) {
        if (req.body.key === KEY) {
            let dt = new Date();
            var to_db = {
                    time: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString(),
                    users_ids: req.body.ids,
                    users_names: req.body.names,
                    msg: req.body.text,
                    flag: 0
                };
            pool.getConnection((err, connection) => {
                var qr = connection.query('INSERT INTO bot_delivery SET ?', to_db, (err, result) => {
                    connection.release();
                    res.send({
                        success: true
                    });
                });
                console.log(qr.sql);
            });
        } else {
            res.send({
                success: false,
                data: undefined
            });
        }
    }
    //------------------------------------------------------------------------------------------------------------------
    function controllerLoadSent(req, res) {
        if (req.body.key === KEY) {
            pool.getConnection((err, connection) => {
                connection.query('SELECT * FROM bot_delivery', (err, rows) => {
                    connection.release();
                    var obj = [];
                    rows.forEach((row) => {
                        obj.push({
                            times: row.time,
                            users_ids: row.users_ids,
                            users_names: row.users_names,
                            texts: row.msg
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