const toggle = document.getElementById('toggle')
const landing = document.getElementById('landing')
const quiting = document.getElementById('quiting')

const formContainer = document.getElementById('form-container')
const btnClose = document.getElementById("btn-close")
const btnSwitch = document.getElementById("switch")
const login = document.getElementById('login')
const logging = document.getElementById('logging')
const register = document.getElementById("register")
const registering = document.getElementById("registering")

// 切换导航栏
toggle.addEventListener('click', () => {
    document.body.classList.toggle('show-nav')
})
// 导航
const route = (address) => {
    window.frames[0].location = address
    document.body.classList.toggle('show-nav')
}

const blogFrame = document.getElementById('ifr');
blogFrame.onload = function () {
    if (localStorage.getItem("user")) {
        blogFrame.contentWindow.postMessage(localStorage.getItem("user"), '*');
    } else {
        blogFrame.contentWindow.postMessage("", '*');
    }
}

landing.addEventListener('click', () => {
    formContainer.style.display = 'block'
})

quiting.addEventListener('click', () => {
    // const navbar = document.getElementById('navbar')
    // navbar.removeChild(document.getElementById("info"))
    localStorage.removeItem("user")
    window.location.reload()
})

btnClose.addEventListener('click', () => {
    formContainer.style.display = 'none'
})

btnSwitch.addEventListener('click', () => {
    if (register.style.display === 'none' || register.style.display === '') {
        login.style.display = 'none'
        register.style.display = 'block'
        btnSwitch.innerText = '登陆'
    } else {
        register.style.display = 'none'
        login.style.display = 'block'
        btnSwitch.innerText = '注册'
    }
})

function notification(message, type) {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">' +
        '  <symbol id="success" viewBox="0 0 16 16">' +
        '    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>' +
        '  </symbol>' +
        '  <symbol id="primary" viewBox="0 0 16 16">' +
        '    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>' +
        '  </symbol>' +
        '  <symbol id="danger" viewBox="0 0 16 16">' +
        '    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>' +
        '  </symbol>' +
        '</svg>',

        `<div class="alert alert-${type} d-inline-flex align-item-center alert-dismissible fade show" role="alert" style="position: absolute;top: 10px;left: 10px;width: 300px">`,
        `<svg class="bi flex-shrink-0 me-2" role="img" style="height: 30px;width: 30px"><use xlink:href="#${type}"/></svg>`,
        `<div style="line-height: 30px">${message}</div>`,
        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>',
        '</div>'
    ].join('')

    document.body.append(wrapper)
}

/***********表单验证***********/
// 显示错误信息
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-item error';
    const small = formControl.querySelector('small');
    small.innerText = message;
}

// 显示正确信息
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-item success';
}

// 检查未填写
function checkRequired(inputArr) {
    let isRequired = false;
    inputArr.forEach(function (input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)}忘了填写呢～`);
            isRequired = true;
        } else {
            showSuccess(input);
        }
    });
    return isRequired
}

// 检查邮箱
function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (re.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, '邮箱格式不对哦...')
        return true
    }
}

// 检查重复密码
function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, '密码怎么不一样呀');
        return true
    }
}

// 获取输入框属性名
function getFieldName(input) {
    const formControl = input.parentElement;
    const label = formControl.querySelector('label');
    return label.innerText
}

function addUserDom() {
    formContainer.style.display = "none"
    landing.style.display = "none"
    quiting.style.display = "block"
    const navbar = document.getElementById('navbar')
    const wrapper = document.createElement('div')
    wrapper.id = "info"
    wrapper.innerHTML = [
        `<div>${JSON.parse(localStorage.getItem("user") || "{}").name}</div>`
    ].join('')
    wrapper.style.position = "absolute"
    wrapper.style.bottom = "60px"
    wrapper.style.color = "white"
    wrapper.style.width = "100%"
    wrapper.style.display = "flex"
    wrapper.style.justifyContent = "center"
    navbar.append(wrapper)
}

logging.addEventListener('click', () => {
    if (checkRequired([login.username, login.password])) {
        return
    }
    let payload = JSON.stringify({ name: login.username.value.trim(), password: login.password.value.trim() })
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' })
    fetch('http://101.42.222.84:8080/ssm/user/login.do', {
        method: 'POST',
        body: payload,
        headers: jsonHeaders
    }).then((res) => {
        res.json().then((json) => {
            if (json.code === '0') {
                notification('登陆成功～', 'success')
                route('http://blog.jollybottle.plus/')
                localStorage.setItem("user", JSON.stringify(json.data))
                addUserDom()
            } else {
                showError(login.password, "用户名或密码记错了哦～")
            }
        })
    })
})

registering.addEventListener('click', () => {
    if (checkRequired([register.registerUsername, register.email, register.registerPassword, register.registerPassword2])) {
        if (register.email.value.trim()) {
            checkEmail(register.email)
        }
        if (register.registerPassword2.value.trim()) {
            checkPasswordsMatch(register.registerPassword, register.registerPassword2)
        }
        return
    }
    if (checkEmail(register.email)) {
        return
    }
    if (checkPasswordsMatch(register.registerPassword, register.registerPassword2)) {
        return
    }
    let payload = JSON.stringify({
        name: register.registerUsername.value.trim(),
        email: register.email.value.trim(),
        password: register.registerPassword.value.trim(),
        repeat: register.registerPassword2.value.trim()
    })
    let jsonHeaders = new Headers({ 'Content-Type': 'application/json' })
    fetch('http://101.42.222.84:8080/ssm/user/registerUser.do', {
        method: 'POST',
        body: payload,
        headers: jsonHeaders
    })
    notification('注册成功～', 'success')
    // formContainer.style.display = "none"
    btnSwitch.click()
})

/***********音乐播放***********/
const audio = document.getElementById('audio');
const play = document.getElementById('play');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const musicCover = document.getElementById('musicCover');
const title = document.getElementById('title');
const author = document.getElementById('author');
const lyr = document.getElementById('lyr');
let goNext = true;
let musicList = [];
let musicIndex = -1;
let musicLength = 0;
let isPlaying = false;
let lyric = [];
let lyricIndex = 0;
const getMusic = (sever, type, id) => {
    fetch('https://api.i-meto.com/meting/api?server=' + sever + '&type=' + type + '&id=' + id).then(
        (res) => {
            res.json().then((data) => {
                musicList = data;
                musicLength = musicList.length;
            });
        });
}

const nextMusic = () => {
    musicIndex++;
    if (musicIndex === musicLength) {
        musicIndex = 0;
    }
    musicCover.src = musicList[musicIndex].pic;
    audio.src = musicList[musicIndex].url;
    author.innerText = musicList[musicIndex].author;
    title.innerText = musicList[musicIndex].title;
    isPlaying ? playMusic() : pauseMusic();
    goNext = true;
    fetch(musicList[musicIndex].lrc).then(
        (res) => {
            res.text().then((data) => {
                lyric = data.split('\n');
                lyricIndex = 0;
            });
        });
}

const prevMusic = () => {
    musicIndex--;
    if (musicIndex === -1) {
        musicIndex = musicLength - 1;
    }
    musicCover.src = musicList[musicIndex].pic;
    audio.src = musicList[musicIndex].url;
    author.innerText = musicList[musicIndex].author;
    title.innerText = musicList[musicIndex].title;
    isPlaying ? playMusic() : pauseMusic();
    goNext = false;
    fetch(musicList[musicIndex].lrc).then(
        (res) => {
            res.text().then((data) => {
                lyric = data.split('\n');
                lyricIndex = 0;
            });
        });
}

const playMusic = () => {
    audio.play();
    musicCover.classList.add('playing');
    play.querySelector('i.fas').classList.remove('fa-play');
    play.querySelector('i.fas').classList.add('fa-pause');
    isPlaying = true;
};

const pauseMusic = () => {
    audio.pause();
    musicCover.classList.remove('playing');
    play.querySelector('i.fas').classList.add('fa-play');
    play.querySelector('i.fas').classList.remove('fa-pause');
    isPlaying = false;
}

play.addEventListener('click', () => isPlaying ? pauseMusic() : playMusic());
next.addEventListener('click', nextMusic);
prev.addEventListener('click', prevMusic);
audio.addEventListener('ended', nextMusic);
audio.addEventListener('error', () => {
    if (goNext) {
        nextMusic();
    } else {
        prevMusic();
    }
});
audio.addEventListener('timeupdate', () => {
    const reTime = /([0-5][0-9]:[0-5][0-9].[0-9][0-9])/;
    const timeStr = reTime.exec(lyric[lyricIndex]);
    if (timeStr !== null) {
        const time = timeStr[0].split(':');
        const min = Number(time[0])
        const sec = Number(time[1])
        const sumSec = min * 60 + sec;
        // reTime.lastIndex = 0;
        let sumSecNext = 0;
        if (lyric[lyricIndex + 1]) {
            const timeStrNext = reTime.exec(lyric[lyricIndex + 1]);
            const timeNext = timeStrNext[0].split(':');
            const minNext = Number(timeNext[0])
            const secNext = Number(timeNext[1])
            sumSecNext = minNext * 60 + secNext;
        } else {
            sumSecNext = 100000;
        }
        if (audio.currentTime < sumSec) {
            const words = lyric[lyricIndex].split(']')[1];
            lyr.innerText = words;
        } else if (sumSec < audio.currentTime && audio.currentTime < sumSecNext) {
            const words = lyric[lyricIndex].split(']')[1];
            lyr.innerText = words;
        } else {
            lyricIndex++;
        }
    } else {
        lyr.innerText = lyric[lyricIndex];
        lyricIndex++;
    }
})

getMusic('tencent', 'playlist', '1503048898');
setTimeout(() => nextMusic(), 1500);

window.onload = function () {
    if (localStorage.getItem("user")) {
        addUserDom()
    } else {
        quiting.style.display = "none"
    }
}