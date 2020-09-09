const { loginStart } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleRouterUser = (req, res) => {
    // 登录
    if (req.method === "GET" && req.path === "/api/user/login") {
        // const { username, password } = req.body;
        const { username, password } = req.query;
        const result = loginStart(username, password);
        return result.then(loginData => {
            if (loginData.username) {
                req.session.username = loginData.username;
                req.session.realname = loginData.realname;
                console.log(req.session);
                return new SuccessModel();
            }
            return new ErrorModel("登录失败");
        })
    }
    // 登录验证
    if (req.method === "GET" && req.path === "/api/user/login-test") {
        if(req.session.username) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }));
        }
        return Promise.resolve(new ErrorModel("尚未登录"));
    }
};

module.exports = handleRouterUser;
