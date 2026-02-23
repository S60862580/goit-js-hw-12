// HTTP serach
import axios from 'axios';

const gallery = document.querySelector('.gallery');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '54694924-0cbff3df35e5124e95f47eab6';
export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    PER_PAGE: 15,
    page: page,
  };
  const response = await axios.get(BASE_URL, { params });

  return response.data;
}
