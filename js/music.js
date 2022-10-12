export default function (containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
    <audio id="audio"></audio>
    <div id="lyr" class="lyr"></div>
    <div class="music">
        <img id="musicCover" src="../img/音乐.png" alt="music-cover" class="music-cover">
        <div class="music-button" id="musicBotton">
            <button id="prev" class="action-btn">
                <i class="fas fa-backward"></i>
            </button>
            <button id="play" class="action-btn action-btn-big">
                <i class="fas fa-play"></i>
            </button>
            <button id="next" class="action-btn">
                <i class="fas fa-forward"></i>
            </button>
            <div class="lyr-switch" id="lyrSwitch">词</div>
        </div>
    </div>
    `

    const audio = document.getElementById('audio');
    const play = document.getElementById('play');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const musicCover = document.getElementById('musicCover');
    const lyr = document.getElementById('lyr');
    const lyrSwitch = document.getElementById('lyrSwitch');
    const musicBotton = document.getElementById('musicBotton');

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
        container.title = musicList[musicIndex].author + ' ' + musicList[musicIndex].title;
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
        container.title = musicList[musicIndex].author + ' ' + musicList[musicIndex].title;
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

    musicCover.onerror = () => {
        musicCover.src = '../img/音乐.png'
    }

    lyrSwitch.onclick = () => {
        lyr.classList.toggle('hidden');
    }
    
    musicCover.onclick = () => {
        musicBotton.classList.toggle('hidden')
    }
}