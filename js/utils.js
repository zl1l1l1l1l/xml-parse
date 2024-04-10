// 去除多余空格(保留一个)
export function strTrim(str) {
    return str.replace(/\s+/g, ' ').trim();
}
