const { exec } = require("../db/mysql");

// 获取列表
const getList = (author, keyword) => {
    let sql = `select * from node_demo_blogs where 1=1 `;
    if (author) {
        sql += `and author='${author}'`;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`
    return exec(sql);
};

// 获取详情
const getDetail = (id) => {
    const sql = `select * from node_demo_blogs where id='${id}'`;
    return exec(sql).then(rows => {
        return rows[0]
    });
};

// 新建
const newBlog = (obj = {}) => {
    const { title, content, author } = obj;
    const createtime = Date.now();
    const sql = `insert into node_demo_blogs (title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}')`;
    return exec(sql).then(insertData => {
        console.log("insertData", insertData);
        return {
            id: insertData.insertId
        }
    });
};

const updateBlog = (id, obj = {}) => {
    const { title, content } = obj;
    const sql = `update node_demo_blogs set title='${title}', content='${content}' where id=${id}`;
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

const delBlog = (id, author) => {
    const sql = `delete from node_demo_blogs where id=${id} and author='${author}'`;
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true;
        }
        return false;
    });
};

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
};
