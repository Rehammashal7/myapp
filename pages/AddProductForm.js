import  { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
//import { ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
import { db, storage } from '../firebase';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Storage
    const imageRef = ref(storage, 'products/' + image.name);
    await uploadBytes(imageRef, image);
    //const imageUrl = await imageRef.getDownloadURL();
    const imageUrl = await getDownloadURL(imageRef);

    // Add product document to Firestore
    await addDoc(collection(db, 'products'), {
      name: name,
      description: description,
      imageUrl: imageUrl,
    });

    setName('');
    setDescription('');
    setImage(null);
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Product Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageUpload} />
      </div>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
