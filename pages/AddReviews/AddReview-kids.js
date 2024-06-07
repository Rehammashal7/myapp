import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth, db, storage } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddReviewKids = ({ route, navigation }) => {
  const { product } = route.params;
  const product_id = product.id;
  const { fetchAllReviews } = route.params;
  const [userId, setUserId] = useState("");

  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [like, setLike] = useState(0);
  const [disLike, setDisLike] = useState(0);

  const [, forceUpdate] = useState({});

  const StarRating = ({ rating, onChange }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Icon
              name={star <= rating ? "star" : "star-o"}
              size={25}
              color="gold"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const fetchReviews = useCallback(async () => {
    const productRef = doc(db, "kids", product_id);
    const productDoc = await getDoc(productRef);
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const productData = productDoc.data();
    setReviews(productData.reviews || []);
  }, [product_id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async () => {
    const productRef = doc(db, "kids", product_id);

    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const username = docSnap.data()?.fName || "Unknown";

      const currentDate = new Date().toLocaleDateString();

      await AsyncStorage.setItem("like", like.toString());
      await AsyncStorage.setItem("disLike", disLike.toString());

      await updateDoc(productRef, {
        reviews: arrayUnion({
          rating: parseInt(rating),
          comment,
          username,
          date: currentDate,
          like,
          disLike,
        }),
      });

      fetchReviews();

      setRating(0);
      setComment("");

      fetchAllReviews();

      forceUpdate({});
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  const deleteReview = async (review) => {
    const productRef = doc(db, "kids", product_id);

    try {
      await updateDoc(productRef, {
        reviews: arrayRemove(review),
      });

      fetchReviews();

      forceUpdate({});
    } catch (error) {
      console.error("Error deleting review: ", error);
    }
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.reviewText}>User: {item.username}</Text>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            name={star <= item.rating ? "star" : "star-o"}
            size={15}
            color="black"
          />
        ))}
        <Text style={{ marginLeft: 120, color: "black" }}>
          Date: {item.date}{" "}
        </Text>
        <TouchableOpacity onPress={() => deleteReview(item)}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>
        {"\n"}
      </View>
      <Text style={[styles.reviewText, { marginTop: 15 }]}>
        Comment: {item.comment}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Review</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Rating:</Text>
        <StarRating rating={rating} onChange={(value) => setRating(value)} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Comment:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your comment"
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>

      <Button title="Submit" onPress={addReview} />

      <Text style={styles.reviewTitle}>Reviews:</Text>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  reviewContainer: {
    backgroundColor: "rgb(250, 250, 250)",
    // borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    elevation: 3,
  },
  reviewText: {
    fontSize: 14,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AddReviewKids;
