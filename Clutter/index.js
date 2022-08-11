import { isNum, max, min, Hexcolor, type, isJson } from "../util/index";
function randomNumb(a, b, c = 0) {
  try {
    var num = isNum(a) && isNum(b);
    if (!num) {
      throw new Error("传入的参数为数字或者数字字符串");
    }
    //防止小数部分过多
    if (c > 20) {
      c = 0;
    }
    const res = (Math.random() * (max(a, b) - min(a, b)) + min(a, b)).toFixed(
      c
    );
    return res;
  } catch (err) {
    throw new Error(err);
  }
}
// 浏览器方法
const localDB = {
  isWindow: () => {
    if (typeof window === "undefined") {
      throw new Error("请在浏览器下调用此方法");
    }
  },
  set: (key, val) => {
    localDB.isWindow();
    return window.localStorage.setItem(key, JSON.stringify(val));
  },
  delete: (key) => {
    localDB.isWindow();
    return window.localStorage.removeItem(key);
  },
  get: (key) => {
    localDB.isWindow();
    if (isJson(window.localStorage.getItem(key))) {
      return JSON.parse(window.localStorage.getItem(key));
    } else {
      return window.localStorage.getItem(key);
    }
  },
  clear: () => {
    localDB.isWindow();
    return window.localStorage.clear();
  },
};

function rgba(a = 0.5, isA = true) {
  if (isNum(a)) {
    if (a > 1) a = 1;
    if (a < 0) a = 0;
    const r = randomNumb(0, 255);
    const g = randomNumb(0, 255);
    const b = randomNumb(0, 255);
    const res = `rgba(${r},${g},${b},${a})`;
    if (isA) {
      return res;
    }
    return Hexcolor(res);
  } else {
    throw new Error("第一个参数应为0～1的数字或数字字符串");
  }
}
// 驼峰转连字符
function toSnakeCase(str, separator = "_") {
  let res = str.replace(/\s+/g, separator);
  res = res.replace(/([A-Z])/g, (match, $1) => `_${$1.toLowerCase()}`);
  return res.replace(/^_/, "");
}
// 连字符转驼峰
function toCamelCase(str, separator = "_") {
  let res = str.replace(/\s+/g, separator);
  res = res.replace(/([A-Z])/g, (match, $1) => `_${$1.toLowerCase()}`);
  return res
    .replace(/^_/, "")
    .replace(/_(\w)/g, (match, $1) => $1.toUpperCase());
}
// 验证码
function authCode(option = {}, callback) {
  let res = "";
  try {
    const DefaultOption = {
      style: {
        backgroundColor: "pink",
      },
      el: "body",
      height: 100,
      width: 200,
      word: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      num: 4,
      textAlign: "center",
      fillStyle: "purple",
      strokeStyle: "#fff",
      position: {
        x: 110,
        y: 60,
      },
      font: "40px 楷体",
    };
    const idNum = randomNumb(100, 1000);
    let Option = {};
    if (type(option) !== "object") Option = {};
    Option = option && { ...DefaultOption, ...option };
    const canvas = document.createElement("canvas");
    canvas.height = Option.height;
    canvas.width = Option.width;
    Object.entries(Option.style).forEach((ele) => {
      canvas.style[ele[0]] = ele[1];
    });
    canvas.id = `wsm-canvas-${idNum}`;
    if (!document.querySelector(Option.el)) throw new Error("请选择有效节点");
    document.querySelector(Option.el).appendChild(canvas);
    var can = document.getElementById(`wsm-canvas-${idNum}`);
    var Canvas = can.getContext("2d");
    if (Option.word.length < 4) {
      throw new Error("字母数量至少为5位");
    }
    function change() {
      for (var i = 0; i < Option.num; i++) {
        var num = Math.round(Math.random() * (Option.word.length - 1));
        res += Option.word[num];
      }
      return res;
    }

    function random() {
      return Math.round(Math.random() * 250);
    }
    can.onclick = function () {
      //清除画布内容和结果
      res = "";
      can.height = can.height;
      //开始绘画
      Canvas.beginPath();
      // 起始点
      Canvas.moveTo(random(), random());
      // 随机n跳三次贝塞尔曲线
      for (var i = 0; i < random(); i++) {
        Canvas.bezierCurveTo(
          random(),
          random(),
          random(),
          random(),
          random(),
          random()
        );
      }
      // 定义验证码字体
      Canvas.font = Option.font;
      //验证码居中
      Canvas.textAlign = Option.textAlign;
      // 验证码颜色
      Canvas.fillStyle = Option.fillStyle;
      //验证码绘画入文本
      Canvas.fillText(change(), Option.position.x, Option.position.y);
      // 关闭绘画
      Canvas.closePath();
      // 曲线颜色
      Canvas.strokeStyle = Option.strokeStyle;
      Canvas.stroke();
      callback && callback(res);
    };
    can.onclick();
  } catch (err) {
    console.log(err);
  } finally {
    return {
      Canvas: Canvas || null,
      res: res || null,
    };
  }
}

export default {
  randomNumb,
  localDB,
  rgba,
  toSnakeCase,
  toCamelCase,
  authCode,
};
