const fs = require("fs");
const path = require("path");

const fileName = path.resolve(__dirname, 'data.txt');

// 读取文件内容(大容量不适用)
fs.readFile(fileName, (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    // data是二进制类型。要转化字符串类型
    console.log(data.toString());
});

// 写入文件
const content = "这是新写入的内容\n";
const opt = {
    flag: "a", // 追加写入。 覆盖用"w"
}
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.error(err);
        return;
    }
});

// 判断文件是否存在
fs.access(fileName + "d水电费水电费a", fs.constants.F_OK, (err) => {
    console.log(`${fileName} ${err ? '不存在': '存在'}`);
});