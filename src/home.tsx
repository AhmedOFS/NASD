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


import Clients from '../apiManagement';
import store, { useAppDispatch, useAppSelector } from '../store/store';
import { SetQuery } from '../store/searchSlice';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fetchNext, fetchSearch, fetchStocks, returnStocks, SetDisplay } from '../store/stocksSlice';








////////////////////////////////////////////////////////////////////////////////////////////



  interface stockprops {


    item: Stock,
    availablity: Boolean
  }


  const StockItem : React.FC< stockprops>  =(stock)=> {

    const [useable, setUseable] = useState<Boolean>(stock.availablity);

    

    const [loading, setLoading] = useState<boolean>(true);


    const [urls, setUrl] = useState<string>("place");
    const [image, setImage] = useState<any>();
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {

      const fetchImage = async () => {
        try{
          setError(null); // Clear previous error, if any
        
            const response =  await Clients.imageClient.get(`/tickers/${stock.item.symbol}` );
            if (response.status === 429) { // 429 is the HTTP status code for rate limiting
              throw new Error("Rate limit exceeded");
            }
      
      
            const data = await response.data;
            
    
            if(data){
              console.log("data accepted and is", data)
        if(data.results.branding){
    
              setUrl(`${data.results.branding.icon_url}?apiKey=OvTM4lSkLMBfIezG360eiEwaGuUZlJR2`);
              console.log("setting URL")
              setUseable(true)
        }else{
          console.log("no url available")
        }
            }else{
              console.log("failure to load data")
            }
               
          
        } catch (err: any) {
          console.log(err)
          // Retry after 1 minute if an error occurs

          }}

   
         // fetchImage();
   
   
  
     
    }, []);




 return  ( <View style={styles.stockCard}>
    <View style={[styles.iconContainer] as StyleProp<ViewStyle>}>
    { urls=="place" ?<Text>{  stock.item.symbol.substring(0,2)} </Text>:   <Image
    source={{ uri: urls}}
    style={styles.image}
    onError={()=>{
      console.log(`Retrying image load`);
       

  
    }}
  //  onLoadEnd={() => {}}

  />}
    </View>
    <Text style={styles.symbol}>{stock.item.symbol}</Text>
    <Text style={styles.name}>{stock.item.name}</Text>
  </View>)
;
  }

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
         
  <StockItem item={item } availablity={true} />
  
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
    backgroundColor: '#1e1e1e',
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
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  stockCard: {
    aspectRatio: 1,  
    backgroundColor: '#1e1e1e',
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
