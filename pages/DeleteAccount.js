import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { deleteUser } from "firebase/auth";

const DeleteAccount = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        user.email,
        password
      );

      if (credentials.user) {
        await deleteUser(user);
        console.log("Account deleted successfully.");
        navigation.navigate("Home");
      } else {
        Alert.alert("Incorrect Password", "Please enter the correct password.");
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Password</Text>
      <Text style={styles.subtitle}>This action cannot be undone</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
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
      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};
export default DeleteAccount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: 350,
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginLeft: 10,
  },
  deleteButton: {
    width: 350,
    backgroundColor: "black",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
