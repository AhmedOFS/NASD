/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useRef, useState } from 'react';
import { Provider } from "react-redux";
import store from "../store/store";
import Apps from "./home";


const HomeWrapper = () => {


  return (
    <Provider store={store}>
      <Apps /> 
    </Provider>
  )
}

export default HomeWrapper;
 