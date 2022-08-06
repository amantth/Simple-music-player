// selecting all required tafs and elements

const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPausebtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");
   



let musicIndex =  Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadmusic(musicIndex);
        playingnow();
    
})
function loadmusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jfif`;
    mainAudio.src = `musics/${allMusic[indexNumb - 1].src}.mp3`;
    
}
//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPausebtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused")
      playPausebtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//play or music button event
playPausebtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if ismusicpaused is true call pausemusic else call playmusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingnow();
    
});
//nextBtn
function nextMusic() {
     musicIndex++;
    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    }
    loadmusic(musicIndex);
    playMusic();
    playingnow()
}
nextBtn.addEventListener("click", () => {
    musicIndex++;
    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    }
    loadmusic(musicIndex);
    playMusic();
    playingnow()
})
//prevbtn
prevBtn.addEventListener("click", () => {
    musicIndex--;
  if (musicIndex < 1) {
        musicIndex= allMusic.length;
    }
    loadmusic(musicIndex);
    playMusic();
})
//update progress bar width
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");
    
    mainAudio.addEventListener("loadeddata", () => {
    //update song total duration
        let audioDuration = mainAudio.duration;
        let minute = Math.floor(audioDuration/60);
        let secound = Math.floor(audioDuration % 60);
        if (secound < 10) {
            secound = `0${secound}`;
        }
           musicDuration.innerText =`${minute}:${secound}`
             //update playying song current time 

       
    })
     let curminute = Math.floor(currentTime/60);
        let cursecound = Math.floor(currentTime % 60);
        if (cursecound < 10) {
            cursecound = `0${cursecound}`;
        }
        musicCurrentTime.innerText =`${curminute}:${cursecound}`


})
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;
    let clickedoffsetx = e.offsetX;
    let songDuration = mainAudio.duration;
    
    mainAudio.currentTime = (clickedoffsetx / progressWidthval) * songDuration;
    playMusic();

})

//lets work on repear shuffle song according to the icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //first we get innertext of the icon then weoll change accordinglu
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","song looped")

            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
             repeatBtn.setAttribute("title","playback looped")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
           repeatBtn.setAttribute("title","playlist looped")
            break;
    }
})

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadmusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadmusic(musicIndex);
            playMusic();
            break;
    }
})
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = ` <li li-index="${i+1}">
             <div class="row">
                 <span>${allMusic[i].name}</span>
                     <p>${allMusic[i].artist}</p>
                  </div>
                          <audio class="${allMusic[i].src}" src="musics/${allMusic[i].src}.mp3"></audio>
                         <span id="${allMusic[i].src}" class="audio-duration">3:00</span>
                    </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);


    liAudioTag.addEventListener("loadeddata", () => {
          let audioDuration = liAudioTag.duration;
        let minute = Math.floor(audioDuration/60);
        let secound = Math.floor(audioDuration % 60);
        if (secound < 10) {
            secound = `0${secound}`;
        }
        liAudioDuration.innerText = `${minute}:${secound}`;
        liAudioDuration.setAttribute("t-duration", `${minute}:${secound}`)
    })
    
}

const allLiTags = ulTag.querySelectorAll("li");
function playingnow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
        allLiTags[j].classList.add("playing");
        audioTag.innerText = "Playing now";
    }



    allLiTags[j].setAttribute("onclick", "clicked(this)");
    
}

}
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadmusic(musicIndex);
    playMusic();
    playingnow();
}