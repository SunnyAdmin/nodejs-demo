const { getList, getDetail, newBlog, updateBlog, delBlog } = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleRouterBlog = (req, res) => {
    const id = req.query.id;
    if (req.method === "GET" && req.path === "/api/blog/list") {
        const author = req.query.author || "";
        const keyword = req.query.keyword || "";
        const result = getList(author, keyword);
        return result.then(blogData => {
            return new SuccessModel(blogData);
        }).catch(err => {
            console.error(err);
        });
        
    }
    if (req.method === "GET" && req.path === "/api/blog/detail") {
        const result = getDetail(id);
        return result.then(blogData => {
            return new SuccessModel(blogData);
        });
    }
    if (req.method === "POST" && req.path === "/api/blog/new") {
        const author = "chenxi";
        req.body.author = author;
        const result = newBlog(req.body);
        return result.then(newData => {
            return new SuccessModel(newData);
        });
    }
    if (req.method === "POST" && req.path === "/api/blog/update") {
        const result = updateBlog(id, req.body);
        return result.then(val => {
            if (val) {
                return new SuccessModel();
            }
            return new ErrorModel("更新博客失败");
        });
        
    }
    if (req.method === "POST" && req.path === "/api/blog/del") {
        const result = delBlog(id, "chenxi");
        return result.then(val => {
            if (val.username) {
                return new SuccessModel();
            }
            return new ErrorModel("删除博客失败");
        });
    }
};

module.exports = handleRouterBlog;
