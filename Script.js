
//Global variable for changing the current song
let currentSong = new Audio();

//The getSongs function do's the work of fetching the songs from the local directory and return the songs.

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  //Creating the empty array
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split( "/Songs/")[1])
    }
  }
   return songs
}
 
//creating the function to play the song

const playMusic = (track)=>{
   //let audio = new Audio("/songs/" + track)
   
   //here we do not making the new audio ,but we changing the current source and then we play the audio
   currentSong.src= "/songs/" + track
   currentSong.play()
   play.src = "pause.svg" //firstly it is paused when the song is playing
}

//here the promise is pending so for that we can do this and get the list of all songs
async function main() {
   
  
  //get the list of the song
  let songs = await getSongs()
    

    //put the songs in the your library in the ul tag & show all the songs in the playlist

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li><img class="invert" src="music.svg" alt="Music">
                             <div class="info">
                               <div>${song.replaceAll("%20" , " ")}</div>
                               <div>Vikrant</div>
                             </div>
                              <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="Play">
                              </div> </li>`;
    }

    
    // Attached the event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
      
      e.addEventListener("click" , element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML) //Give me the first element of the info div
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()) //Function to play the song & .trim() to remove the spaces from the song for the  playMusic function
      })
      
    })

    //Attached an event listener to play , next and previous
    play.addEventListener("click" , ()=>{

      if(currentSong.paused){
        currentSong.play()
        //Adding the SVG's to play and pause
        play.src = "pause.svg"
      }
      else{
        currentSong.pause()
        play.src= "play.svg"
      }
    })


    
}
main()
