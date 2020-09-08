const querystring = require("querystring");

const handleRouterBlog = require("./src/router/blog");
const handleRouterUser = require("./src/router/user");

// session数据
const SESSION_DATA = {};

// 处理post data
const handlePost = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            resolve({});
            return;
        }
        if (req.headers["content-type"] !== "application/json") {
            resolve({});
            return;
        }
        let postData = "";
        req.on("data", item => {
            postData += item.toString();
        })
        req.on("end", () => {
            if (!postData) {
                resolve({});
                return;
            }
            resolve(JSON.parse(postData)); 
        });
    });
};

const handleServer = (req, res) => {
    // 设置返回格式
    res.setHeader("Content-type", "application/json");

    // 获取path
    const url = req.url;
    req.path = url.split("?")[0];

    // 解析 query
    req.query = querystring.parse(url.split("?")[1]);

    // 解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ""; // k1=v1;k2=v2;k3=k3;
    cookieStr.split(";").forEach(item => {
        if(!item) { 
            return;
        }
        const arr = item.split("=");
        const key = arr[0].trim();
        const val = arr[1].trim();
        console.log(key, val);
        req.cookie[key] = val;
    });
    
    // 解析session
    const userId = req.cookie.userid;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}; 
        }
    } else {
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {}; 
    }
    req.session = SESSION_DATA[userId];

    handlePost(req).then(postData => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleRouterBlog(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (blogData) {
                    res.end(
                        JSON.stringify(blogData)
                    )
                }
            });
            return;
        }
        // 处理user路由
        const userResult = handleRouterUser(req, res);
        if (userResult) {
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            });
            return;
        }

        // 未命中路由 404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 NOT Found\n");
        res.end();
    });
};

module.exports = handleServer;
 