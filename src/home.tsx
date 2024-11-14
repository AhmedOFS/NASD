import React, { useEffect, useRef, useState } from 'react';
import type {PropsWithChildren} from 'react';
import axios from 'axios';

import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



import store, { useAppDispatch, useAppSelector } from '../store/store';
import { SetQuery } from '../store/searchSlice';

import { fetchNext, fetchSearch, fetchStocks, returnStocks, SetDisplay } from '../store/stocksSlice';
import StockItem from './stockItem';








////////////////////////////////////////////////////////////////////////////////////////////





function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

const stocks = useAppSelector(state => state.Stocksapi.displayStocks);
  const dispatch = useAppDispatch()

const stateQuery = useAppSelector(state => state.Searchapi.currentQuery);
const searchfail = useAppSelector(state => state.Searchapi.failure);
const stocksState = useAppSelector(state => state.Stocksapi.stocks);
const stocksdisplay = useAppSelector(state => state.Stocksapi.displayStocks);
const nextState=useAppSelector(state => state.Stocksapi.next);
const [query, setQuery]= useState<String>("");
const [isTyping, setIsTyping] = useState(false);
const typingTimeout = useRef<NodeJS.Timeout | null>(null);


const searchFunc=async(input: string)=>{
  console.log("calling search")
  dispatch(SetQuery({query:input}))
  console.log("query updated")

  dispatch(fetchSearch())
}

const handleTextChange = (input: string) => {

  setIsTyping(true);

  // Clear the previous timeout
  if (typingTimeout.current) {

    clearTimeout(typingTimeout.current);
  }


  typingTimeout.current = setTimeout(() => {
    setIsTyping(false); 
    dispatch(SetQuery({query:input}))
    console.log("typing is false")
    if(input !== ""){
    
      searchFunc(input.toUpperCase())
    }else{
dispatch(returnStocks())

    }

  }, 500); 
};




  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [error, setError] = useState<string | null>(null);
 

  useEffect(() => {
    dispatch(fetchStocks());

    SplashScreen.hide();
   
        

   
   // fetchstocks()
  
  }, [dispatch]);

 
 

  return (
   
    <View style={styles.container}>
    <Text style={styles.header}>Nasdaq</Text>
    <TextInput   onChangeText={handleTextChange} style={styles.searchBar} placeholder="Search for stocks" placeholderTextColor="#888" />
    {  searchfail?  <ActivityIndicator  size="large" color='#1e1e1e'  /> : <></>}
    <FlatList
      data={stocksdisplay}
      onEndReached={stateQuery!==""? ()=>{}: ()=>{dispatch(fetchNext())
        dispatch(returnStocks())
      }}
      renderItem={({ item }) => {
  
        return(  
         
  <StockItem item={item }/>
  
       );
        }}
      keyExtractor={(item) => item.name}
      numColumns={2}
      contentContainerStyle={styles.grid}
    />
  </View>

  );
}


const styles = StyleSheet.create({

  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#23263A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    color: 'white',
  },
  grid: {
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: '#1F2130',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  stockCard: {
    aspectRatio: 1,  
    backgroundColor: '#23263A',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    margin: 10,
    width:`${44}%`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  symbol: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 10,
    color: '#888',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default App;
