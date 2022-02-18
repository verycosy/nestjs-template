import axios from 'axios';

export const iamportRequest = axios.create({
  url: 'https://api.iamport.kr',
});
