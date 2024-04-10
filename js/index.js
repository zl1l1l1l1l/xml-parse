
import { upload } from "./upload.js";
import { parse } from  "./parse.js";


function init() {
    document.querySelector('.xml-code').innerText = `<test>
        "main"
        <a1   key1="google1" key2="company1"/>
        <name1 key1="super1">"cctv1"</name1>
        <int1>666
            </int1>

        <second>
            <a2   key1="google2" key2="company2"/>
                <name2 key1="super2">"cctv2"</name2>
            <int2>777
            </int2>
        </second>
        <char1> "c" </char1>   
    </test>`;
    document.querySelector('.upload-btn').addEventListener('input', upload);
    document.querySelector('.parse-btn').addEventListener('click', parse);
}

init();
parse();