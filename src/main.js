import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  hideLoadMoreButton,
  showLoadMoreButton,
} from './js/render-functions';

let page = 1;
let currentQuery = '';
let totalHits = 0;
const PER_PAGE = 15;

// кнопка SEARCH
const form = document.querySelector('.form');

form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();

  const query = event.target.elements['search-text'].value.trim();

  if (query === '') {
    iziToast.warning({
      message: 'Please enter a search query!',
    });
    return;
  }
  currentQuery = query;
  page = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();

      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch {
    error;
  }
}

//  кнопка  LOAD MORE
const onLoad = document.querySelector('.load-more');
onLoad.addEventListener('click', onLoadMore);
async function onLoadMore() {
  page++;
  hideLoadMoreButton();
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page);

    createGallery(data.hits);
    smoothScroll();
    if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();

      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Try again later.',
    });
    console.log(error);
  } finally {
    hideLoader();
  }
}

// скролінг
// getBoundingClientRect()
// window.scrollBy();
const gallery = document.querySelector('.gallery');
function smoothScroll() {
  const firstCard = gallery.firstElementChild;

  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
