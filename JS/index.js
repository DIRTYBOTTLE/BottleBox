import switchRain from "./rain.js";
switchRain();

document.getElementById('card').onclick = () => {
    document.getElementById('mainContainer').classList.toggle('hidden');
    document.getElementById('articleContainer').classList.toggle('show');
}

document.getElementById('emailIcon').addEventListener(('click'), () => {
    function copy(str) {
        const textArea = document.createElement('textArea');
        document.body.appendChild(textArea);
        textArea.innerText = str;
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea);
    }
    copy('zpchang@whu.edu.cn');
    alert('邮箱已复制～');
})

import initMusic from "./music.js"
initMusic('music-container');

import ArticleCore from "./article.js";
new ArticleCore('articleContainer', 'http://101.42.222.84:8080/ssm/');
document.getElementById('goMain').onclick = () => {
    document.getElementById('mainContainer').classList.toggle('hidden');
    document.getElementById('articleContainer').classList.toggle('show');
}
document.getElementById('goArticle').addEventListener('click', () => {
    document.getElementById('content').classList.toggle('show');
    document.getElementById('articleContainer').classList.toggle('show');
})









