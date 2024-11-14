import { useEffect, useState } from "react";
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Clients from '../apiManagement';
interface stockprops {


    item: Stock,

  }


  const StockItem : React.FC< stockprops>  =(stock)=> {

    const [useable, setUseable] = useState<Boolean>(false);

    

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
    <View style={[styles.outlinedBox] as StyleProp<ViewStyle>}>
    { urls=="place" ?<Text style={styles.icon}>{ stock.item.symbol.length>1 ?stock.item.symbol.substring(0,2) :" " +stock.item.symbol.substring(0,1) } </Text>:   <Image
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
  const styles = StyleSheet.create({


    container: {
      flex: 1,
      backgroundColor: '#121212',
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
      borderColor: 'white'
    },
    symbol: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
    },
    name: {
      fontSize: 10,
      color: '#888',
      alignSelf: 'center'
    },
    icon: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
    
      },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    outlinedBox: {
        borderWidth: 0.5,           
        borderColor: '#ffffff',       
        padding: 10, 
        width: 40,
        justifyContent: 'center',      
        borderRadius: 10,        
        margin: 10,                
      },
  });

  export default StockItem