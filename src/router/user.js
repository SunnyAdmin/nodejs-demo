const { loginStart } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 设置cookie过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    console.log("d.toGMTString", d.toGMTString());
    return d.toGMTString();
}

const handleRouterUser = (req, res) => {
    // 登录
    if (req.method === "GET" && req.path === "/api/user/login") {
        // const { username, password } = req.body;
        const { username, password } = req.query;
        const result = loginStart(username, password);
        return result.then(loginData => {
            if (loginData.username) {
                // 操作cookie
                res.setHeader("Set-Cookie", `username=${loginData.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
                return new SuccessModel();
            }
            return new ErrorModel("登录失败");
        })
    }
    // 登录验证
    if (req.method === "GET" && req.path === "/api/user/login-test") {
        if(req.cookie.username) {
            return Promise.resolve(new SuccessModel({
                username: req.cookie.username
            }));
        }
        return Promise.resolve(new ErrorModel("尚未登录"));
    }
};

module.exports = handleRouterUser;
