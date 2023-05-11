import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {  createUserWithEmailAndPassword , signInWithPopup,
  GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";  
  import uuid from 'react-native-uuid';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  import { Image } from 'react-native';
  import googleicon from "../assets/iconn.png";
  import faceicon from '../assets/fac.png';
  import { auth , db}  from '../firebase';
  import { doc, setDoc } from "firebase/firestore";
  


const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [fristName, setFristName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [validationEmail , setValidationEmail] = useState('');
  const handleCheckEmail = () => {
    let isvalid = true ;
    let re = /\S+@\S+\.\S+/; 
    if (email.trim()=== ""){
      setValidationEmail("Invalid Email");
      isvalid = false;
    }
    else if (!/\S+@\S+\.\S+/.test(email)){
      setValidationEmail("Wrong Email");
      isvalid = false ;
    }
    // else if ()
    if(isvalid){
      handleSignUp();
    }
  };
  

  const handleSignUp = () => {

    if (password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!,please tty again');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("Done");
      adduserTodata();
      const id =auth.currentUser.uid;
      //navigation.navigate('Profile');
       AsyncStorage.setItem('USERID', id);
      navigation.navigate('Home')
      
      // ...
     
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

   
  };
  const userId = uuid.v4();
  const adduserTodata = async()=>{
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      email: email,
      fName:fristName,
      lName:lastName,
      phone:phone,
      birthDate:birthDate,
      userId:userId ,
      cart: [],
         isAdmin:false,
    });
    

  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const handleGoogle =()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user.email;
    adduserTodata();
    navigation.navigate('Home')
    window.alert("done log in");
    console.log("done login in");
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }
  const handleFace =()=>{
    const provider2 = new FacebookAuthProvider();
    signInWithPopup(auth, provider2)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
      adduserTodata();
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      navigation.navigate('Home')
      window.alert("done log in");
      
      console.log(result);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
  
      // ...
    });
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      {validationEmail ? 
        (<Text style = {styles.error}>{validationEmail}</Text>)
      :null
      }
       <TextInput
        value={fristName}
        onChangeText={setFristName}
        placeholder="Frit Name "
        style={styles.input}
      />
       <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Password"
        style={styles.input}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        placeholder="Confirm Passwor"
        style={styles.input}
      />
    
      <TouchableOpacity
        onPress={handleCheckEmail}
        style={styles.buttonsignup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
      {/* <h3 style={styles.line}> - - - - - - - or - - - - - - - </h3> */}
      
      

      <TouchableOpacity
        onPress={handleGoogle}
        //style={styles.buttongoogle}
      >
        
        <Image source={googleicon} style={styles.gicon} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={handleFace}
        //style={styles.buttonface}
      >
        <Image source={faceicon} style={styles.ficon} />

      </TouchableOpacity>    
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAFF' ,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 50, // set the border radius to create a circular button
    width: 50, // set the width and height to create a square container for the circular button
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red', // set the background color for the button
  },
  icon: {
    position: 'absolute', // position the icon in the center of the button
  },

  line:{
    color : '#131A2',
    width : '50%',
  },
  heading: {
    color: '#0B0E21',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    Color: '#FFFFFF',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#D3D3D3',
  },
  buttonsignup: {
    backgroundColor: '#131A2C',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop:10,
  },
  buttongoogle: {
    backgroundColor: '#131A2C',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop:10,
  },
  buttonface: {
    backgroundColor: '#131A2C',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop:10,
  },
  buttonText: {
    color: '#FFDE9B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  gicon: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    right:70,
    top:14 ,
    width: 48,
    height: 48,
  },
  ficon: {
    borderRadius: 10,
    padding: 10,
    alignItems:'center',
    left:40,
    top:-35 ,
    width: 50,
    height: 50,
  },
});

export default SignUpScreen;