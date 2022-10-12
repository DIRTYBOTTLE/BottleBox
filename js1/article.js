export default class ArticleCore {
    constructor(container, api) {
        this.api = api;
        this.initContain(container);
    }

    initContain(container) {
        const html = `
            <img class="go-main" id="goMain" src="./img/钢炼.png" />
            <div class="article" id="article"></div>
        `
        document.getElementById(container).innerHTML = html;
        const contentHtml = `
            <input class="title" id="title"></input>
            <div id="editor—wrapper">
                <div id="toolbar-container"></div>
                <div id="editor-container"></div>
            </div>
            <img src="./img/云上传.png" class="upload" id="upload">
            <img src="./img/目录.png" class="cata" id="cata">
            <img src="./img/返回.png" class="go-article" id="goArticle">
        `
        const contentDiv = document.createElement('div');
        contentDiv.id = 'content';
        contentDiv.classList.add('content');
        contentDiv.innerHTML = contentHtml;
        document.getElementById(container).after(contentDiv);

        const catalogHtml = `
            <ul id="catalogContainer" class="catalog-container">
            </ul>
        `
        const catalogDiv = document.createElement('div');
        catalogDiv.id = 'catalog';
        catalogDiv.classList.add('catalog');
        catalogDiv.innerHTML = catalogHtml;
        document.getElementById('content').after(catalogDiv);

        this.getArticles();
        this.editor = window.wangEditor.createEditor({
            selector: '#editor-container',
            html: '<p><br></p>',
            config: {
                placeholder: 'Type here...',
                onChange: (editor) => {
                    this.catalogChange(editor);
                }
            },
            mode: 'default', // or 'simple'
        })

        this.toolbar = window.wangEditor.createToolbar({
            editor: this.editor,
            selector: '#toolbar-container',
            config: {},
            mode: 'default', // or 'simple'
        })
    }

    async getArticles() {
        fetch(`${this.api}/blog/list.do?userId=1`)
            .then(res => res.json().then(json => {
                console.log(json);
                this.data = json.data;
                const data = json.data;
                const article = document.getElementById('article');
                article.innerHTML = '';
                let articleHTML = '';
                for (let i = data.length - 1; i > -1; i--) {
                    articleHTML += `
                            <div class="article-card" data-id="${i}">
                                <div class="write"></div>
                                <div class="read"></div>
                                <h1>${data[i].title}</h1>
                                <h3>${data[i].fromTime} / ${data[i].toTime}</h3>
                                <img src="../img/删除.png" class="delete"/>
                            </div>
                        `
                }
                articleHTML += `
                            <div class="article-card" data-id="-1">
                                <div class="write"></div>
                                <h1>新的想法</h1>
                            </div>
                        `
                article.innerHTML += articleHTML;
                article.onclick = (e) => {
                    this.goArticle(e);
                }
            }));
    }

    async pushArticle(articleForm) {
        const payload = JSON.stringify(articleForm);
        const jsonHeaders = new Headers({
            'Content-type': 'application/json'
        });
        if (articleForm.id > -1) {
            return fetch(`${this.api}/blog/update.do`, {
                method: 'POST',
                body: payload,
                headers: jsonHeaders
            }).then(res => res.json().then(json => json.code))
        }
        return fetch(`${this.api}/blog/insert.do`, {
            method: 'POST',
            body: payload,
            headers: jsonHeaders
        }).then(res => res.json().then(json => json.code))
    }

    async deleteArticle(id) {
        return fetch(`${this.api}/blog/delete.do?id=${id}`)
            .then(res => res.json().then(json => json.code));
    }

    goArticle(e) {
        const target = e.target;
        const articleContainer = document.getElementById('articleContainer');
        const content = document.getElementById('content');
        const title = document.getElementById('title');
        const tool = document.getElementById('toolbar-container');
        const updload = document.getElementById('upload');
        const editor = this.editor;
        const data = this.data;

        if (target.classList[0] === 'read') {
            const dataId = target.parentNode.getAttribute('data-id');
            title.value = data[dataId].title;
            title.disabled = 'true';
            editor.disable();
            editor.setHtml(data[dataId].content);
            articleContainer.classList.toggle('show');
            content.classList.toggle('show');
            tool.style.display = 'none';
            updload.style.display = 'none';
            const onleaving = () => {
                document.getElementById('goArticle').removeEventListener('click', onleaving);
                document.getElementById('content').classList.toggle('show');
                document.getElementById('articleContainer').classList.toggle('show');
                document.getElementById('catalog').classList.remove('show');
            }
            document.getElementById('goArticle').addEventListener('click', onleaving);
        }
        if (target.classList[0] === 'write') {
            const dataId = target.parentNode.getAttribute('data-id');
            title.value = dataId > -1 ? data[dataId].title : '';
            title.disabled = '';
            editor.enable();
            editor.setHtml(dataId > -1 ? data[dataId].content : '');
            articleContainer.classList.toggle('show');
            content.classList.toggle('show');
            tool.style.display = 'initial';
            updload.style.display = 'initial';
            const myDate = new Date();
            updload.onclick = () => {
                const articleForm = {
                    id: data[dataId] ? data[dataId].id : -1,
                    title: title.value,
                    content: editor.getHtml(),
                    fromTime: myDate.toLocaleDateString(),
                    toTime: myDate.toLocaleDateString(),
                    userId: 1
                };
                this.pushArticle(articleForm).then((code) => {
                    if (code === '0') {
                        alert('更新成功');
                        this.getArticles();
                    } else {
                        alert('更新失败');
                    }
                    if (dataId < 0) {
                        document.getElementById('content').classList.toggle('show');
                        document.getElementById('articleContainer').classList.toggle('show');
                    }
                });
            }
            const saveKey = (event) => {
                if ((event.metaKey && event.key === "s") || (event.ctrlKey && event.key === "s")){
                    event.preventDefault();
                    const articleForm = {
                        id: data[dataId] ? data[dataId].id : -1,
                        title: title.value,
                        content: editor.getHtml(),
                        fromTime: myDate.toLocaleDateString(),
                        toTime: myDate.toLocaleDateString(),
                        userId: 1
                    };
                    this.pushArticle(articleForm).then((code) => {
                        if (code === '0') {
                            alert('更新成功');
                            this.getArticles();
                        } else {
                            alert('更新失败');
                        }
                        if (dataId < 0) {
                            document.getElementById('content').classList.toggle('show');
                            document.getElementById('articleContainer').classList.toggle('show');
                        }
                    });
                }
            }
            document.addEventListener("keydown", saveKey);
            this.checkSave();
            const onleaving = () => {
                if (confirm('可能还未保存，确认离开？')) {
                    this.removeCheck();
                    document.getElementById('goArticle').removeEventListener('click', onleaving);
                    document.getElementById('content').classList.toggle('show');
                    document.getElementById('articleContainer').classList.toggle('show');
                    document.getElementById('catalog').classList.remove('show');
                    document.removeEventListener("keydown", saveKey);
                }
            }
            document.getElementById('goArticle').addEventListener('click', onleaving);
        }
        if (target.classList[0] === 'delete') {
            if (confirm('确认删除？')) {
                const dataId = target.parentNode.getAttribute('data-id');
                const id = this.data[dataId].id;
                this.deleteArticle(id).then((code) => {
                    if (code === '0') {
                        alert('删除成功');
                        this.getArticles();
                    } else {
                        alert('删除失败');
                    }
                });
            }
        }
    }

    checkEvent(event) {
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = '';
    }

    checkSave() {
        window.addEventListener('beforeunload', this.checkEvent);
    }

    removeCheck() {
        window.removeEventListener('beforeunload', this.checkEvent);
    }

    catalogChange(editor) {
        const headers = editor.getElemsByTypePrefix('header');
        const catalogContainer = document.getElementById('catalogContainer');
        const catalogHtml = headers.map(header => {
            const id = header.id;
            const type = header.type;
            const text = header.children[0].text;
            const color = header.children[0].color;
            return `<li id="${id}" data-type="${type}" style="color:${color}">${text}</li>`
        }).join('');
        catalogContainer.innerHTML = catalogHtml;
        catalogContainer.addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                e.preventDefault();
                editor.scrollToElem(e.target.id);
            }
        });
    }
}

