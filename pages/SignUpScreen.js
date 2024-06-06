import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";
import googleicon from "../assets/iconn.png";
import faceicon from "../assets/fac.png";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import { RadioButton } from "react-native-paper";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");
const cardheight = height / 2;
const cardwidth = width / 2;
const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [numberType, setNumberType] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [verification, setVerifivation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [validationEmail, setValidationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const [HistoryOrder, setHistoryOrders] = useState([]);
  const [waitingOrder, setWaitingOrders] = useState([]);
  const [cancelOrder, setCancelOrders] = useState([]);
  const [gender, setGender] = useState("");
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const numbers = [
    { title: "10" },
    { title: "11" },
    { title: "12" },
    { title: "15" },
  ];
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const handleDateChange = ( event , selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();

    setDay(day);
    setMonth(month);
    setYear(year);
  };

  const handleCheckEmail = () => {
    let isvalid = true;
    let re = /\S+@\S+\.\S+/;
    if (email.trim() === "") {
      setValidationEmail("Invalid Email");
      isvalid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationEmail("Wrong Email");
      isvalid = false;
    }
    // else if ()
    if (isvalid) {
      handleSignUp();
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!,please tty again");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Done");
        adduserTodata();
        const id = auth.currentUser.uid;
        //navigation.navigate('Profile');
        AsyncStorage.setItem("USERID", id);
        navigation.navigate("Home");

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const userId = uuid.v4();
  const adduserTodata = async () => {
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      email: email,
      fName: fristName,
      lName: lastName,
      phone: phone,
      birthDate: birthDate,
      userId: userId,
      cart: [],
      recentlyVisited: [],
      isAdmin: false,
      verification: false,
    });
  };

  const handleLogin = () => {
    navigation.navigate("Login");
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
        adduserTodata();
        navigation.navigate("Home");
        window.alert("done log in");
        console.log("done login in");
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
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const handleFace = () => {
    const provider2 = new FacebookAuthProvider();
    signInWithPopup(auth, provider2)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        adduserTodata();
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        navigation.navigate("Home");
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
  };

  return (
    <ScrollView style={styles.scrollContainer}>

    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <View style={[{ flexDirection: "row" }]}>
        <TextInput
          style={[styles.input, { marginLeft: 5, marginRight: 5 }]}
          placeholder="Frist name"
          value={fristName}
          onChangeText={(text) => setFristName(text)}
          placeholderTextColor="gray"
        />
        <View style={[{ flexDirection: "column" }]}>
          <TextInput
            style={[styles.input, { marginLeft: 5, marginRight: 5 }]}
            placeholder="Last name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholderTextColor="gray"
          />
        </View>
        </View>

        <View style={styles.emailContainer}>
          <View style={[{ flexDirection: "column" }]}>
            <Text style={styles.inputLabel}> E-mail</Text>

            <TextInput
              style={[
                styles.inputmail
                ,
                { fontSize: 18, color: "gray", marginLeft: 5, width: width-20 },
              ]}
              value={email}
              placeholder={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="gray"
            />
            {validationEmail ? (
              <Text style={styles.error}>{validationEmail}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.phonecontainer}>
        <View style={styles.countryCode}>
            <TextInput
              style={styles.countrycodeinput} 
              placeholder="Country Code"
              value={countryCode}
              editable={false}
            />
          </View>
          <View style={styles.numbertypecontainer}>
          <SelectDropdown
  data={numbers}
  onSelect={(selectedItem) => {
    setNumberType(selectedItem.title);
    console.log(selectedItem.title);
  }}
  renderButton={(selectedItem , isOpened) => {
    return (
      <View style={styles.dropdownButtonStyle}>
        <Text style={styles.dropdownButtonTxtStyle}>
          {(numberType && numberType) || 'NumberType'}
        </Text>
        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
      </View>
    );
  }}
  renderItem={(item, index, isSelected) => {
    return (
      <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
        <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
      </View>
    );
  }}
  showsVerticalScrollIndicator={false}
  dropdownStyle={styles.dropdownMenuStyle}
/>


          </View>
          <View style={[styles.inputContainer, { marginTop: 4 }]}>
            <Text style={styles.inputLabel}> Phone number</Text>

            <TextInput
              style={styles.inputphone}
              value={phone}
              placeholder={phone}
              onChangeText={(text) => setPhone(text)}
              placeholderTextColor="gray"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          </View>
      

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputpass}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        placeholder="Confirm Passwor"
        style={styles.inputconpass}
      />
       <View style={styles.birthDate}>
          {/* day  */}
          <Text style={[styles.inputLabel, { left: 10 }]}>Day</Text>

          <TextInput
            style={[styles.inputDate, { marginLeft: 5, marginRight: 5 }]}
            // placeholder="Day"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={(text) => setDay(text)}
            value={day}
            editable={false}
          />
          {/* month */}
          <Text style={[styles.inputLabel, { left: 65 }]}> Month</Text>

          <TextInput
            style={[styles.inputDate, { marginLeft: 5, marginRight: 5 }]}
            // placeholder="Month"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={(text) => setMonth(text)}
            value={month}
            editable={false}
          />
          {/* year*/}
          <Text style={[styles.inputLabel, { left: 125 }]}> Year</Text>

          <TextInput
            style={[styles.inputDate, { marginLeft: 5, marginRight: 5 }]}
            // placeholder="Year"
            keyboardType="numeric"
            maxLength={4}
            onChangeText={(text) => setYear(text)}
            value={year}
            editable={false}
          />
          <TouchableOpacity
            onPress={showDatepicker}
            style={[styles.buttonBirth]} 
          >
            <Ionicons name="calendar-outline" size={40} color="black" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              style={styles.dateTimePicker} 
            />
          )}
          {/* </View> */}
        </View>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioButton}>
            <RadioButton
              value="male"
              status={gender === "male" ? "checked" : "unchecked"}
              onPress={() => setGender("male")}
            />
            <Text style={styles.radioLabel}>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="female"
              status={gender === "female" ? "checked" : "unchecked"}
              onPress={() => setGender("female")}
            />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
        </View>

      <TouchableOpacity onPress={handleCheckEmail} style={styles.buttonsignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
      {/* <h3 style={styles.line}> - - - - - - - or - - - - - - - </h3> */}
<View style={[{flexDirection: 'row',alignSelf: "center", }]}>
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
    </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FBFAFF",
   // alignItems: "center",
  //  justifyContent: "center",
    paddingHorizontal: 5,
  },
  button: {
    width: cardwidth, 
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  icon: {
    position: "absolute", 
  },

  line: {
    color: "#131A2",
    width: "50%",
  },
  heading: {
    color: "#0B0E21",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "center"
  },
 
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 20,
  },
  inputmail: {
    fontSize: 18,
    height: height/15,
    borderColor: "white",
    borderWidth: 1,
    marginTop:0,
    marginBottom: 0,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    width: cardwidth - 15,
    height: 40,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 0,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  iconContainer: {
    marginLeft: 10,
  },
  inputpass: {
    //flex: 1,
    width: width - 60,
    height: height / 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 20,
    fontSize: 18,
  },
  inputconpass: {
    //flex: 1,
    width: width - 60,
    height: height / 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 20,
    marginRight: 40,
    fontSize: 18,
  },
  buttonsignup: {
    backgroundColor: "#131A2C",
    padding: 10,
    width: width-10,
    alignItems: "center",
    marginTop: 10,
  },
  buttongoogle: {
    backgroundColor: "#131A2C",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonface: {
    backgroundColor: "#131A2C",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color:'white',
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "black",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
    alignSelf: "center",  // أضف هذا
  },
  gicon: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 48,
    height: 48,
    alignSelf: "center",
    marginRight:20,
  },
  ficon: {
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 50,
    height: 50,
    alignSelf: "center",  // أضف هذا
  },
  numbertypecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f2f2f2",
    width: cardwidth / 2,
    height: height / 17,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  inputLabel: {
    position: "absolute",
    top: 0,
    left: 5,
    color: "gray",
  },
  countrycodeinput: {
    fontSize: 19,
    color: "gray",
    textAlign: "center",
    backgroundColor: "#f2f2f2",
    width: width / 4,
    height: height / 17,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dropdownButtonStyle: {
    width: 90,
    height: 50,
    // backgroundColor: '#E9ECEF',
    // borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    // flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#393e46",
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
  },
  // dropdownButtonIconStyle: {
  //   fontSize: 18,
  //   marginRight: 8,
  // },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    // width: '100%',
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    // flex: 1,
    fontSize: 16,
    // fontWeight: '500',
    color: "#151E26",
  },
  phonecontainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  inputphone: {
    width: cardwidth-25,
    height: height / 25,
    marginLeft: 5,
    marginRight: 5,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  countryCode: {
    marginRight: 5,
  },
  emailContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  birthDate: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  inputDate: {
    width: 50,
    height: 40,
    borderColor: "black",
    borderBottomWidth: 1,
    color:'#2a2438',
    textAlign:'center',
    borderColor: "white",
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 10,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dateTimePicker: {
    backgroundColor: "gray",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonBirth: {
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
  },
  label: {
    fontSize: 20,
    marginLeft: 10,
    alignItems:'flex-start',
  },
  radioContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SignUpScreen;
