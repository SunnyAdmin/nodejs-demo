const mysql = require("mysql");
const { MYSQL_CONF } = require("../conf/db");

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF);

// 开始链接
con.connect();

// 执行 sql 语句函数
function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
    
}

// // 关闭链接
// con.end();

module.exports = {
    exec
}