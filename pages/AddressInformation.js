import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
    // useAuth,
} from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc,collection, getDocs,getDoc,addDoc } from "firebase/firestore";
import {  query, where } from "firebase/firestore";

import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RadioButton } from "react-native-paper";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
const AddressInformation = ({navigation,route}) => {
  const currentUser = useAuth();
  const {  useraddress } = route.params? route.params : {  useraddress: { index: "" } };
  console.log("USERADDRESS:",useraddress);
    const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [addressTitle, setAddressTitle] = useState("");
  const [neighborhoodsData, setNeighborhoodsData] = useState([]);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [numberType, setNumberType] = useState("");
  const [type, setType] = useState(null);
  const [dataAddress, setDataAddress] = useState([]);
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [addressTitleError, setAddressTitleError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [selectCity, setSelectCity] = useState(false);
  const [ispre, setIsPre] = useState(false);
  
  const cities = [
    { title: "Cairo" },
    { title: "Giza" },
    { title: "Alexandria" },
    { title: "10th of Ramadan City" },
    { title: "Al Menofiah" },
    { title: "AL Sharqia" },
    { title: "Assiut" },
    { title: "Aswan" },
    { title: "Bani Swif" },
    { title: "Beheira" },
    { title: "Dakahlia" },
    { title: "Damanhour" },
    { title: "Daqahlia" },
    { title: "EL GOUNA" },
    { title: "Fayoum" },
    { title: "Ghamrah" },
    { title: "Gharbia" },
    { title: "Heliopolis" },
    { title: "Helwan" },
    { title: "Hurghada" },
    { title: "Ismailia" },
    { title: "Kafr El Sheikh" },
    { title: "Luxor" },
    { title: "Maadi" },
    { title: "Mansoura" },
    { title: "Marsa Matrouh" },
    { title: "Menia City" },
    { title: "Nasr City" },
    { title: "New Cairo" },
    { title: "New Valley" },
    { title: "North Sinai" },
    { title: "October City" },
    { title: "Port Said" },
    { title: "Qaliubia" },
    { title: "Qena" },
    { title: "Red Sea" },
    { title: "Sharm El Sheikh" },
    { title: "Sheikh Zayed City" },
    { title: "Shubra" },
    { title: "Sohag City" },
    { title: "South Sinai" },
    { title: "Suez" },
    { title: "Tanta" },
    { title: "Zakazik" },
    { title: "Zamalek" },
    { title: "Dommiat" },
  ];
  const neighborhoods = {
    Cairo: [
      "Abdeen",
      "Ain Shams - East",
      "Al Abageyah",
      "Al Amireya",
      "Al Azbakeya",
      "Al Herafieen",
      "Al Salam First",
      "Al Waili",
      "Al-Sharabiya",
      "Bab El Sharia",
      "Bulaq Abo Elela",
      "Daher",
      "El Basatin",
      "Al Maasarah",
      "El Gamaliya",
      "El Nozha",
      "El Zawya El Hamra",
      "Elsahel",
      "El-Sayeda Zainab",
      "Future City",
      "Hikestab",
      "Isbico",
      "Manil Shihah",
      "Old Cairo",
      "Qasr El Nil",
      "Qism El-Khalifa",
      "Rod El Farag",
      "Wadi Hof",
      "Warraq Al Hadar",
      "15 Of May City",
      "Abasya",
      "Ain Shams",
      "Al Marg",
      "Al Matarya",
      "Attaba",
      "Al Shorouk",
      "Madinaty",
      "New Cairo",
      "New Capital City",
      "Badr City",
      "Cornish El Nile",
      "Dar El Salam",
      "Down Town",
      "El Maadi",
      "El Marg",
      "EL rehab",
      "El Salam City",
      "EL SAWAH",
      "El Zeitoun",
      "Garden City",
      "Ghamrah",
      "Hadayek El Qobah",
      "Heliopolis",
      "Helwan",
      "Kasr El Einy",
      "Katamiah",
      "Maadi",
      "Mansheyt Naser",
      "Mokattam",
      "Nasr City",
      "Ramsis",
      "Shubra",
      "Tebin",
      "Torah",
    ],
    Giza: [
      "Al Atf",
      "Ard El Lewa",
      "Awsim",
      "Bashtil",
      "Fisal",
      "Pyramids Gardens",
      "Shubra Ment",
      "Abo Rawash",
      "Agouza",
      "Al Haram",
      "Al Monib",
      "Al Wahat",
      "Al Waraq",
      "Alex Desert Rd.",
      "Atfeah",
      "Badrashin",
      "Bahtem",
      "Bargiel",
      "Bolak El Dakrour",
      "Dahshour",
      "Dokki",
      "El Ayat",
      "El Hawamdiah",
      "EL Korimat",
      "El Saf",
      "Giza",
      "Imbaba",
      "Manial El Rodah",
      "Mohandiseen",
      "October City",
      "Omranya",
      "Saqara",
      "Zamalek",
      "Sheikh Zayed City",
    ],
    Alexandria: [
      "Al Amaria",
      "Dekhela",
      "El King Maryout",
      "Markaz Edko",
      "North Coast",
      "Awaied-Ras Souda",
      "Borg Al Arab City",
      "Sedi Kreir",
    ],
    "10th of Ramadan City": ["10th of Ramadan City"],
    "Al Menofiah": [
      "Ashmoun",
      "El-Bagour",
      "Kafr Al Musaylhah",
      "Menouf City",
      "Shuhada",
      "Tala",
      "Berkeit Sabb",
      "Quesna",
      "Sadat City",
      "Shebin El Koum",
    ],
    "AL Sharqia": [
      "Abu Hammad",
      "Abu Kebir",
      "Al Husseiniya",
      "Al Ibrahimiya",
      "Al Idwah",
      "Al Minasafur",
      "Al Qanayat",
      "Al Qurayn",
      "As Sufiyyah",
      "Awlad Sagr",
      "Diyarb Negm",
      "Hihya",
      "Kafr El-Hamam",
      "Kafr Saqr",
      "Mashtool El Souk",
      "Minya El Qamh",
      "Belbis",
      "Inshas",
      "New Salhia",
      "Zakazik",
    ],
  };

  const numbers = [
    { title: "10" },
    { title: "11" },
    { title: "12" },
    { title: "15" },
  ];


  function useAuth() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
      
      return unsub;
    }, []);

    return currentUser;
  }
  useEffect(() => {
    if (city && neighborhoods[city]) {
      setNeighborhoodsData(neighborhoods[city]);
    } else {
      setNeighborhoodsData([]);
    }
  }, [city]);

  useEffect(() => {
    if (useraddress && useraddress.index !== "") {
      getUserAddressDataByIndex(useraddress.index);
    }
  }, [useraddress]);
  
  // داخل getUserAddressDataByIndex
  const getUserAddressDataByIndex = async (index) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.dataAddress && userData.dataAddress.length > index) {
          const addressData = userData.dataAddress[index];
          console.log("userdata",addressData);
          setFirstName(addressData.firstName);
           setLastName(addressData.lastName);
           setAddress(addressData.address);
           setAddressTitle(addressData.addressTitle);
           setCity(addressData.city);
           setDistrict(addressData.district);
           setNumberType(addressData.numberType);
           setPhone(addressData.phone);
           setType(addressData.type);



        } else {
          console.log("No address found at index: ", index);
        }
      } else {
        console.log("No user document found");
      }
    } catch (error) {
      console.error("Error fetching user address data: ", error);
    }
  };

  const handleSave = async () => {
    console.log("lmlkfjewoijfdikwej");
    setIsPre(true);
    console;
    if (firstName.trim() === "") {
      setFirstNameError(true);
      //   return;
    } else {
      setFirstNameError(false);
    }

    if (lastName.trim() === "") {
      setLastNameError(true);
      //   return;
    } else {
      setLastNameError(false);
    }

    if (phone.trim() === "") {
      setPhoneError(true);
      //   return;
    } else {
      setPhoneError(false);
    }

    if (address.trim() === "") {
      setAddressError(true);
      // return;
    } else {
      setAddressError(false);
    }
    if (district.trim() === "") {
      setDistrictError(true);
      // return;
    } else {
      setDistrictError(false);
    }
    if (addressTitle.trim() === "") {
      setAddressTitleError(true);
      // return;
    } else {
      setAddressTitleError(false);
    }

    if (
      !firstNameError &&
      !lastNameError &&
      !addressError &&
      !districtError &&
      !addressTitleError &&
      !phoneError
    ) {
      addAddressData();
        console.log("iamhereeeeeeee");
        navigation.navigate("AddressScreen");
    }
  };
  const addAddressData = async () => {
    try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            let updatedUserData = {};

            if (!userData.dataAddress) {
                // إذا لم تكن dataAddress موجودة، قم بإنشائها كقائمة فارغة
                updatedUserData = {
                    ...userData,
                    dataAddress: []
                };
            } else {
                updatedUserData = { ...userData };
            }
            const addressIndex = updatedUserData.dataAddress.length;
            const addressData = {
              index: addressIndex,
                firstName: firstName,
                lastName: lastName,
                city: city,
                district: district,
                address: address,
                phone: phone,
                addressTitle: addressTitle,
                type: type,
                countryCode: countryCode,
                numberType: numberType,
            };

            // قم بتحديث قيمة dataAddress في بيانات المستخدم بالقيمة الجديدة
            await updateDoc(userDocRef, {
                ...updatedUserData,
                dataAddress: [...updatedUserData.dataAddress, addressData]
            });

            alert("address add succesful in data,Please Refrish page");
        } else {
            alert("No users");
        }
    } catch (error) {
        console.error("Error in Firebase:", error);
    }
};

  
  
  return (
    <View style={styles.container}>
      <Text style={styles.inf}>Add Address</Text>

      <View style={styles.inputContainer}>
        {/* frist name */}
        <View style={[{ flexDirection: "column" }]}>
          <TextInput
            style={[
              styles.input,
              { marginLeft: 5, marginRight: 5, marginTop: 20 },
            ]}
            placeholder="Frist name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            placeholderTextColor="gray"
          />
          {firstNameError && (
            <Text style={styles.errorname}>Please enter your first name</Text>
          )}
        </View>
        <View style={[{ flexDirection: "column" }]}>
          <TextInput
            style={[styles.input, { marginLeft: 5, marginRight: 5 }]}
            placeholder="Last name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholderTextColor="gray"
          />
          {lastNameError && (
            <Text style={styles.errorname}>Please enter your last name</Text>
          )}
        </View>
      </View>
      <View>
        <SelectDropdown
          data={cities}
          onSelect={(selectedItem) => {
            setCity(selectedItem.title);
            setSelectCity(true);
            console.log(selectedItem.title);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text
                  style={[
                    styles.dropdownButtonTxtStyle,
                    // { marginRight: width - 200 },
                  ]}
                >
                  {(city && city) || "City"}
                </Text>
                <Icon
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  style={styles.dropdownButtonArrowStyle}
                />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
      <View>
        <SelectDropdown
          data={neighborhoodsData}
          disabled={!selectCity}
            disabledColor="gray"
        //   disabledColor="lightgray"
          onSelect={(selectedItem) => {
            setDistrict(selectedItem);
            console.log(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(district && district) || "District"}
                </Text>
                <Icon
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  style={styles.dropdownButtonArrowStyle}
                />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        {districtError && (
          <Text style={styles.errorname}>Please select county</Text>
        )}
      </View>
      <View style={[{ flexDirection: "column" }]}>
        <Text style={styles.inputLabel}> Address</Text>
        <TextInput
          style={[styles.inputAdd, { marginLeft: 5, marginRight: 5 }]}
          placeholder=""
          value={address}
          onChangeText={(text) => setAddress(text)}
          placeholderTextColor="gray"
        />
        {addressError && (
          <Text style={styles.errorname}>Please enter your address</Text>
        )}
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
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyleNUM}>
                  <Text style={styles.dropdownButtonTxtStyleNUM}>
                    {(numberType && numberType) || "NumberType"}
                  </Text>
                  <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
        <View style={[styles.inputContainer, { marginTop: 4 }]}>
          <Text style={styles.labelNumber}> Phone number</Text>

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
      <View style={[{ flexDirection: "column" }]}>
        <Text style={styles.inputLabel}> Address Title</Text>
        <TextInput
          style={[styles.inputAdd, { marginLeft: 5, marginRight: 5 }]}
          value={addressTitle}
          onChangeText={(text) => setAddressTitle(text)}
          placeholderTextColor="gray"
        />
        {addressTitleError && (
          <Text style={styles.errorname}>Please enter the address name</Text>
        )}
      </View>
      <View style={styles.radioContainer}>
        <View style={styles.radioButton}>
          <RadioButton
            value="Individual"
            status={type === "Individual" ? "checked" : "unchecked"}
            onPress={() => setType("Individual")}
          />
          <Text style={styles.radioLabel}>Individual</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton
            value="Corporate"
            status={type === "Corporate" ? "checked" : "unchecked"}
            onPress={() => setType("Corporate")}
          />
          <Text style={styles.radioLabel}>Corporate</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};
export default AddressInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    // alignItems: 'center',
  },
  inf: {
    fontSize: 24,
    // fontWeight: "bold",
    // marginBottom:    5,
    marginTop: 10,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  errorname: {
    color: "red",
    fontSize: 13,
    marginLeft: 5,
  },
  input: {
    fontSize: 18,
    width: cardwidth - 12,
    height: height - 790,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 0,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dropdownButtonStyle: {
    width: width - 15,
    height: height - 780,
    marginLeft: 5,
    // backgroundColor: '#E9ECEF',
    // borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderColor: "white",
    borderWidth: 1,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  dropdownButtonTxtStyle: {
    // flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#393e46",
    // marginRight: width - 100,
    // textAlign: 'center',
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
    // marginRight: width-20,
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
    backgroundColor: "white",
    // fontSize:30,
  },
  dropdownItemTxtStyle: {
    // flex: 1,
    fontSize: 16,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // fontWeight: '500',
    color: "#151E26",
  },

  saveButton: {
    width: width - 30,
    marginLeft: 15,
    backgroundColor: "black",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  inputLabel: {
    position: "absolute",
    top: 0,
    left: 5,
    color: "gray",
    // marginTop:10,
  },
  inputAdd: {
    fontSize: 18,
    width: width - 15,
    height: height - 790,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  phonecontainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  countryCode: {
    marginLeft: 5,
    marginRight: 5,
  },
  numbertypecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f2f2f2",
    width: cardwidth - 110,
    height: height - 780,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dropdownButtonStyleNUM: {
    width: cardwidth - 110,
    height: height - 7900,
    // backgroundColor: '#E9ECEF',
    // borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyleNUM: {
    // flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#393e46",
  },
  countrycodeinput: {
    fontSize: 19,
    color: "gray",
    textAlign: "center",
    backgroundColor: "#f2f2f2",
    width: cardwidth - 110,
    height: height - 780,
    borderEndColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  labelNumber: {
    position: "absolute",
    top: 0,
    left: 5,
    color: "gray",
    // marginTop:10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  inputphone: {
    width: cardwidth,
    height: height - 780,
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
