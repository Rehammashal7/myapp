import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  signInWithEmailAndPassword, signInWithPopup,
  GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import googleicon from "../assets/iconn.png";
import faceicon from '../assets/fac.png';
import Icon from 'react-native-vector-icons/FontAwesome';


import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from '../firebase';
import COLORS from '../Consts/Color';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getUser = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();
      if (data.isAdmin === true) {
        navigation.navigate('adminHome');
      } else {
        navigation.navigate('MEN');
      }
    }
  };




  function validateForm(email, password, setError) {
    if (!email) {
      setError('Please enter your email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    return true;
  }


  const handleLogin = () => {

    if (validateForm(email, password, setError)) {

    }


    //   if (!email || !password) {
    //    setError('Please enter your email and password');
    //   return;
    // }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userId = userCredential.user;
        const id = auth.currentUser.uid;
        //navigation.navigate('Profile');
        AsyncStorage.setItem('USERID', id);
        //const user = userCredential.user;
        getUser();
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'wrong-password') {
          alert('Incorrect Password');
        } else {
          alert(errorMessage);
        }
      });
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user.email;
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
  const handleFace = () => {
    const provider2 = new FacebookAuthProvider();
    signInWithPopup(auth, provider2)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

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
  const handleResetPassword = () => {

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Password reset email sent successfully!');
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        placeholder="Password"
        style={styles.input}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
        <Icon
          name={showPassword ? 'eye' : 'eye-slash'}
          size={20}
          color="gray"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.buttonlogin}
      >
        <Text style={styles.buttonText}> Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.signupText}>Forgot your password?</Text>
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
    backgroundColor: '#FBFAFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#D3D3D3'
  },
  buttonlogin: {
    backgroundColor: COLORS.dark,
    
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color:COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#0B0E21',
    fontSize: 19,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  gicon: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    right: 70,
    top: 14,
    width: 48,
    height: 48,
  },
  ficon: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    left: 40,
    top: -35,
    width: 50,
    height: 50,
  },
  iconContainer: {
    position: 'absolute',
    right: 35,
    top: '41.3%',
    transform: [{ translateY: -10 }],
    zIndex: 1
  },
});

export default LoginScreen;