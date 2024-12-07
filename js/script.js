console.log("Let's Start the Java Script")

let currentsong = new Audio();

let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }


    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>     <img  src="img/music.svg" alt="">
    <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Amit</div>
                            </div>
                            <div class="playnow">
                                <span>Play</span>
                                <img  src="img/playbtn.svg" alt="playButton">
                                
                            </div>
                            <audio class="audiofile" src="img/song.mp3"></audio>
                            </li>`;


    }


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            Playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs

}

const Playmusic = (track, pause = false) => {

    currentsong.src = `/${currFolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0])
            let a = await fetch(`/songs/${folder}/info.json`)

            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" height="45"
            viewBox="0 0 64 64" width="45">
            <g stroke-miterlimit="10" stroke-width="2">
            <circle cx="32" cy="32" r="30" fill="#0f0" stroke="#0f0" />
                                    <!-- Outer circle green and background -->
                                    <path d="m24 18 18 14-18 14z" stroke-linejoin="bevel" fill="#000" />
                                    <!-- Larger inner play button black -->
                                    </g>
                                    </svg>
                                    </div>
                                    <img src="/songs/${folder}/cover.jpg" alt="">
                                    <h2>${response.title}</h2>
                                    <p>${response.description}</p>
                                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            Playmusic(songs[0])
        })
    })
}




async function main() {

    await getSongs("songs/cs")
    Playmusic(songs[0], true)


    displayAlbums()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/playbtn.svg"
        }
    })

     // Handling Seekbar
    // Add an event listener for when a new song starts playing
currentsong.addEventListener("play", () => {
    // Reset the current time and seekbar
    document.querySelector(".songtime").innerHTML = `0:00/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector("#seekBar").value = 0;
});

// Listen to the time update to sync the seekbar with the song time
currentsong.addEventListener("timeupdate", () => {
    // Update song time display
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
    
    // Update seekbar progress (input element)
    const percentPlayed = (currentsong.currentTime / currentsong.duration) * 100;
    document.querySelector("#seekBar").value = percentPlayed;
});

// Handle clicking on the seekbar to seek to a new time
document.querySelector(".seekbar").addEventListener("click", e => {
    const seekBar = document.querySelector("#seekBar");

    // Calculate the clicked position in percentage
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    // Update the song position and the seekbar value
    seekBar.value = percent;
    currentsong.currentTime = (currentsong.duration * percent) / 100;
});

// Optional: If you want to allow dragging the range input to seek as well
document.querySelector("#seekBar").addEventListener("input", e => {
    const percent = e.target.value;
    currentsong.currentTime = (currentsong.duration * percent) / 100;
});




    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-112%"
    })
    previous.addEventListener("click", () => {
        console.log('Previous clicked');

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            Playmusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        console.log('Next clicked');

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            Playmusic(songs[index + 1])
        }

    })


    document.querySelector(".range").getElementsByTagName("input")[0].value = 100; // Set default value to 100
    currentsong.volume = 1; // Set default volume to 100%


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volunme to", e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
        if(currentsong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }
        if(currentsong.volume == 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/volume.svg", "img/mute.svg") 
        }
    })
    document.querySelector(".volume>img").addEventListener("click", e => { 
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentsong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })

}

main()