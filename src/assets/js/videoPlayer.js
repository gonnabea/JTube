const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const expandBtn = document.getElementById("jsExpandButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const volumeRange = document.getElementById("jsVolume");
const setPlayTime = document.getElementById("jsSetPlaytime");

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    });
};

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function exitExpand() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullscreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    expandBtn.innerHTML = '<i class="fas fa-expand"></i>';
    expandBtn.removeEventListener("click", exitExpand);
    expandBtn.addEventListener("click", handleExpandClick);
}
function handleExpandClick() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozCancelFullScreen) {
        videoContainer.mozRequestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msrequestFullscreen) {
        videoContainer.msrequestFullscreen();
    }
    expandBtn.innerHTML = '<i class="fas fa-compress"></i>';
    expandBtn.removeEventListener("click", handleExpandClick);
    expandBtn.addEventListener("click", exitExpand);
}


function handleVolumeClick() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume;
    } else {
        videoPlayer.muted = true;
        volumeRange.value = 0;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'
    }
}

const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};


function getCurrentTime() {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
}

function setTotalTime() {
    const totalTimeString = formatDate(videoPlayer.duration);
    totalTime.innerHTML = totalTimeString;
    setInterval(getCurrentTime, 1000);
}

function handleEnded() {
    registerView();
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
    const {
        target: { value }
    } = event;
    videoPlayer.volume = value;
    if (value >= 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value >= 0.2) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
}

function forInitializeTime() {
    setPlayTime.value = videoPlayer.currentTime / videoPlayer.duration;
}
function controlPlayTime(event) {
    const {
        target: { value }
    } = event;
    const timeSet = videoPlayer.duration * value;
    videoPlayer.currentTime = timeSet;
}

function init() {
    videoPlayer.volume = 0.5;
    setInterval(forInitializeTime, 1000);
    playBtn.addEventListener("click", handlePlayClick);
    expandBtn.addEventListener("click", handleExpandClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);
    setPlayTime.addEventListener("input", controlPlayTime);
}

if (videoContainer) {
    init();
}

