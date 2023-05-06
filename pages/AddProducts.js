import  { useState } from 'react';
import { Text } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
//import { ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
import { db, storage } from '../firebase';

const AddProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const addProducts = async (coffee) => {
    try {
      const promises = coffee.map(async (product) => {
        //const imageRef = ref(storage, 'products/' + product.image.name);
        //await uploadBytes(imageRef, product.image);
        //const imageUrl = await getDownloadURL(imageRef);
  
        let imageRef, imageUrl;
        
        if (product.image.startsWith('http')) {
          // use URL as image source
          imageRef = ref(storage, 'offer/' + encodeURIComponent(product.name) + '.jpg');
          imageUrl = product.image;
        } else {
          // use local image file
          imageRef = ref(storage, 'offer/' + product.image.name);
          await uploadBytes(imageRef, product.image);
          imageUrl = await getDownloadURL(imageRef);
        }



        const docRef = await addDoc(collection(db, 'offer'), {
          name: product.name,
          description:product.description,
          price:product.price,
          imageUrl: imageUrl,
        });
  
        console.log('Product added with ID: ', docRef.id);
      });
  
      await Promise.all(promises);
      console.log('All products added successfully!');
    } catch (error) {
      console.error('Error adding products: ', error);
    }
  };
  
  // Usage:
  const products = [
      {
          name: 'buy 1 get 1 Free',
          price: '50$',
          description: 'buy one checken git one pizza free',
          image: 'https://eg.arabiccoupon.com/sites/default/files/styles/free/public/offers/2019-06-june-_-pizzahut-arabiccoupon-offer-deal-buy1get1free-en_0.jpg',
      },  
      {
          name: 'Wednesday Offer ',
          price: '30$',
          description: 'offer 50% for all pizza',
          image: 'https://indianoffers.in/images/product/detail/thumb/1575103385pizza-hut-offers-coupon-today-34.jpg',
      }, 
      {
          name: 'offer 20%',
          price: '100$',
          description: 'buy 2 burger git offer 20% and 2 cola',
          image: 'https://s3-eu-west-1.amazonaws.com/elmenusv5-stg/Normal/f461ea0e-450b-4308-8bf3-667f2a2b27d3.jpg',
      }, 
      {
          name: 'for 2 days',
          price: '111$',
          description: 'buy 1 buger 1 pizza 1 cola 111$ only ',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfIpi7KnV0R2wWCu1hrgcBc0ylDAgcM4c_UfvbY9EK0AwK9r7ZMY1Zy_BlTdKNnj2R_N4&usqp=CAU',
      }, 

    // Add more products here...
  ];
  
  addProducts(products);
  



  return (
   
    <Text>Add producttt</Text>
  );
};

export default AddProducts;