const fs = require("fs");
const path = require('path');
const db = require(path.resolve(__dirname, '../bin/db'));

exports.start = function (req, res) {
    if (req.body.hasOwnProperty('dirUrl')) {
        // todo need to check for has own property user and return true false to Front End
        // todo time of event can be added
        db.run(`INSERT INTO events(user, event_message) VALUES(?, 'started monitoring')`, req.body['user']);
        res.status(200).send(getFiles(req.body.dirUrl, []));
    } else {
        console.log('error happened - no dir url');
    }
};

exports.status = function (req, res) {

    // todo add to where clause user name and last date
    let userName = req.params['name'];
    let sql = `SELECT folder_path,
                  message
            FROM logs
            WHERE user = ?`;
    let resStatuses = [];
    db.each(sql, [userName], (err, row) => {
        if (err) {
            throw err;
        }
        resStatuses.push({folderPath: row['folder_path'], message: row['message']})
    }, () => {
        res.status(200).send(resStatuses);
    });
};

exports.stop = function (req, res) {
    // todo need to check for has own property user and return true false to Front End
    // todo time of event can be added
    db.run(`INSERT INTO events(user, event_message) VALUES(?, 'stopped monitoring')`, req.body['user']);

    let serviceLogs = req.body['logs'];
    let folderPath = req.body['dirUrl'];
if(serviceLogs.length > 0) {
    let placeholders = serviceLogs.map((serviceLog) => `('${req.body['user']}', '${folderPath}', ?)`).join(',');
    let sql = 'INSERT INTO logs(user, folder_path, message) VALUES ' + placeholders;


    db.run(sql, serviceLogs, function (err) {
        if (err) {
            return console.error('errr', err.message);
        }
        res.status(200).send([true]);
       // console.log(`Rows inserted ${this.changes}`);
    });
    //db.close();
} else {
    res.status(200).send([false]);
}
};

function getFiles(dir, files_) {
    files_ = files_ || [];
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (errr) {
        //console.log('errrrr', errr);
        return [{errorMsg: errr}];
    }

    for (let i in files) {
        let filePath = dir + '/' + files[i];
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, files_);
        } else {
            const fileStats = fs.statSync(filePath);
            files_.push({name: files[i], createdAt: fileStats.birthtimeMs});
        }
    }
    return files_;
}