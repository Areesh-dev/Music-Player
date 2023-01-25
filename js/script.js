// Let's select all required tags or elements

let wrapper = document.querySelector('.wrapper'),
    musicImg = wrapper.querySelector('.img-area img'),
    musicName = wrapper.querySelector('.song-details .name'),
    musicArtist = wrapper.querySelector('.song-details .artist'),
    mainAudio = wrapper.querySelector('#main-audio'),
    playPauseBtn = wrapper.querySelector('.play-pause'),
    prevBtn = wrapper.querySelector('#prev'),
    nextBtn = wrapper.querySelector('#next'),
    progessArea = wrapper.querySelector('.progress-area'),
    progessBar = wrapper.querySelector('.progress-bar'),
    musicList = wrapper.querySelector('.music-list'),
    showMoreBtn = wrapper.querySelector('#more-music'),
    hideMusicBtn = wrapper.querySelector('#close');



let musicIndex = 1;

window.addEventListener('load', () => {
    loadMusic(musicIndex); //calling load music function once window loaded
    playingNow();
});

// load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic() {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause';
    mainAudio.play();
}

// pause music function
function pauseMusic() {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow';
    mainAudio.pause();
}

// next music function
function nextMusic() {
    // here we'll just increment of index by 1
    musicIndex++;
    // if musicIndex is greater then array length then musicIndex will be 1 so the song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
// prev music function
function prevMusic() {
    // here we'll just decrement of index by 1
    musicIndex--;
    // if musicIndex is less then 1 then musicIndex will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}


// play or music botton event
playPauseBtn.addEventListener('click', () => {
    let isMusicPaused = wrapper.classList.contains("paused");
    // if isMusicPasued is ture call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// next music btn event
nextBtn.addEventListener('click', () => {
    nextMusic(); // calling next music function 
});
// prev music btn event
prevBtn.addEventListener('click', () => {
    prevMusic(); // calling prev music function 
});

// update progess bar width according to music current time
mainAudio.addEventListener('timeupdate', (e) => {
    let currentTime = e.target.currentTime; // getting current time of song
    let duration = e.target.duration; // getting total duration of song
    let progessWidth = (currentTime / duration) * 100;
    progessBar.style.width = `${progessWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current'),
        musicDuration = wrapper.querySelector('.duration');

    mainAudio.addEventListener('loadeddata', () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { // adding 0 if sec is less than 10 
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });

    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { // adding 0 if sec is less than 10 
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


//let's update playing song current time according to the progress bar width
progessArea.addEventListener('click', (e) => {
    let progessWidthval = progessArea.clientWidth; // getting width of progress bar
    let clickedoffsetX = e.offsetX; // getting offset x value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = (clickedoffsetX / progessWidthval) * songDuration;
    playMusic();
});

// let's work on repeat, shuffle song according to the icon
let repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
    // first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; // getting innerText of icon
    // let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": // if this icon is repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped")
            break;
        case "repeat_one": // if this icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playlist Shuffle")
            break;
        case "shuffle": // if this icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped")
            break;
    }
});

// above we just changed the icon, now let's work on what to do
// after the song ended


mainAudio.addEventListener('ended', () => {
    // we'll do according to the icon mean if user has set icon to loop song thenwe'll repeat
    // the current song and will do further accordingly

    let getText = repeatBtn.innerText; // getting innerText of icon
    // let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": // if this icon is repeat then simply we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case "repeat_one": // if this icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beginning 
            mainAudio.currentTime = 0;
            loadMusic(indexNumb);
            playMusic(); // calling playMusic function
            break;
        case "shuffle": // if this icon is shuffle then change it to repeat
            // generating random index between the max range of array lenght
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); // this loop run until the next random number won'y be the same of current music index
            musicIndex = randIndex; // passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex);// calling loadMusic function
            playMusic(); // calling playMusic function\
            playingNow();
            break;
    }

});


showMoreBtn.addEventListener('click', () => {
    musicList.classList.add('show');
});
hideMusicBtn.addEventListener('click', () => {
    musicList.classList.remove('show');
});


let ulTag = wrapper.querySelector('ul');

// let's create li according to the array lenght
for (let i = 0; i < allMusic.length; i++) {
    // let's pass the song name, artist from the array to li
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                        <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                 </li>`;

    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener('loadeddata', () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { // adding 0 if sec is less than 10 
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // adding t duration attribute we'll use below
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`);
    });
}


// let's work on play particular song on click
let allLiTag = ulTag.querySelectorAll('li');

function playingNow() {
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector('.audio-duration');
        // let's remove playing class from all other li expect the last one whick is clicked
        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            // let's get that audio duration value and pass to audio-duration innerText
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = adDuration; // passing t-duration value to audio duration innerText 
        }
        // if there is an li tag which li-index is equal to musicIndex
        // then this music is playing now and we'll style it
        if (allLiTag[j].getAttribute('li-index') == musicIndex) {
            allLiTag[j].classList.add('playing');
            audioTag.innerText = "Playing";
        }

        // adding onclick attribute in all li tag
        allLiTag[j].setAttribute('onclick', 'clicked(this)');
    }
}

// let's play song on li click
function clicked(element) {
    // getting li index of particular clicked li tag 
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passing that li index to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}