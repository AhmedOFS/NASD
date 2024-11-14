import axios, { AxiosError } from 'axios';
import store from './store/store';
import { searchFail,searchSuccess,SetQuery } from './store/searchSlice';
const apiClient = axios.create({
  baseURL: 'https://api.polygon.io/v3/reference',
  timeout: 5000,
});

apiClient.interceptors.response.use(
  res => {
    console.log(res.data.json);
    store.dispatch(searchSuccess());
    return res;
  },
  async (error) => {
    console.log(error)
    console.log("failed and retrying")
    store.dispatch(searchFail());
    const config = error.config;
    if (!config || config.__retryCount >= 9 || (error as AxiosError)?.response?.status != 429) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;

    // Add a delay before retrying
    await new Promise((resolve) => setTimeout(resolve, 10000));

    return apiClient(config);
  }
);


const searchClient = axios.create({
  baseURL: 'https://api.polygon.io/v3/reference',
  timeout: 5000,
});

searchClient.interceptors.response.use(

  res => {
    console.log(res.data.json);
    store.dispatch(searchSuccess());
    return res;
  },
  async (error) => {
    store.dispatch(searchFail());
    console.log(error)
    console.log("failed and retrying")
    const config = error.config;
    const query=store.getState().Searchapi.currentQuery
     if(config.url!==`https://api.polygon.io/v3/reference/tickers/${query}`){
      console.log("query updated")
      return Promise.reject(error);
     }
    if (!config || config.__retryCount >= 9 || (error as AxiosError)?.response?.status != 429) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;

    // Add a delay before retrying
    await new Promise((resolve) => setTimeout(resolve, 10000));

    return searchClient(config);
  }
);







const imageClient = axios.create({
    baseURL: '',
    timeout: 5000,
  });

  imageClient.interceptors.response.use(
    response => response,
    async (error) => {
      console.log(error)
      console.log("failed and retrying")
      const config = error.config;
      if (!config || config.__retryCount >= 9) {
        return Promise.reject(error);
      }
  
      config.__retryCount = config.__retryCount || 0;
      config.__retryCount += 1;
  
      // Add a delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 10000));
  
      return apiClient(config);
    }
  );

export default {imageClient,apiClient};
