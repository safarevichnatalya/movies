const API_KEY = 'd7fbd59667ca505faf991de663071fa5';
const BASE_URL = '/list/8210775';
const CREDITS_URLS = '/movie/718930/credits';
const GENRE_URL = '/genre/movie/list';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const TV_URL = '/tv/all';
const POPULAR_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=d7fbd59667ca505faf991de663071fa5&language=en-US&page=1';


function requstFillms(method, url) {
    return fetch(`https://api.themoviedb.org/3${url}?api_key=${API_KEY}`, {
        method: method,
        headers: {
            'Authorization': 'Bearer d7fbd59667ca505faf991de663071fa5',
            "Content-Type": "application/json",
        }
    });
}

function reustPopularFillms(method, url) {
  
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",

        }
    });
}

reustPopularFillms("GET", POPULAR_URL).then(data => data.json()).then(e => {
    render(e.results, '.top-movies')
});

let result = requstFillms("GET", BASE_URL)
    .then((result) => result.json())
    .then(function (data) {
        return data;

    }).then(rusult => {
        let genreRusult = render(rusult.items, '.last-watch ')
        return rusult;
    })
// отрисовка всех получаемых фильмов
function render(films, className) {
    let filmsItems = films.slice(0, 6);
    let result = filmsItems.map(item => {
        let markup = `
    <div class="movies__item" data-id="${item.id}" data-title="${item.title}">
    <img  class="movies__bg" src="${IMG_URL + item.poster_path}" alt="">

    <div class="movies__info">
      <p class="desc">
        <span class="time">
            ${item.release_date}
        </span>
        <span class="views">
         ${item.vote_average} rating
        </span>
      </p>
      <p class="name-movie">
       ${item.title}
      </p>
    </div>
  </div> `
        document.querySelector(`${className} .movies__row`).insertAdjacentHTML('beforeend', markup);
    });
    return result

}

function getTrailers(url) {
    return fetch(`https://api.themoviedb.org/3/movie/${url}/videos?api_key=d7fbd59667ca505faf991de663071fa5&language=en-US`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",

        }
    })
}

let trailers_url = '';
let trailrsTitle = '';

let movies_id = document.querySelectorAll('.movies');
let popupTitle = document.querySelector('.popup__title');
let desc = document.querySelector(`.popup__desc`);
let popup = document.querySelector(`.popup`);
let html_container = document.querySelector(`html`);

let btn_close = document.querySelectorAll('.btn-close');
btn_close.forEach(items => {
    items.addEventListener('click', function (e) {
        popup.classList.remove('slide');
        html_container.style.overflow = 'scroll';
        // video trailer
        wodalWindow.classList.remove('show');

        video_trailer.setAttribute('src', '');
    });

})

// главный трейлер 
let trailersItems = document.querySelector('.trailers__row');
let wodalWindow = document.querySelector('.modal-window');
let video_trailer = document.querySelector('.video-trailer');

trailersItems.addEventListener('click', function (e) {
    wodalWindow.classList.add('show');
    html_container.style.overflow = 'hidden';
    if (e.target.classList == 'trailers__item trailers__item_first') {
        video_trailer.setAttribute('src', 'https://www.youtube.com/embed/ByXuk9QqQkk');

    } else if (e.target.classList == 'trailers__item trailers__item_second') {
        video_trailer.setAttribute('src', 'https://www.youtube.com/embed/CHCUkXUPkFM');

    } else if (e.target.classList == 'trailers__item trailers__item_third') {
        video_trailer.setAttribute('src', 'https://www.youtube.com/embed/ffnNmR6lBKY');
    } else if (e.target.classList == 'trailers__item trailers__item_fourth') {
        video_trailer.setAttribute('src', 'https://www.youtube.com/embed/iwROgK94zcM');
    }
});



// получение информации по конкретному фильму
movies_id.forEach(e => {

    e.addEventListener('click', function (event) {
        
        person.innerHTML = '';
        desc.innerHTML = '';
        html_container.style.overflow = 'hidden';

        let perentsElement = event.target.parentElement;
        if (perentsElement.classList == 'movies__item') {
            let id = perentsElement.dataset.id;

            let title = perentsElement.dataset.title;
            popupTitle.textContent = title;
            trailers_url = id;



            // отправляем запрос на сервер 
            getTrailers(trailers_url).then(d => d.json()).then(trailers => {
                pastLink(trailers.results);
            });
            getAdditionalinfo(id)
                .then(response => response.json())
                .then(e => {

                    let markup = `
                    <p class="popup__displ">
                    ${e.overview}</p>
       `
                    desc.insertAdjacentHTML('beforeend', markup);
                })
            requstFillms("GET", `/movie/${trailers_url}/credits`)
                .then(datas => datas.json())
                .then(response =>
                    // console.log(response.cast)
                    actors(response.cast)
                );
            popup.classList.add('slide');
        }
    })
});


function getAdditionalinfo(id) {

    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=d7fbd59667ca505faf991de663071fa5&language=en-US`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
}


let person = document.querySelector(`.popup__persons`);
let video = document.querySelector('.video');
// загружаем и выводим видео
function pastLink(trailers) {
    if (trailers.length == 0) {
        // console.log('trailers');
    }
    trailers.map(item => {
        let key = item.key;
        video.setAttribute('src', `https://www.youtube.com/embed/${key}`)
    })
}
// актеры
function actors(value) {
    let actorsDesc = value.slice(0, 6);
    actorsDesc.map(item => {
        if (item.profile_path == null) {
            return;
        }
        let markup = `
        <div class="popup__person">
        <img class="popup__img" src="https://image.tmdb.org/t/p/w500/${item.profile_path}" alt="">
        <p class="person">
        ${item.name}</p>
        <p class="person__character">
        ${item.character}</p>
      </div>
       `
        person.insertAdjacentHTML('beforeend', markup);
    })
}

// получаем сериал
function getSerialsUrl(name) {
    return fetch(`https://api.themoviedb.org/3/tv/66732/season/4/${name}?api_key=${API_KEY}&language=en-US`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
}
getSerialsUrl(`videos`)
    .then(data => data.json())
    .then(e => createSerials(e));


// выводим сериалы в dom
let serialsUrl = document.querySelector('.serails-video');

function createSerials(value) {
    let prewiev = value.results.slice(0, 1);
    prewiev.map(val => {
        serialsUrl.setAttribute('src', `https://www.youtube.com/embed/${val.key}`)
    });
    let count = 0;
    let values = value.results.slice(3, 6);
    values.map(item => {
        count++;
        let markup = `
        <div class="serails__item" data-key="${item.key}" data-id="${item.id}">
        <div class="serails__img serails__img_${count}"></div>
       <div class="serails__info">
          <p class="serails__episode">
            Episode ${count}
          </p>
          <p class="serails__name">
    ${item.name}
          </p>
        </div>
      </div>
       `
        console.log(item)
        document.querySelector('.serails__row').insertAdjacentHTML('beforeend', markup);
    })
}

// менем путь сериала
let serialsItems = document.querySelector('.serails__row');
serialsItems.addEventListener('click', function (e) {
    let parentsSerials = e.target.closest('.serails__item')
    if (parentsSerials) {
        let key = parentsSerials.dataset.key;
        serialsUrl.setAttribute('src', `https://www.youtube.com/embed/${key}`);
    } else {
        return
    }
});