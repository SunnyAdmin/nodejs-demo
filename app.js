const querystring = require("querystring");
const { get, set } = require("./src/db/redis");
const { access } = require("./src/utils/log")

const handleRouterBlog = require("./src/router/blog");
const handleRouterUser = require("./src/router/user");

// 设置cookie过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

// // session数据
// const SESSION_DATA = {};

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
    // 记录 access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()} `)
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
        req.cookie[key] = val;
    });
    
    // 解析session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}; 
    //     }
    // } else {
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`;
    //     SESSION_DATA[userId] = {}; 
    // }
    // req.session = SESSION_DATA[userId];

    // 解析session（使用redis）
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if (!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化session
        set(userId, {});
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData === null) {
            set(req.sessionId, {});
            // 设置 session
            req.session = {};
        } else {
            req.session = sessionData;
        }
        return handlePost(req);
    }).then(postData => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleRouterBlog(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    // 操作cookie
                    res.setHeader("Set-Cookie", `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
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
                if (needSetCookie) {
                    // 操作cookie
                    res.setHeader("Set-Cookie", `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
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
 