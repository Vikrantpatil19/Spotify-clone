
//Global variable for changing the current song
let currentSong = new Audio();
let songs;
let currFolder;

//By using the chatgpt - write the function that takes the seconds and convert it into the formate of seconds/minutes
// Function to convert seconds to minutes and seconds format
function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


//The getSongs function do's the work of fetching the songs from the local directory and return the songs.
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`); 
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
      songs.push(element.href.split( `${folder}`)[1])
    }
  }

     //put the songs in the your library in the ul tag & show all the songs in the playlist

     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
     songUL.innerHTML = " "
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

   return songs
}
 
//creating the function to play the song

const playMusic = (track, pause=false)=>{
   //let audio = new Audio("/songs/" + track)
   
   //here we do not making the new audio ,but we changing the current source and then we play the audio
   currentSong.src= `${currFolder}` + track
   if(!pause){
    currentSong.play()
    play.src = "pause.svg" //firstly it is paused when the song is playing

   }
   
   
   //to display the song info and song time
   document.querySelector(".songInfo").innerHTML = decodeURI(track)
   document.querySelector(".songTime").innerHTML = "00:00/00:00"

   
}

//here the promise is pending so for that we can do this and get the list of all songs
async function main() {
   
  
  //get the list of the song
  songs = await getSongs("songs/ncs")
  playMusic(songs[0] , true)
    

   

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

    //Time update event
    currentSong.addEventListener("timeupdate" , () =>{
      console.log(currentSong.currentTime , currentSong.duration);
      document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.
        currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
      
      document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";

      //Adding the event listener to seek bar

      document.querySelector(".seekbar").addEventListener("click", e =>{

        let percent = (e.offsetX / e.target.getBoundingClientRect().width )*100 ;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
      })
       
     
    })

    //Add eventlistner to hamburger
    document.querySelector(".hambburger").addEventListener("click" , ()=>{
      document.querySelector(".left").style.left=0
    })

     //Add eventlistner to close the hamburger
     document.querySelector(".close").addEventListener("click" , ()=>{
      document.querySelector(".left").style.left="-120%"
    })

    //Add an event listener for the previous 
    previous.addEventListener("click" , ()=>{
      console.log("previous Clicked")
      console.log(currentSong)
      let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
      if((index-1) >= 0){
        playMusic(songs[index-1])
      }
    })
     
    //Add an event listener for the  next
    next.addEventListener("click" , ()=>{
      console.log("Next Clicked")

      let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
      if((index+1) < songs.length){
        playMusic(songs[index+1])
      }
      
    })

    //Add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
      console.log("setting volume to" , e.target.value, "/100")
      currentSong.volume = parseInt(e.target.value)/100
    })
    

    //Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
      console.log(e)
      e.addEventListener("click" , async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        
      })
    })



    
}
main()
