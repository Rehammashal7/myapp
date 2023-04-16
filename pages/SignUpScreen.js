import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {  createUserWithEmailAndPassword , signInWithPopup,
  GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";  
  import auth from '../firebase'
  import { Image } from 'react-native';
  import googleicon from "../assets/iconn.png";
  import faceicon from '../assets/fac.png';


const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSignUp = () => {

    if (password !== confirmPassword) {
      alert('Passwords do not match!,please tty again');
      
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      navigation.navigate('profile')
      console.log("Done");
      
      const user = userCredential.user;
      // ...
     
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
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
    navigation.navigate('profile')
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
  
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      navigation.navigate('profile')
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
        onPress={handleSignUp}
        style={styles.buttonsignup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
      <h3 style={styles.line}> - - - - - - - or - - - - - - - </h3>
      
      

      <TouchableOpacity
        onPress={handleGoogle}
        style={styles.buttongoogle}
      >
              {/* <FontAwesomeIcon icon="fa-brands fa-square-facebook" /> */}

        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={handleFace}
        style={styles.buttonface}
      >
        <Text style={styles.buttonText}>Sign Up with Facebook</Text>
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
  Icon :{
    width : '50%',
    height : '50%',
  },
});

export default SignUpScreen;