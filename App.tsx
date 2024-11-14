/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import type {PropsWithChildren} from 'react';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {
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
import ImageM from './imageM';

import Clients from './apiManagement';



interface Stock {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  color: string;
}
const apiKey="OvTM4lSkLMBfIezG360eiEwaGuUZlJR2"
const header={"Authorization" : `Bearer ${apiKey}`};



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
        
            const response =  await Clients.apiClient.get(`/tickers/${stock.item.symbol}`,  { headers:  header  } );
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

   
          //  fetchImage();
   
   
  
     
    }, []);

    useEffect(() => {
      if (urls!=="place") {
        checkImageLoad();
      }
    }, [urls]);
    const checkImageLoad = async () => {
      if (urls!=="place") {
        try {
          const response = await Clients.imageClient.get(urls, { responseType: 'arraybuffer' });
        const t: string=  response.headers['content-type'] 
        
          const imageBlob = new Blob([response.data]);
          setImage(URL.createObjectURL(imageBlob));
          setLoading(false); 
        } catch (error) {
          console.error(error);
     
        }
      }
    };

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
  const [stocks, setStocks] = useState<Stock[]>([]);
const [next, setNext]= useState<String>("");

const [query, setQuery]= useState<String>("");
const [isTyping, setIsTyping] = useState(false);
const typingTimeout = useRef<NodeJS.Timeout | null>(null);


const searchFunc=async(input: string)=>{
  console.log("calling search")
 const response=await Clients.apiClient.get(`/tickers/${input}`,  { headers:  header  } );
setQuery(input)
 const data = await response.data
 //setNext(data.next_url)
 //const stocksData: Stock[] 
      const id: string=data.results.name;
           const symbol =  data.results.ticker;
           const name=data.results.name;
           const icon="place"

//         console.log(icon)
   
    const color: string= 'white';
   
   
   
          ;

         setStocks( [{id,symbol,name, icon, color}]);

}

const handleTextChange = (input: string) => {

  setIsTyping(true);

  // Clear the previous timeout
  if (typingTimeout.current) {

    clearTimeout(typingTimeout.current);
  }


  typingTimeout.current = setTimeout(() => {
    setIsTyping(false); 
    setQuery(input);
    console.log("typing is false")
    if(input !== ""){
   
      searchFunc(input.toUpperCase())
    }else{
fetchStocks()
    }

  }, 500); 
};



const fetchStocks = async () => {
  console.log("fetching")
  try {

    const response = await Clients.apiClient.get('/tickers?active=true&limit=12&apiKey=OvTM4lSkLMBfIezG360eiEwaGuUZlJR2');
   
   // const response = await fetch('https://api.polygon.io/v3/reference/tickers?active=true&limit=4&apiKey=OvTM4lSkLMBfIezG360eiEwaGuUZlJR2')
  //  console.log(response)
    if (response.status === 429) { // 429 is the HTTP status code for rate limiting
      throw new Error("Rate limit exceeded");
    }


    const data = await response.data
    setNext(data.next_url)
    const stocksData: Stock[] =await  Promise.all(data.results.map(async (item: {ticker: String, name:String}) => {
         const id: String=item.name;
              const symbol =  item.ticker;
              const name=item.name;
              const icon="place"

//         console.log(icon)
      
       const color: String= 'white';
      
      
      
              return {id,symbol,name, icon, color};
            }));
            setStocks(stocksData);
       
  } catch (err: any) {

      setError(err.message);
      console.log("will retris")
      // Retry after 1 minute if an error occurs

  }

}; 


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [error, setError] = useState<string | null>(null);
 

  useEffect(() => {

    SplashScreen.hide();
   
        

   
    fetchStocks()
  
  }, []);

 
 
const onNext=async()=>{
console.log("loading more Data")
 const response= await Clients.apiClient.get(next + "" , { headers:  header  });
 console.log("loaded more data")
 const data = await response.data
        setNext(data.next_url)
        const stocksData: Stock[] =await  Promise.all(data.results.map(async (item: {ticker: String, name:String}) => {
          const id: String=item.name;
                  const symbol =  item.ticker;
                  const name=item.name;
                  const icon="place"
    
          
           const color: String= 'white';
          
          
          
                  return {id,symbol,name, icon, color};
                }));

                const temp=stocks.concat(stocksData)
                setStocks(temp)
}








  return (
    <View style={styles.container}>
    <Text style={styles.header}>Nasdaq</Text>
    <TextInput   onChangeText={handleTextChange} style={styles.searchBar} placeholder="Search for stocks" placeholderTextColor="#888" />
    <FlatList
      data={stocks}
      onEndReached={query!==""? ()=>{}: onNext}
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
