const xmlCodeDom = document.querySelector('.xml-code');

export function upload(e) {
    const file = e.target.files[0];
    const isXml = /.xml$/.test(file.name);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        let str = e.target.result;
        isXml && (str = str.replace('<?xml version="1.0" encoding="UTF-8"?>', ''));
        xmlCodeDom.innerText = str;
    }


    fileReader.readAsText(file);
}