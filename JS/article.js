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
            <img src="./img/返回.png" class="go-article" id="goArticle">
        `
        const contentDiv = document.createElement('div');
        contentDiv.id = 'content';
        contentDiv.classList.add('content');
        contentDiv.innerHTML = contentHtml;
        document.getElementById(container).after(contentDiv);
        this.getArticles();
        this.editor = window.wangEditor.createEditor({
            selector: '#editor-container',
            html: '<p><br></p>',
            config: { placeholder: 'Type here...' },
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
            // ElMessageBox.confirm(
            //     '确认删除?',
            //     {
            //       confirmButtonText: '是的',
            //       cancelButtonText: '取消',
            //       type: 'warning',
            //     }
            // ).then(() => {
            //   axios.get('/api/blog/delete.do', {
            //     params: {
            //       id: id
            //     }
            //   }).then(res => {
            //     if (res.data.code === '0') {
            //       getBlog()
            //       ElMessage.success("删除成功！")
            //     } else {
            //       ElMessage.error("删除失败！")
            //     }
            //   })
            // }).catch(() => {
            //   ElMessage({
            //     type: 'info',
            //     message: 'Delete canceled',
            //   })
            // })
        }
    }
}

