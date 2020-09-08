const { exec } = require("../db/mysql");

const loginStart = (username, password) => {
    const sql = `select username, realname from node_demo_users where username='${username}' and password='${password}'`;
    return exec(sql).then(rows => {
        return rows[0] || {};
    });
};

module.exports = {
    loginStart
};
