import React from 'react';
import {Text,View,TouchableOpacity,Image,StyleSheet,Dimensions} from 'react-native';






const Foodcard =({
   
    restaurantName,
    price ,
    images,
    screenWidth
}) =>{

    return(
        <TouchableOpacity>
            <View style ={{...styles.cardView,width:screenWidth}}>
                <Image 
                    style ={{...styles.image, width:screenWidth}}
                    source = {{uri:images}}
                />

            <View>
                <View>
                    <Text style ={styles.restaurantName}>{restaurantName}</Text>
                </View>

                <View style ={{flex:1, flexDirection:"row"}}>

                    

                    <View style ={{flex:9, flexDirection:"row"}}>
                        <Text style ={styles.price}>{price}</Text>
                    </View>

                </View>
            </View>

            </View>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
        cardView:{
            marginHorizontal:9,
            borderTopRightRadius:5,
            borderTopLeftRadius:5,
            borderWidth:1,
            borderColor:"0B0E21",
            borderBottomLeftRadius:5,
            borderBottomRightRadius:5,
        },
         image:{
            borderTopLeftRadius:5,
            borderTopRightRadius:5,
            height:150,
         },

         restaurantName:{
            fontSize:17,
            fontWeight:'bold',
            color:"0B0E21",  
            marginTop:5,
            marginLeft:10
         },

         distance :{
            flex:4,flexDirection:'row',
            borderRightColor:"0B0E21",
            paddingHorizontal:5,
            borderRightWidth:1
         },
         Min:{
            fontSize:12,
            fontWeight:'bold',
            paddingTop:5,
            color:"0B0E21" 
         },

         price:{
            fontSize:12,
            paddingTop:5,
            color:"0B0E21",
            paddingHorizontal:10
         },

         review :{
            position:"absolute",
            top:0,
            right:10,
            backgroundColor:'rgba(52, 52, 52,0.3)',
            padding:2,alignItems:"center",
            justifyContent:"center", 
            borderTopRightRadius:5,
            borderBottomLeftRadius:12 
         },

         average:{
            color:"white",
             fontSize:20,
              fontWeight:'bold',
               marginTop:-3  
         },
         numberOfReview :{
            color:"white", 
            fontSize:13,
            marginRight:0,
            marginLeft:0
         }
})
export default Foodcard;