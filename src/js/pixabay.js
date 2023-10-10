const axios = require('axios');

const apiKey = '39901621 - 58ed13b7b77a8b199e2835a43';
const BASE_URL = 'https://pixabay.com/api/';
const searchQuery = '';
const imageType = '';
const category = '';


function fetchImages(searchQuery, imageType, category) {
    const apiUrl = `${BASE_URL}?key=${apiKey}&q=${searchQuery}&image_type=${imageType}&category=${category}`;
    return axios
    .get(apiUrl)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`Помилка запиту: ${response.statusText}`);
      }
      return response.data;
    })
    .catch(error => {
      throw new Error(`Помилка запиту: ${error.message}`);
    });
}


fetchImages(searchQuery, imageType, category)
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error.message);
  });