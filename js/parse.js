import { nodeDom } from "./nodeDom.js";
import { strTrim } from "./utils.js";

const tagReg = /<(.*?)>(?=([^"]*"[^"]*")*[^"]*$)/gm; // 匹配单标签，防止字符串内含有尖角号
let codeStr = '';
const xmlCodeDom = document.querySelector('.xml-code');
const xmlParseDom = document.querySelector('.parse-text');

// 解析
export function parse() {
    const parseObj = new nodeDom('root');
    codeStr = xmlCodeDom.innerText.trim();
    matchNode(parseObj, codeStr);
    xmlParseDom.innerHTML = renderTree(parseObj.render());
}

/** 匹配节点
 * @param {Object} parseObj 插入对象
 * @param {String} matchStr 匹配字符串(去掉空格)
*/
function matchNode(parseObj, matchStr) {
    tagReg.lastIndex = 0; // 每次匹配必须清空上次匹配索引
    const { value, done } = matchStr.matchAll(tagReg).next();
    if(done) {
        return;
    }
    const {
        nextStr: {
            above,
            inner,
            below
        },
        curNode,
    } = getNextStr(parseObj, matchStr, value);
    if(above) {
        isNoDom(above)
        ? parseObj.addChildren(above)
        : matchNode(parseObj, above)
    }
    if(curNode) {
        parseObj.addChildren(curNode);
    }
    if(inner) {
        isNoDom(inner)
        ? curNode.addChildren(inner)
        : matchNode(curNode, inner);
    }
    if(below) {
        matchNode(parseObj, below);
    }
}

// 测试是否是非标签
function isNoDom(str) {
    return !!(str && !tagReg.test(str));
}

// 获取下一个待处理字符串和当前节点
function getNextStr(parent, curStr, matchObj) {
    const nextStr = {
        above: '',// 兄
        inner: '',// 子
        below: '',// 兄
    };
    let curNode = null;
    const { name, props, isEnd, isSingleTag } = nameDispose(matchObj[1]);
    if(isSingleTag) {
        curNode = new nodeDom(name, props, [], parent);
        nextStr.above = curStr.slice(0, matchObj.index).trim();
        nextStr.below = curStr.slice(matchObj.index + matchObj[1].length + 3).trim();
    }else if(!isEnd) {
        // 找到结束位置
        const endIndex = matchNameEnd(name, curStr);
        nextStr.above = curStr.slice(0, matchObj.index).trim();
        nextStr.inner = curStr.slice(matchObj.index + matchObj[1].length + 2, endIndex - 1).trim();
        nextStr.below = curStr.slice(endIndex + matchObj[1].split(' ')[0].length + 2).trim();
        curNode = new nodeDom(name, props, [], parent);
    }else {
        nextStr.below = curStr.slice(matchObj.index + matchObj[1].length + 2).trim();
    }

    return {
        nextStr,
        curNode,
    }
}

// 名字匹配结束位置
function matchNameEnd(name, matchStr) {
    let curNameEnd = 0; // 不带结束符 + 1， 带结束符 - 1
    const iterCurName = matchStr.matchAll(new RegExp(name, 'g')); // 当前属性名迭代器
    // 找到结束位置
    while(true) {
        const { value, done } = iterCurName.next();
        if(matchStr[value.index-1] !== '/') {
            curNameEnd += 1;
        }else {
            curNameEnd -= 1;
        }
        if(curNameEnd === 0 || done) {
            return value.index - 1;
        }
    }
}

// 节点名称、属性处理
function nameDispose(str) {
    let isEnd = false;
    let isSingleTag = false; // 是否是单节点
    let name = null;
    const props = {};
    
    if(/\/$/.test(str)) {
        isEnd = true;
        isSingleTag = true;
        str = str.slice(0, str.length - 1);
    }else if(/^\//.test(str)) {
        isEnd = true;
        name = str.replace('/', '');
    }
    if(isEnd && !isSingleTag) {
        return { isEnd, name, props, isSingleTag };
    }

    str = strTrim(str);
    const spArr = str.split(' ');
    name = spArr.shift();
    spArr.forEach(i => {
        const pro = i.split('=');
        props[pro[0]] = pro[1]
    })
    return { isEnd, name, props, isSingleTag };
}

// 渲染
function renderTree(str) {
    const { value } = str.matchAll('\n').next();
    if(value) { // 去除根
        str = str.slice(value.index + 1);
    }
    console.log(str)
    return `<pre>${str}<pre/>`;
}