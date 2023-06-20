if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js")
      .then(res => console.log("SW Registrado"))
      .catch(err => console.log("Error al registrar SW", err))
  })
}

// Conexión a audioDB
const DB_NAME = 'audioDB';
const DB_VERSION = 1;

var request = indexedDB.open(DB_NAME, DB_VERSION);

request.onerror = function(event) {
  console.error('Error al abrir la base de datos');
};

request.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore('audio', { keyPath: 'id' });
};

request.onsuccess = function(event) {
  console.log('audioDB abierta correctamente');
  var db = event.target.result;
  db.close();
};




// Definicion de los controles de audio
const audioContainer = document.querySelector('.audio-container');
const playBtn = document.querySelector('#play');
const rBtn = document.querySelector('#prev');
const ffBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const cover = document.querySelector('#cover');
const positionDisplay = document.querySelector('#positionDisplay');


// Array con los nombres de las canciones
var songs = [];
let songIndex = 0;




// Cargar la primera cancion
function loadFirstAudio() {
  console.log("canciones " + songs);
  console.log("playlist " + playlist);

}





// Actualizar detalles de la cancion
function loadSong(song) {
  console.log('Cancion cargada', song);
  audio.src = `audio/${song}.mp3`;
  cover.src = `images/${song}.png`;
  
  caches.open('precache-v1')
    .then(function(cache) {
      cache.add(`audio/${song}.mp3`);
      cache.add(`images/${song}.png`);
    });

    

  var audioData = getAudioData(song, loadAudioCurrentTime);

}

// Funciones para reproducir, pausar, adelantar cancion
function playSong() {
    audio.src = 'audio/'+ playlist[songIndex].id + '.mp3';
    audio.play()
      .then(_ => updateMetadata())
      .catch(error => console.log(error));
    
  }

function pauseSong() {
  audioContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

function prevSong() {
  songIndex--;

  if(songIndex < 0) {
    songIndex = songs.length -1;
  }
  loadSong(songs[songIndex]);

  playSong();
}

function nextSong() {
  songIndex++;
  
  if(songIndex > songs.length -1) {
    songIndex = 0;
    
  }
  loadSong(songs[songIndex]);
  
  playSong();
}


function fastForwardAudio() {
  
  if (audio.currentTime + 10 > audio.duration) { 
    audio.currentTime = 0;
    pauseSong();
  } else {
     audio.currentTime += 10;
  }
  
}

function rewindAudio() {
  if (audio.currentTime - 10 < 0) {
    audio.currentTime = 0;
  } else {
    audio.currentTime -= 10;
  }
  
}

// let playlist = [{}];
// 


function updatePositionState() {
  if ('setPositionState' in navigator.mediaSession) {
    console.log('Updating position state...');
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: audio.currentTime
    });
  }
}


function updateMetadata() {

  console.log('Playing ' + playlist[songIndex] + ' track...');
  navigator.mediaSession.metadata = new MediaMetadata({
    title: playlist[songIndex].title,
    artist: playlist[songIndex].artist,
    album: playlist[songIndex].album,
    artwork: playlist[songIndex].artwork
  });
  console.log('Navigator', navigator.mediaSession.metadata);

  // Media is loaded, set the duration.
  updatePositionState();
}



// Crear listener para el boton de play/pause
playBtn.addEventListener('click', () => {
  const isPlaying = audioContainer.classList.contains('play');

  if(isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Listener para los botones de siguiente y anterior
ffBtn.addEventListener('click', fastForwardAudio);
rBtn.addEventListener('click', rewindAudio);

// initialize the variable to 0

var carouselPrev = document.querySelector('.carousel-control-prev');
var carouselNext = document.querySelector('.carousel-control-next');

carouselPrev.addEventListener('click', prevSong);
carouselNext.addEventListener('click', nextSong);




// Actualizar el progreso de la cancion
function updateProgress(e) {
  const { currentTime } = e.srcElement;
  
   // Verifico que el audio este cargado
   if (!isNaN(currentTime)) {
  
    idAudio = songs[songIndex];

    // Actualizo la posicion en audioDB
    saveAudioData(idAudio, currentTime);

    const date = new Date(currentTime * 1000);

    // Get the hours, minutes, and seconds from the Date object
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    // Format the time as H:M:S
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().slice(0,2).padStart(2, '0')}`;

    positionDisplay.innerHTML = timeString;
  }
}



audio.addEventListener('timeupdate', updateProgress);





// Funciones de IndexedDB





// Obtiene la posición de la canción de audioDB
function getAudioData(audio, callback) {
  var request = indexedDB.open('audioDB', 1);

  request.onerror = function(event) {
    console.error('Error abriendo audioDB');
    callback(0);
  };

  request.onsuccess = function(event) {
    console.log('Acceso a audioDB exitoso');
    var db = event.target.result;

    // Obtengo datos de la cancion
    var transaction = db.transaction(['audio'], 'readonly');
    var objectStore = transaction.objectStore('audio');
    var request = objectStore.get(audio);
    request.onsuccess = function(event) {
      if (request.result) {
        var currentTime = request.result.currentTime;
        callback(currentTime);
      } else {
        console.error('No hay información de la canción en audioDB');
        callback(0);
      }
      db.close();
    };
    request.onerror = function(event) {
      console.error('Error al obtener datos de audioDB');
      console.log(request.error);
      db.close();
      callback(0);
    };
  };
}

// Callback para saltar a la posicion extraida de audioDB
function loadAudioCurrentTime(currentTime) {
  audio.currentTime = currentTime;
}


// Guarda la posicion de la cancion en audioDB
function saveAudioData(audio, currentTime) {

    var request = indexedDB.open('audioDB', 1);

    request.onerror = function(event) {
      console.error('Error al abrir audioDB');
    };

    request.onsuccess = function(event) {
      console.log('audioDB abierto exiotosamente');
      var db = event.target.result;

      // Actualizo la posicion de la cancion
      var transaction = db.transaction(['audio'], 'readwrite');
      var objectStore = transaction.objectStore('audio');
      var data = { id: idAudio, currentTime: currentTime};
      var request = objectStore.put(data);
      request.onsuccess = function(event) {
        transaction.commit();
        db.close();
      };
      request.onerror = function(event) {
        console.error('Error al guardar la posición');
        console.log(request.error);
        transaction.abort();
        db.close();
      };
    };
  }

  navigator.mediaSession.setActionHandler('previoustrack', function() {
    console.log('> User clicked "Previous Track" icon.');
    songIndex = (songIndex - 1 + playlist.length) % playlist.length;
    playSong();
  });
  
  navigator.mediaSession.setActionHandler('nexttrack', function() {
    console.log('> User clicked "Next Track" icon.');
    songIndex = (songIndex + 1) % playlist.length;
    playSong();
  });