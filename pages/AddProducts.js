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
  const addProducts = async (products) => {
    try {
      const promises = products.map(async (product) => {
        const imageRef = ref(storage, 'products/' + product.image.name);
        await uploadBytes(imageRef, product.image);
        const imageUrl = await getDownloadURL(imageRef);
  
        const docRef = await addDoc(collection(db, 'products'), {
          name: product.name,
          description: product.description,
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
      name: 'Product 11',
      description: 'Product 1 description',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqtH3cs44ChyTAH5VwSsCU9UMvO3LBA1MZt1iXrgeiztBlql3LiFIOwKRjvKWiqY0WQFc&usqp=CAU',
    },
    {
      name: 'Product 22',
      description: 'Product 2 description',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqtH3cs44ChyTAH5VwSsCU9UMvO3LBA1MZt1iXrgeiztBlql3LiFIOwKRjvKWiqY0WQFc&usqp=CAU',
    },
    
    
    // Add more products here...
  ];
  
  addProducts(products);
  



  return (
   
    <Text>Add producttt</Text>
  );
};

export default AddProducts;
