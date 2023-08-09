import { value } from './cat-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);

btn.style.display = 'none';

let page = 1;
const per_page = 40;
let searchQuery = '';

let pre_searchQuery = '';

async function onSearch(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.searchQuery.value;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Qui timide rogat docet negare');
    Notiflix.Loading.remove();

    btn.style.display = 'none';
    return;
  }
  if (pre_searchQuery === searchQuery) {
    return Notiflix.Loading.remove();
  }
  pre_searchQuery = searchQuery;

  try {
    const data = await value(searchQuery, page);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      Notiflix.Loading.remove();
      btn.style.display = 'none';
      return;
    }
    Notiflix.Loading.standard();
    gallery.innerHTML = '';
    Notiflix.Loading.remove();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderCards(data.hits);
    btn.style.display = 'flex';
    if (data.totalHits <= per_page) {
      btn.style.display = 'none';
      Notiflix.Notify.failure(
        "Were sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure(
      `❌ Oops! Something went wrong! Try reloading the page!`
    );
    Notiflix.Loading.remove();
  }
}

function renderCards(arr) {
  if (!gallery) {
    return;
  }

  const markup = arr
    .map(
      ({
        webformatURL,
        tags,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        user,
      }) => {
        return `<a href="${largeImageURL}"  >
        <div class="photo-card">
            <div class="card-header">
      <p >${user}</p>
      <p >${views} views</p>
    </div>
            <img src="${webformatURL}" alt="${tags}" loading="lazy"  height="300" width="500" />
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
</div></a>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

btn.addEventListener('click', loadMore);

async function loadMore() {
  try {
    Notiflix.Loading.standard();
    page += 1;
    const data = await value(searchQuery, page);
    if (data.hits.length === 0) {
      Notiflix.Loading.remove();
      btn.style.display = 'none';
      return;
    }
    Notiflix.Loading.remove();
    renderCards(data.hits);
    const total_pages = Math.ceil(data.totalHits / per_page);
    if (page < total_pages) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
      Notiflix.Notify.failure(
        "Were sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure(
      `❌ Oops! Something went wrong! Try reloading the page!`
    );
    Notiflix.Loading.remove();
  }
}
