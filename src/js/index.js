import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const apiKey = '39901621-58ed13b7b77a8b199e2835a43';
const BASE_URL = 'https://pixabay.com/api/';

const ref = {
  select: document.querySelector('.target-js'),   
  loadMoreButton: document.querySelector('.load-more'),

}

const { select,loadMoreButton,endMessage } = ref;

let searchForm = document.querySelector('.search-form');
let galleryList = document.querySelector('.gallery'); 
let orientation = 'horizontal';
let safesearch = 'true';
let image_type = 'photo';
let currentPage = 1;
let lightbox; 



searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = searchForm.elements.searchQuery.value;
  clearGallery();
  await loadMoreImages(searchQuery);
});


async function fetchImages(searchQuery) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${apiKey}&q=${searchQuery}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${currentPage}&per_page=40`);
    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      currentPage++;
   
      return images;
    }
  } catch (error) {
    console.error('An error occurred while fetching images:', error);
    return [];
  }
}

function clearGallery() {
  galleryList.innerHTML = '';
  currentPage = 1;
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2, 
    behavior: "smooth",
  });
}

function displayImages(images) {
  const galleryMarkup = createGalleryMarkup(images);
  galleryList.innerHTML += galleryMarkup;

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: "alt",
    });
  } else {
    lightbox.refresh();
  }

  smoothScroll();
}

function formatAltText(likes, views, comments, downloads) {
  return `Likes: ${likes} Views: ${views} Comments: ${comments} Downloads: ${downloads}`;
}


const createGalleryMarkup = galleryItems => {
  return galleryItems
    .map(({ previewURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      const altText = formatAltText(likes, views, comments, downloads);
      return `
        <div class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}" target="_blank">
            <img
              class="gallery__image"
              src="${previewURL}"
              data-source="${largeImageURL}"
             loading="lazy"/>
              <p class="image_description">${altText}</p>
          </a>
        </div>
      `;
    })
    .join('');
};

searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = searchForm.elements.searchQuery.value;
  clearGallery();
  const images = await fetchImages(searchQuery);
  displayImages(images);
});


