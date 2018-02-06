const path = require('path');
const db = require(path.resolve(__dirname, '../bin/db'));

exports.login = function (req, res) {
    if (!req.body.hasOwnProperty('user') || !req.body.hasOwnProperty('pass'))
        res.status(200).send({isAnonymous: true, message: 'Incorrect User name or/and Password'});
    else {
        // check user data in mysqlite
        const userName = req.body.user;
        const userPass = req.body.pass;

        let sql = `SELECT user, pass
           FROM users
           WHERE user  = ?`;

        db.get(sql, [userName], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            // todo time of event can be added
            if(row && row['pass'] === userPass) {
                db.run(`INSERT INTO events(user, event_message) VALUES(?, 'is successfully logged in')`,userName);
                return res.status(200).send({isAnonymous: false, message: 'Success'});
            } else {
                db.run(`INSERT INTO events(user, event_message) VALUES(?, 'tried to login and did not succeed')`, userName);
                return res.status(200).send({isAnonymous: true, message: 'Incorrect User name or/and Password'});
            }
        });
       // db.close();
    }
};

exports.logout = function (req, res) {
    // todo need to check for has own property user and return true false to Front End
    // todo time of event can be added
    db.run(`INSERT INTO events(user, event_message) VALUES(?, 'is successfully logged out')`, req.body['user']);
    console.log('User is logged out');
    return res.status(200).send(true);
};