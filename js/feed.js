var carouselInner = document.querySelector('#carousel-inner');
var carouselIndicators = document.querySelector('#carousel-indicators');


// Cargo de la base de datos un json con los datos de los audios
var url = 'https://radiotata-46ac2-default-rtdb.europe-west1.firebasedatabase.app/audios.json';
var networkDataReceived = false;
var playlist = [];
var sizes = [96, 128, 192, 256, 384, 512];


function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}



fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    var audioArray = [];
    var artwork = [];
    for (var key in data) {
      audioArray.push(data[key]);
    }
    console.log('Data complete', data);
    return delay(2600).then(function() {
      updateAudioSlides(audioArray, loadFirstAudio);
    });
  })
  .then(function() {
    loadFirstAudio();
  });


function deleteAudioSlides() {
  while(carouselInner.hasChildNodes()) {
    carouselInner.removeChild(carouselInner.lastChild);
  }
}


function addAudioSlide(data, i) {
  
  var artwork = [];
  for (var j = 0; j < sizes.length; j++) {
    artwork[j] = {
      src: './artwork/' + sizes[j] + 'x' + sizes[j] + '/' + data.id + '.png',
      sizes: sizes[j] + "x" + sizes[j],
      type: 'image/png'
    };
  }
  data.artwork = artwork;
  
  
  songs.push(data.id);
  playlist.push(data);
  console.log('Playlist', playlist);  
  

  var carouselItem = document.createElement('div');
  if (i === 0) {
    carouselItem.className = 'carousel-item h-100 feed active';
  } else {
    carouselItem.className = 'carousel-item h-100 feed';
  }
  var itemImage = document.createElement('img');
  itemImage.className = 'd-block w-100 h-100 object-fit-cover rounded-4';
  itemImage.src = '/images/' + data.id + '.png';
  itemImage.alt = '...';
  carouselItem.appendChild(itemImage);
  var itemCaption = document.createElement('div');
  itemCaption.className = 'carousel-caption d-block';
  var itemTitle = document.createElement('h2');
  itemTitle.textContent = data.title;
  itemCaption.appendChild(itemTitle);
  var itemDescription = document.createElement('p');
  itemDescription.className = 'audio-description';
  itemDescription.textContent = data.description;
  itemCaption.appendChild(itemDescription);
  carouselItem.appendChild(itemCaption);
  carouselInner.appendChild(carouselItem);
  var carouselButton = document.createElement('button');
  carouselButton.setAttribute('data-bs-target', '#carouselAudio');
  carouselButton.setAttribute('data-bs-slide-to', i);
  carouselButton.setAttribute('aria-label', 'Audio '+ i+1);
  if (i === 0) {
    carouselButton.className = 'active';
    carouselButton.setAttribute('aria-current', 'true');
  }
  carouselIndicators.appendChild(carouselButton);
}

function updateAudioSlides(data) {
  var url = 'https://radiotata-46ac2-default-rtdb.europe-west1.firebasedatabase.app/audios.json';
  caches.open('precache-v1')
    .then(function(cache) {
      cache.add(url);
    });

  var active = false;
  deleteAudioSlides();
  for (var i = 0; i < data.length; i++) {
    addAudioSlide(data[i], i);
  }
}








fetch('http://127.0.0.1:5500/audio/am003.mp3').then((data => console.log('Episodio descargado...')))
