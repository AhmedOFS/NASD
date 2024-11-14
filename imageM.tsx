//import LottieView from 'lottie-react-native';
import React, { useState } from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';




const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
 

interface imageprops {


  url: string

}
const ImageM: React.FC< imageprops>  =(image)=> {
  const [loading, setLoading] = useState(true);
  return (
<View style= {{
         
          aspectRatio: 1,  
        
      
        }}>

      {loading && (
       <Text>Loading..</Text>
      )}
  <Image
    source={{ uri: image.url }}
    style={styles.photo}
    onLoadEnd={() => setLoading(false)}

  />
  </View>
  )
}
export default React.memo(ImageM)

    const styles = StyleSheet.create({

        lottie: {
          width: '100%',
          height: '100%',
         
          position: 'absolute',
        },
       
        photo: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },

      });
      

      