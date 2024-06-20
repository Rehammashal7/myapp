import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Ionicons } from "@expo/vector-icons";

const AdminAllReview = ({ route, navigation }) => {
  const [like, setLike] = useState([0]);
  const [disLike, setDislikes] = useState([0]);
  const [reviews, setReviews] = useState([]);
  const [reviewsWithLikes, setReviewsWithLikes] = useState([]);

  useEffect(() => {
    const { reviews } = route.params;
    setReviews(reviews);
    console.log(reviews);
    loadLikesAndDislikes(reviews);
  }, [route.params]);

  const handleDeleteComment = async (index) => {
    try {
      const updatedReviews = [...reviewsWithLikes];
      const reviewToDelete = updatedReviews[index];
      updatedReviews.splice(index, 1); // حذف التعليق من القائمة
      setReviewsWithLikes(updatedReviews); // تحديث القائمة بعد الحذف

      // حذف التعليق من قاعدة البيانات
      const productRef = doc(db, 'baby', reviewToDelete.product_id);
      await updateDoc(productRef, {
        reviews: arrayRemove(reviewToDelete),
      });
    } catch (error) {
      console.log('Error handling comment deletion:', error);
    }
  };

  const loadLikesAndDislikes = async (reviews) => {
    try {
      const updatedReviews = await Promise.all(
        reviews.map(async (review, index) => {
          const likeValue = await AsyncStorage.getItem(`like${index}`);
          const dislikeValue = await AsyncStorage.getItem(`disLike${index}`);
          const updatedReview = { ...review };
          updatedReview.like = likeValue ? parseInt(likeValue) : 0;
          updatedReview.disLike = dislikeValue ? parseInt(dislikeValue) : 0;

          return updatedReview;
        })
      );
      
      setReviewsWithLikes(updatedReviews);
      setReviews(updatedReviews);
  
      console.log(updatedReviews);
    } catch (error) {
      console.log('Error loading likes and dislikes:', error);
    }
  };

  const handleLike = async (index) => {
    try {
      const updatedReviews = [...reviewsWithLikes];
      const updatedReview = { ...updatedReviews[index] };
      if (updatedReview.like === 0) {
        updatedReview.like = 1;
        updatedReview.disLike = 0;
        await AsyncStorage.setItem(`like${index}`, '1');
        await AsyncStorage.setItem(`disLike${index}`, '0');
      } else {
        updatedReview.like = 0;
        await AsyncStorage.setItem(`like${index}`, '0');
      }
      updatedReviews[index] = updatedReview;
      setReviewsWithLikes(updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.log('Error handling like:', error);
    }
  };

  const handleDislike = async (index) => {
    try {
      const updatedReviews = [...reviewsWithLikes];
      const updatedReview = { ...updatedReviews[index] };
      if (updatedReview.disLike === 0) {
        updatedReview.disLike = 1;
        updatedReview.like = 0;
        await AsyncStorage.setItem(`disLike${index}`, '1');
        await AsyncStorage.setItem(`like${index}`, '0');
      } else {
        updatedReview.disLike = 0;
        await AsyncStorage.setItem(`disLike${index}`, '0');
      }
      updatedReviews[index] = updatedReview;
      setReviewsWithLikes(updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.log('Error handling dislike:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Reviews</Text>
      <FlatList
        data={reviewsWithLikes}
        renderItem={({ item, index }) => (
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewText}>User: {item.username}</Text>
            <Text style={styles.reviewText}>Rating: {item.rating}</Text>
            <Text style={styles.reviewText}>Comment: {item.comment}</Text>
            <Text style={styles.reviewText}>Date: {item.date}</Text>
            <Ionicons
              name="trash-outline"
              size={24}
              color="black"
              style={{ marginLeft: 15, marginTop: 15 }}
              onPress={() => handleDeleteComment(index)}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reviewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 8,
  },
  likeDislikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    marginRight: 10,
  },
  dislikeButton: {
    marginRight: 10,
  },
  likeDislikeText: {
    fontSize: 16,
  },
  goBackButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AdminAllReview;
