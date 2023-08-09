import { value } from './cat-api.js';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);

btn.style.display = 'none';

let page = 1;
let searchQuery = '';

btn.style;

function onSearch(e) {
  e.preventDefault();
  gallery.innerHTML = '';

  searchQuery = e.currentTarget.elements.searchQuery.value;
  Notiflix.Loading.standard();

  if (searchQuery === '') {
    Notiflix.Notify.failure('Qui timide rogat docet negare');
    Notiflix.Loading.remove();
    btn.style.display = 'none';
    return;
  }

  value(searchQuery, page)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        Notiflix.Loading.remove();
      } else {
        Notiflix.Loading.remove();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderCards(data.hits);
        page = 1;
        btn.style.display = 'flex';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        `❌ Oops! Something went wrong! Try reloading the page!`
      );
      Notiflix.Loading.remove();
    })
    .finally(() => {
      form.reset();
    });
}

function renderCards(arr) {
  if (!gallery) {
    return;
  }

  const markup = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads, user }) => {
      return `
        <div class="card">
            <div class="card-header">
      <p >${user}</p>
      <p >${views} views</p>
    </div>
            <img src="${webformatURL}" alt="${tags}"   height="300" width="500" />
            <div class="info">
                <p >
                    Likes<b>${likes}</b>
                </p>
                <p >
                    Downloads<b>${downloads}</b>
                </p>
                <p >
                    Comments<b>${comments}</b>
                </p>
            </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

btn.addEventListener('click', loadMore);

function loadMore() {
  Notiflix.Loading.standard();
  page += 1;
  value(searchQuery, page)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        Notiflix.Loading.remove();
      } else {
        Notiflix.Loading.remove();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderCards(data.hits);

        btn.style.display = 'flex';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(
        `❌ Oops! Something went wrong! Try reloading the page!`
      );
      Notiflix.Loading.remove();
    })
    .finally(() => {
      form.reset();
    });
}
