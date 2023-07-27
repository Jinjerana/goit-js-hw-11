import SimpleLightbox from 'simplelightbox';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './services/api';
import { createMarkup } from './templates/card';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: `alt`,
  captionDelay: 250,
});
let page = 1;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoader);

async function onFormSubmit(evt) {
  try {
    evt.preventDefault();

    // searchImage = form.elements.searchQuery.value.trim();
    let name = document.getElementsByName('searchQuery')[0];
    let searchImage = name.value;

    if (searchImage === '') {
      Report.warning('You enter invalid Input. Try again.');
      return;
    }
    loadMoreBtn.hidden = true;

    const { hits, totalHits } = await fetchImages(searchImage);

    if (totalHits) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } else {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }

    gallery.innerHTML = createMarkup(hits);
    lightbox.refresh();

    if (totalHits > hits.length) {
      loadMoreBtn.hidden = false;
    }

    evt.target.reset();
  } catch (error) {
    console.log(error);
    Report.failure();
  }
}

async function onLoader() {
  try {
    page += 1;

    let name = document.getElementsByName('searchQuery')[0];
    let searchImage = name.value;

    const { hits, totalHits } = await fetchImages(searchImage, page);

    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    lightbox.refresh();

    if (page * 40 >= totalHits) {
      loadMoreBtn.hidden = true;
      Report.failure('You reached the end of search');
    }
  } catch (error) {
    console.log(error);
  }
}


