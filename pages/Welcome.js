import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import COLORS from '../Consts/Color';
import PrimaryButton from '../components/Button';

const Welcome = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: COLORS.background}}>
      <View>
      <Image
                source={{ uri : "https://img.freepik.com/free-vector/vector-cartoon-illustration-traditional-set-fast-food-meal_1441-331.jpg?w=2000"}}
                style={{
                    width:'95%',
                    height:250,
                    borderRadius:10,
                    marginTop:10,
                    alignSelf:'center',
                    marginBottom:20
                    
                }}/>
      </View>
      <View style={styles.textContainer}>
        <View>
          <Text style={{fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>
            Fast Food
          </Text>
          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              textAlign: 'center',
              color: COLORS.grey,
              marginBottom:15
            }}>
            We help you to find best and delicious food
          </Text>
        </View>
        <View style={styles.indicatorContainer}>
          <View style={styles.currentIndicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
        <PrimaryButton
          onPress={() => navigation.navigate('Login')}
          title="Get Started"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  indicatorContainer: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentIndicator: {
    height: 12,
    width: 30,
    borderRadius: 10,
    backgroundColor: COLORS.darkblue,
    marginHorizontal: 5,
    marginTop:10,
    marginBottom:10
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.grey,
    marginHorizontal: 5,
    marginTop:10,
    marginBottom:10
  },
});

export default Welcome;