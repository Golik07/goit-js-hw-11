import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38724681-aa89fd36fe8a2bf001dfd83f3';

export const value = async (value, page) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: value,
        page: page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '40',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
