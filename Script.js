
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
      songs.push(element.href);
    }
  }
   return songs
}
 
getSongs()

//here the promise is pending so for that we can do this and get the list of all songs
async function main() {
    let songs = await getSongs()
    console.log(songs)

    //play the first song
    var audio = new Audio(songs[0]);
    audio.play();
}
main()
