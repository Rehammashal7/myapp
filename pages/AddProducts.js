// import  { useState } from 'react';
// import { Text } from 'react-native';
// import { collection, addDoc } from 'firebase/firestore';
// //import { ref, uploadBytes } from 'firebase/storage';
// import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
// import { db, storage } from '../firebase';
// import category from './catigory';

// // const AddProducts = () => {
// //   const [name, setName] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [image, setImage] = useState(null);
// //   const addProducts = async (products) => {
// //     try {
// //       const promises = products.map(async (product) => {
// //         const imageRef = ref(storage, 'products/' + product.image.name);
// //         await uploadBytes(imageRef, product.image);
// //         const imageUrl = await getDownloadURL(imageRef);
  
// //         const docRef = await addDoc(collection(db, 'products'), {
// //           name: product.name,
// //           description: product.description,
// //           imageUrl: imageUrl,
// //         });
  
// //         console.log('Product added with ID: ', docRef.id);
// //       });
  
// //       await Promise.all(promises);
// //       console.log('All products added successfully!');
// //     } catch (error) {
// //       console.error('Error adding products: ', error);
// //     }
// //   };
  
// //   // Usage:
// //   const products = [
// //     {
// //       name: 'Product 11',
// //       description: 'Product 1 description',
// //       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqtH3cs44ChyTAH5VwSsCU9UMvO3LBA1MZt1iXrgeiztBlql3LiFIOwKRjvKWiqY0WQFc&usqp=CAU',
// //     },
// //     {
// //       name: 'Product 22',
// //       description: 'Product 2 description',
// //       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqtH3cs44ChyTAH5VwSsCU9UMvO3LBA1MZt1iXrgeiztBlql3LiFIOwKRjvKWiqY0WQFc&usqp=CAU',
// //     },
    
    
// //     // Add more products here...
// //   ];
  
// //   addProducts(products);
  



// //   return (
   
// //     <Text>Add producttt</Text>
// //   );
// // };

// // export default AddProducts;
// const AddProducts = () => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [images, setImages] = useState([]); // قائمة الصور المتعددة
//   const [sizes, setSizes] = useState([]); // قائمة الأحجام
//   const [colors, setColors] = useState([]); // قائمة الألوان
//   const [price, setPrice] = useState(0);
//   const [offer, setOffer] = useState(0);


//   const addProduct = async (product) => {
//     try {
//       // تحميل الصور المتعددة
//       const imageUrls = await Promise.all(product.images.map(async (image) => {
//         const imageRef = ref(storage, 'baby/'+image.name);
//         await uploadBytes(imageRef, image);
//         const imageUrl = await getDownloadURL(imageRef);

//         return imageUrl;
//       }));

//       const docRef = await addDoc(collection(db, 'baby'), {
//         categoryName:product.categoryName,
//         name: product.name,
//         description: product.description,
//         images: imageUrls, 
//         sizes: product.sizes,
//         colors: product.colors,
//         price:product.price,
//         offer:product.offer,


//       });

//       console.log('Product added with ID: ', docRef.id);
//     } catch (error) {
//       console.error('Error adding product: ', error);
//     }
//   };

//   const addProducts = async (products) => {
//     try {
//       await Promise.all(products.map(addProduct));
//       console.log('All products added successfully!');
//     } catch (error) {
//       console.error('Error adding products: ', error);
//     }
//   };
// //   const products = [
// //     {//1
// //       categoryName:'BABY',

// //       name: 'Baby Girl Long Sleeve Snap Body',
// //       description: 'Model Measurements:Height: 0.83 Sample size: 12-18 MONTHS Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B5714A5_23AU_PN390_02_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B5714A5_23AU_PN390_03_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B5714A5_23AU_PN390_05_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B5714A5_23AU_PN390_08_01.jpg'],
// //       sizes: ['1-3 MONTHS ','6-9 MONTHS','9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','24-36 MONTHS'], 
// //       colors: [''],
// //       price:299,
// //       offer:0
// //     },
// //    {//2
// //     categoryName:'BABY',

// //       name: 'Baby Girl Newborn Floral Jumpsuit',
// //       description: 'Model Measurements:Height: 0.83 Sample size: 12-18 MONTHS Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9476A5_24SP_ER68_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9476A5_24SP_ER68_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9476A5_24SP_ER68_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9476A5_24SP_ER68_05_02.jpg'],
// //       sizes: ['3-6 MONTHS ','6-9 MONTHS','9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','24-36 MONTHS'], 
// //       colors: [''],
// //       price:899,
// //       offer:0
// //     },
// //    {//3
// //     categoryName:'BABY',

// //       name: 'Baby Girl Slogan Printed Long Sleeve Dress',
// //       description: 'Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9225A5_24SP_BG287_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9225A5_24SP_BG287_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9225A5_24SP_BG287_05_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9225A5_24SP_BG287_09_01.jpg'],
// //       sizes: ['6-9 MONTHS','9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','4/5 Age','5/6 Age'], 
// //       colors: [''],
// //       price:899,
// //       offer:0
// //     },
// //    {//4
// //     categoryName:'BABY',

// //       name: 'Baby Girl Floral Long Sleeve Textured Dress',
// //       description: 'Model Measurements:Height: 1.00 Sample size: 12-18 MONTHS Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9290A5_24SP_WT34_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9290A5_24SP_WT34_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9290A5_24SP_WT34_04_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9290A5_24SP_WT34_07_01.jpg'],
// //       sizes: ['6-9 MONTHS','9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','3/4 Age','4/5 Age'], 
// //       colors: [''],
// //       price:899,
// //       offer:0
// //     },
// // {//5
// //   categoryName:'BABY',

// //       name: 'Baby Girl College Collar Bomber Jacket',
// //       description: 'Main Fabric Content : Cotton 57%,Viscose 4%,Polyester 39%',
// //       images: ['https://dfcdn.defacto.com.tr/6/C0745A5_24SP_PN354_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0745A5_24SP_PN354_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0745A5_24SP_PN354_06_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0745A5_24SP_PN354_04_03.jpg'],
// //       sizes: ['12-18 MONTHS','18-24 MONTHS','24-36 MONTHS','3/4 Age','4/5 Age','5/6 Age'], 
// //       colors: [''],
// //       price:1499,
// //       offer:0
// //     },
// // {//6
// //   categoryName:'BABY',

// //       name: 'Baby Girl Floral Sweatshirt Leggings 2 Piece Set',
// //       description: 'Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/C0714A5_24SP_PN354_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0714A5_24SP_PN354_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0714A5_24SP_PN354_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0714A5_24SP_PN354_04_02.jpg'],
// //       sizes: ['12-18 MONTHS','18-24 MONTHS','24-36 MONTHS','3/4 Age','4/5 Age','5/6 Age'], 
// //       colors: [''],
// //       price:1299,
// //       offer:0
// //     },
// // {//7
// //   categoryName:'BABY',

// //       name: 'Baby Boy Newborn Muslin Jumpsuit',
// //       description: 'Model Measurements:Height: 0.78 Sample size: 12-18 MONTHS Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9511A5_24SM_NV31_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9511A5_24SM_NV31_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9511A5_24SM_NV31_04_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9511A5_24SM_NV31_08_01.jpg'],
// //       sizes: ['3-6 MONTHS ','6-9 MONTHS','9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','24-36 MONTHS'], 
// //       colors: [''],
// //       price:899,
// //       offer:0
// //     },
// // {//8
// //   categoryName:'BABY',

// //       name: 'Baby Boy Long Sleeve Snapbody Vest Trousers Linen 3 Piece Set',
// //       description: 'Model Measurements:Height: 0.78 Sample size: 12-18 MONTHS Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9507A5_24SM_WT47_01_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9507A5_24SM_WT47_04_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9507A5_24SM_WT47_02_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9507A5_24SM_WT47_09_03.jpg'],
// //       sizes: ['3-6 MONTHS ','6-9 MONTHS','9-12 MONTHS','12-18 MONTHS','18-24 MONTHS'], 
// //       colors: [''],
// //       price:1299,
// //       offer:0
// //     },
// // {//9
// //   categoryName:'BABY',

// //       name: 'Baby Boy Jean Jumpsuit',
// //       description: 'Model Measurements:Height: 1.00 Sample size: 12-18 MONTHS Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B6746A5_24SP_KH82_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6746A5_24SP_KH82_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6746A5_24SP_KH82_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6746A5_24SP_KH82_08_01.jpg'],
// //       sizes: ['9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','24-36 MONTHS','3/4 Age','4/5 Age','5/6 Age'], 
// //       colors: [''],
// //       price:1499,
// //       offer:0
// //     },
// // {//10
// //   categoryName:'BABY',

// //       name: 'Baby Boy Regular Fit Crew Neck Printed Cardigan',
// //       description: 'Main Fabric Content : Cotton 59%,Viscose 5%,Polyester 36%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B8542A5_24SP_NV31_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B8542A5_24SP_NV31_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B8542A5_24SP_NV31_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B8542A5_24SP_NV31_04_02.jpg'],
// //       sizes: ['9-12 MONTHS','12-18 MONTHS','18-24 MONTHS','24-36 MONTHS','3/4 Age','4/5 Age','5/6 Age'], 
// //       colors: [''],
// //       price:1299,
// //       offer:0
// //     },
// // {//11
// //   categoryName:'BABY',

// //       name: 'Baby Boy Marvel Comics Regular Fit Cardigan',
// //       description: 'Main Fabric Content : Cotton 65%,Polyester 35%',
// //       images: ['https://dfcdn.defacto.com.tr/6/C0632A5_24SP_ER42_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0632A5_24SP_ER42_03_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0632A5_24SP_ER42_05_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0632A5_24SP_ER42_08_01.jpg'],
// //       sizes: ['12-18 MONTHS','18-24 MONTHS','24-36 MONTHS','3/4 Age','4/5 Age','5/6 Age'], 
// //       colors: [''],
// //       price:1299,
// //       offer:0
// //     },

// //   ]








// //   const products = [
// //     {//1
// //       categoryName:'KIDS',

// //       name: 'Girl Balloon Sleeve Short Dress',
// //       description:'Main Fabric Content : Polyester 100% ' ,
// //       images: ['https://dfcdn.defacto.com.tr/6/C0530A8_24SM_BK81_01_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0530A8_24SM_BK81_02_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C0530A8_24SM_BK81_05_01.jpg',
// //                 'https://dfcdn.defacto.com.tr/6/C0530A8_24SM_BK81_06_01.jpg'],
// //       sizes:  ['5/6 Age','7/8 Age','9/10 Age','11/12 Age','13/14 Age'],
// //       colors: [''],
// //       price: 1299,
// //       offer:0
// //     },
// //     {//2
// //       categoryName:'KIDS',

// //       name: 'Girl Cargo Jogger Wide Leg Cotton Trousers',
// //       description:'Model Measurements:Height: 1.33 Sample size: 7/8 Age Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B4077A8_23AU_KH450_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4077A8_23AU_KH450_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4077A8_23AU_KH450_04_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4077A8_23AU_KH450_08_01.jpg'],
// //       sizes:  ['5/6 Age','7/8 Age','8/9 Age','9/10 Age'],
// //       colors: [''],
// //       price: 1499,
// //       offer:0
// //     },
// //    {//3
// //     categoryName:'KIDS',

// //       name: 'Girl Printed Sweatshirt Fabric Short Sleeve',
// //       description:'Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B4475A8_24SM_GN225_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4475A8_24SM_GN225_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4475A8_24SM_GN225_05_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4475A8_24SM_NV245_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B4475A8_24SM_NV245_05_01.jpg'],
// //       sizes:  ['5/6 Age','7/8 Age','8/9 Age','9/10 Age','11/12 Age'],
// //       colors: ['Light Green','NAVY'],
// //       price: 799,
// //       offer:0
// //     },
// //   {//4
// //     categoryName:'KIDS',

// //       name: 'Regular Fit Knitted Dress',
// //       description:'Model Measurements:Height: 1.33 Sample size: 8/9 Age Main Fabric Content : Cotton 22%,Elastane 4%,Polyester 74%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B1169A8_23WN_GR210_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B1169A8_23WN_GR210_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B1169A8_23WN_GR210_05_03.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B1169A8_23WN_GR210_08_02.jpg'],
// //       sizes:  ['7/8 Age','8/9 Age','11/12 Age'],
// //       colors: [''],
// //       price: 799,
// //       offer:0
// //     },
// //   {//5
// //     categoryName:'KIDS',

// //       name: 'Girl Patterned Blouse',
// //       description:'Main Fabric Content : Elastane 1%,Polyester 99%',
// //       images: ['https://dfcdn.defacto.com.tr/6/C3553A8_24SM_ER105_01_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C3553A8_24SM_ER105_02_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C3553A8_24SM_ER105_04_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/C3553A8_24SM_ER105_06_01.jpg'],
// //       sizes:  ['8/9 Age','9/10 Age','11/12 Age','13/14 Age'],
// //       colors: [''],
// //       price: 349,
// //       offer:0
// //     },
// //   {//6
// //     categoryName:'KIDS',

// //       name: 'Girl Undershirt',
// //       description:'Model Measurements:Height: 1.33 Sample size: 7/8 Age Main Fabric Content : Cotton 98%,Elastane 2%',
// //       images: ['https://dfcdn.defacto.com.tr/6/A1800A8_23HS_BE124_01_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A1800A8_23HS_BE124_04_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A1800A8_23HS_RD197_04_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A1800A8_23HS_RD197_05_01.jpg'],
// //       sizes:  ['8/9 Age','11/12 Age'],
// //       colors: ['Royal','Red'],
// //       price: 249,
// //       offer:20
// //     },
// //   {//7
// //     categoryName:'KIDS',

// //       name: 'Boy Hooded Gabardine Long Sleeve Shirt',
// //       description:'Model Measurements:Height: 1.37 Sample size: 8/9 Age Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B7443A8_24SM_BE770_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B7443A8_24SM_BE770_08_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B7443A8_24SM_BE770_04_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B7443A8_24SM_BE770_09_01.jpg'],
// //       sizes:  ['5/6 Age','8/9 Age','9/10 Age','11/12 Age','13/14 Age'],
// //       colors: [''],
// //       price: 999,
// //       offer:0
// //     },
// //  {//8
// //   categoryName:'KIDS',

// //       name: 'Boy Oversize Fit Polo Neck Jean Shirt',
// //       description:'Model Measurements:Height: 1.37 Sample size: 8/9 Age Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B6464A8_24SP_NM39_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6464A8_24SP_NM39_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6464A8_24SP_NM39_06_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6464A8_24SP_NM39_08_01.jpg'],
// //       sizes:  ['9/10 Age','11/12 Age'],
// //       colors: [''],
// //       price: 1299,
// //       offer:0
// //     },
// //  {//9
// //   categoryName:'KIDS',

// //       name: 'Boy Regular Fit Stand Collar Long Sleeve Shirt',
// //       description:'Model Measurements:Height: 1.37 Sample size: 8/9 Age Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B6118A8_24SM_ER238_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6118A8_24SM_ER238_04_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6118A8_24SM_ER238_07_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6118A8_24SM_ER238_09_01.jpg'],
// //       sizes:  ['8/9 Age','9/10 Age','11/12 Age','13/14 Age'],
// //       colors: [''],
// //       price: 899,
// //       offer:0
// //     },
// //  {//10
// //   categoryName:'KIDS',

// //       name: 'Boy Regular Fit Shaquille ONeal Licensed Undershirt',
// //       description:'Model Measurements:Height: 1.37 Sample size: 7/8 Age Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/A8735A8_23SM_WT34_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A8735A8_23SM_WT34_01_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A8735A8_23SM_WT34_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A8735A8_23SM_WT34_08_01.jpg'],
// //       sizes:  ['7/8 Age','8/9 Age','11/12 Age','13/14 Age'],
// //       colors: [''],
// //       price: 399,
// //       offer:20
// //     },
// //  {//11
// //   categoryName:'KIDS',

// //       name: 'Girl Waterproof Faux Leather Jacket',
// //       description:'Main Fabric Content : Cotton 8%,Viscose 2%,Polyester 90%',
// //       images: ['https://dfcdn.defacto.com.tr/6/U4290A6_22AU_OG163_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/U4290A6_22AU_ER48_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/U4290A6_22AU_ER48_05_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/U4290A6_22AU_TR157_01_02.jpg'],
// //       sizes:  ['5/4 Age','10/11 Age'],
// //       colors: ['Salmon','Light Stone','Mint'],
// //       price: 1499,
// //       offer:0
// //     },
// //  {//12
// //   categoryName:'KIDS',

// //       name: 'Girl Jean Jacket',
// //       description:'Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9857A8_24SP_NM63_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9857A8_24SP_NM63_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9857A8_24SP_NM63_06_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B9857A8_24SP_NM63_07_01.jpg'],
// //       sizes:  ['7/8 Age'],
// //       colors: [''],
// //       price: 1499,
// //       offer:0
// //     },
// //  {//13
// //   categoryName:'KIDS',

// //       name: 'Oversize Fit Long Sleeve Shirt',
// //       description:'Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/A4451A8_23AU_NV31_02_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A4451A8_23AU_NV31_03_02.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A4451A8_23AU_NV31_08_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/A4451A8_23AU_NV31_09_01.jpg'],
// //       sizes:  ['7/8 Age','8/9 Age','9/10 Age','11/12 Age','13/14 Age'],
// //       colors: [''],
// //       price: 899,
// //       offer:0
// //     },
// //  {//14
// //   categoryName:'KIDS',

// //       name: 'Boy Jogger Pants',
// //       description:'Main Fabric Content : Cotton 98%,Elastane 2%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B6713A8_24SM_BG732_01_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6713A8_24SM_BG732_07_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6713A8_24SM_BK81_01_01.jpg',
// //                'https://dfcdn.defacto.com.tr/6/B6713A8_24SM_BK81_03_01.jpg'],
// //       sizes:  ['7/8 Age','8/9 Age','9/10 Age','11/12 Age'],
// //       colors: ['Beige','Black'],
// //       price: 999,
// //       offer:0
// //     },
// // ];







// //   const products = [
// //     //{//1
// // //       categoryName:'MEN',
// // //       name: 'Modern Fit Buttondown Polo Neck Long Sleeve Shirt',
// // //       description: 'Model Measurements:Height: 1.88Bust: 99Waist: 77Hips: 97 Main Fabric Content : Cotton 59%,Polyester 41%',
// // //       images: ['https://dfcdn.defacto.com.tr/6/R4352AZ_23AU_WT34_01_02.jpg',
// // //        'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_02_01.jpg',
// // //        'https://dfcdn.defacto.com.tr/6/R4352AZ_23AU_WT34_06_01.jpg',
// // //        'https://dfcdn.defacto.com.tr/6/R4352AZ_23SP_BE417_03_01.jpg',
// // // 'https://dfcdn.defacto.com.tr/6/R4352AZ_23AU_BK27_04_01.jpg'],
// // //       sizes: ['XS', 'S', 'M','L','XL'], 
// // //       colors: ['white,black,'],
// // //       price:699,
// // //       offer:10
// // //     },
// // //     {//2
// // //       categoryName:'MEN',
// // //       name: 'Modern Fit Polo Collar Long Sleeve Shirt',
// // //       description: 'Model Measurements:Height: 1.88Bust: 100Waist: 84Hips: 96 Sample size: M Main Fabric Content : Cotton 70%,Polyester 30% ',
// // //       images: ['https://dfcdn.defacto.com.tr/6/A5311AX_23AU_WT33_01_01.jpg',
// // //        'https://dfcdn.defacto.com.tr/6/A5311AX_23AU_WT33_04_01.jpg',
// // //        'https://dfcdn.defacto.com.tr/6/A5311AX_23AU_WT33_03_01.jpg',
// // //        'https://dfcdn.defacto.com.tr/6/A5311AX_23AU_WT33_05_01.jpg',
// // //       'https://dfcdn.defacto.com.tr/6/A5311AX_23AU_WT33_06_01.jpg'],
// // //       sizes: ['XS', 'S', 'M','L'], 
// // //       colors: ['Black','Fushsia'],
// // //       price:1299,
// // //       offer:0
// // //     },
// //     // {//3
// //     //   categoryName:'MEN',
// //     //   name: 'Oversize Fit Polo Collar Cotton Long Sleeve Shirt',
// //     //   description: 'Main Fabric Content : Cotton 100%',
// //     //   images: ['https://dfcdn.defacto.com.tr/6/C2841AX_24SP_BG734_01_01.jpg',
// //     //    'https://dfcdn.defacto.com.tr/6/C2841AX_24SP_BG734_04_01.jpg',
// //     //    'https://dfcdn.defacto.com.tr/6/C2841AX_24SP_BK81_05_01.jpg',
// //     //    'https://dfcdn.defacto.com.tr/6/C2841AX_24SP_KH502_06_01.jpg',
// //     //   'https://dfcdn.defacto.com.tr/6/C2841AX_24SP_KH502_03_01.jpg'],
// //     //   sizes: [ 'S', 'M','L'], 
// //     //   colors: ['Teak,Black,Stone'],
// //     //   price:1299,
// //     //   offer:30
// //     // },
// //     // {//4
// //     //   categoryName:'MEN',
// //     //   name: 'Regular Fit Crew Neck Basic Short Sleeve T-Shirt',
// //     //   description: 'Main Fabric Content : Cotton 100%',
// //     //   images: ['https://dfcdn.defacto.com.tr/6/M7666AZ_23AU_BK81_01_01.jpg',
// //     //    'https://dfcdn.defacto.com.tr/6/M7666AZ_23AU_BK81_02_01.jpg',
// //     //    'https://dfcdn.defacto.com.tr/6/M7666AZ_23AU_BK81_04_01.jpg',
// //     //    'https://dfcdn.defacto.com.tr/6/M7666AZ_23AU_BE103_04_01.jpg',
// //     //   'https://dfcdn.defacto.com.tr/6/M7666AZ_23AU_GR439_03_01.jpg',
// //     //   'https://dfcdn.defacto.com.tr/6/M7666AZ_23AU_GR439_05_01.jpg'],
// //     //   sizes: ['XS', 'S', 'M','L','XL','XXL'], 
// //     //   colors: ['Dark Grey,Sax,Black'],
// //     //   price:199,
// //     //   offer:20
// //     // },
// //     {//5
// //       categoryName:'MEN',
// //       name: 'DeFactoFit Standard Fit Jacket',
// //       description: 'Model Measurements:Height: 1.75Bust: 82Waist: 60Hips: 89 Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B5162AX_24SP_BK81_01_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B5162AX_24SP_BK81_02_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B5162AX_24SP_BK81_04_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B5162AX_24SP_BK81_05_01.jpg'],
// //       sizes: ['XS', 'S', 'M','L'], 
// //       colors: [''],
// //       price:1499,
// //       offer:20
// //     },
// //     {//6
// //       categoryName:'MEN',

// //       name: 'DeFactoFit Standard Fit Flexible Leg Jogger',
// //       description: 'Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B4373AX_24SP_GR91_01_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B4373AX_24SP_GR91_02_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B4373AX_24SP_GR91_06_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B4373AX_24SP_GR91_07_01.jpg'],
// //       sizes: ['XS', 'S', 'M','L'], 
// //       colors: [''],
// //       price:999,
// //       offer:20
// //     },
// //     {//7
// //       categoryName:'MEN',

// //       name: '90’S Slim Fit Jeans',
// //       description: 'Model Measurements:Height: 1.85Bust: 91Waist: 71Hips: 92 Sample size: 30 Main Fabric Content : Cotton 100%',
// //       images: ['https://dfcdn.defacto.com.tr/6/B9590AX_24SP_NM34_01_01.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B9590AX_24SP_NM34_02_01.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B9590AX_24SP_NM34_04_01.jpg',
// //        'https://dfcdn.defacto.com.tr/6/B9590AX_24SP_NM34_05_01.jpg'],
// //       sizes: ['XS', 'S', 'M','L','XL'], 
// //       colors: [''],
// //       price:999,
// //       offer:10
// //     },
// //     {//8
// //       categoryName:'MEN',

// //       name: 'Carlo Skinny Fit Extra Slim Fit Normal Waist Jeans',
// //       description: 'Model Measurements:Height: 1.88Bust: 90Waist: 74Hips: 91 Sample size: 30 Size - 32 Length Main Fabric Content : Cotton 99%,Elastane 1%',
// //       images: ['https://dfcdn.defacto.com.tr/6/A6943AX_23AU_NM84_02_03.jpg',
// //        'https://dfcdn.defacto.com.tr/6/A6943AX_23AU_NM84_01_03.jpg',
// //        'https://dfcdn.defacto.com.tr/6/A6943AX_23AU_NM84_04_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/A6943AX_23AU_NM84_05_02.jpg'],
// //       sizes: ['XS', 'S', 'M','L','XL'], 
// //       colors: [''],
// //       price:1299,
// //       offer:15
// //     },
// //     {//9
// //       categoryName:'MEN',

// //       name: 'Modern Fit Lined Blazer',
// //       description: 'Model Measurements:Height: 1.89Bust: 91Waist: 78Hips: 95 Sample size: 50 Main Fabric Content : Viscose 24%,Polyester 76%',
// //       images: ['https://dfcdn.defacto.com.tr/6/C5777AX_24SP_BK81_01_01.jpg',
// //        'https://dfcdn.defacto.com.tr/6/C5777AX_24SP_BK81_02_01.jpg',
// //        'https://dfcdn.defacto.com.tr/6/C5777AX_24SP_BK81_04_01.jpg',
// //        'https://dfcdn.defacto.com.tr/6/C5777AX_24SP_BK81_05_01.jpg'],
// //       sizes: ['XS', 'S', 'M','L','XL'], 
// //       colors: [''],
// //       price:3499,
// //       offer:30
// //     },
// //     {//10
// //       categoryName:'MEN',

// //       name: 'Defacto Fit Slim Fit Sportsman Jogger',
// //       description: 'Model Measurements:Height: 1.89Bust: 100Waist: 81Hips: 96 Sample size: M Main Fabric Content : Cotton 73%,Polyester 27%',
// //       images: ['https://dfcdn.defacto.com.tr/6/S3309AZ_23SP_KH379_01_05.jpg',
// //        'https://dfcdn.defacto.com.tr/6/S3309AZ_23SP_KH379_02_05.jpg',
// //        'https://dfcdn.defacto.com.tr/6/S3309AZ_24SP_BE808_04_02.jpg',
// //        'https://dfcdn.defacto.com.tr/6/S3309AZ_23SP_BG73_01_04.jpg'],
// //       sizes: ['XS', 'S', 'M','L','XL'], 
// //       colors: ['Light Khaki','Blue','Vison'],
// //       price:1299,
// //       offer:10
// //     },
// //   ];
  


//   // const products = [
//   //   {//1
//   //     name: 'Afra x DeFacto Biker Jean Jacket',
//   //     description: 'Main Fabric Content : Cotton 100%',
//   //        images: ['https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_01_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_02_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_05_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_04_01.jpg'],
//   //    sizes: ['XS', 'S', 'M','L','XL'], 
//   //     colors: [''],
//   //     price:2499,
//   //     offer:10
//   //   },]
//   // const products = [
//   //   {//1
//   //     name: 'Afra x DeFacto Biker Jean Jacket',
//   //     description: 'Main Fabric Content : Cotton 100%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_01_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_02_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_05_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C1419AX_24SM_NM28_04_01.jpg'],
//   //     sizes: ['XS', 'S', 'M','L','XL'], 
//   //     colors: [''],
//   //     price:2499,
//   //     offer:10
//   //   },
//   //   {//2
//   //     name: 'Half Turtleneck Long Sleeve Dress',
//   //     description: 'Model Measurements:Height: 1.78Bust: 83Waist: 62Hips: 90 Main Fabric Content : Polyamide 11%,Viscose 89% ',
//   //     images: ['https://dfcdn.defacto.com.tr/7/Z0500AZ_23SM_BK27_02_03.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/Z0500AZ_23SM_BK27_03_03.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/Z0500AZ_23SM_BK27_10_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/Z0500AZ_23SM_PN214_03_03.jpg',
//   //     'https://dfcdn.defacto.com.tr/7/Z0500AZ_23SM_PN214_04_02.jpg'],
//   //     sizes: ['XS', 'S', 'M','L'], 
//   //     colors: ['Black','Fushsia'],
//   //     price:1299,
//   //     offer:20
//   //   },
//   //   {//3
//   //     name: 'Relax Fit Long Sleeve Tunic',
//   //     description: 'Model Measurements:Height: 1.74Bust: 84Waist: 60Hips: 90 Main Fabric Content : Cotton 93%,Linen 7%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/B9835AX_24SP_BG759_01_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B9835AX_24SP_BG759_02_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B9835AX_24SP_BG759_06_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B9835AX_24SP_BG759_05_02.jpg'],
//   //     sizes: [ 'S', 'M','L'], 
//   //     colors: [''],
//   //     price:1499,
//   //     offer:30
//   //   },
//   //   {//4
//   //     name: 'Oversize Fit P.Cezanne Licensed Crew Neck Printed Short Sleeve T-Shirt',
//   //     description: 'Main Fabric Content : Cotton 100%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/C3775AX_24SM_BK81_01_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C3775AX_24SM_BK81_05_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C3775AX_24SM_BK81_02_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C3775AX_24SM_BK81_07_01.jpg',
//   //     'https://dfcdn.defacto.com.tr/7/C3775AX_24SM_BK81_06_01.jpg'],
//   //     sizes: ['XS', 'S', 'M','L','XL','XXL'], 
//   //     colors: [''],
//   //     price:799,
//   //     offer:20
//   //   },
//   //   {//5
//   //     name: 'Lina Comfort Fit High Comfortable Fit Slim Leg Jeans',
//   //     description: 'Model Measurements:Height: 1.75Bust: 82Waist: 60Hips: 89 Main Fabric Content : Cotton 100%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/Z6556AZ_23SP_NM40_02_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/Z6556AZ_23SP_NM40_04_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/Z6556AZ_23SP_NM40_06_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/Z6556AZ_23SP_NM40_05_01.jpg'],
//   //     sizes: ['XS', 'S', 'M','L'], 
//   //     colors: [''],
//   //     price:899,
//   //     offer:10
//   //   },
//   //   {//6
//   //     name: 'Wide Leg High Waist Long Gabardine Cargo Pants',
//   //     description: 'Main Fabric Content : Cotton 100%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/C2666AX_24SP_BN539_01_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C2666AX_24SP_BN539_03_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C2666AX_24SP_BN539_04_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/C2666AX_24SP_BN539_05_01.jpg'],
//   //     sizes: ['XS', 'S', 'M','L'], 
//   //     colors: [''],
//   //     price:1699,
//   //     offer:10
//   //   },
//   //   {//7
//   //     name: 'Palazzo Linen Blend Trousers',
//   //     description: 'Model Measurements:Height: 1.74Bust: 84Waist: 60Hips: 90 Main Fabric Content : Cotton 40%,Viscose 53%,Linen 7%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/B7503AX_24SP_BG404_01_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B7503AX_24SP_BG404_02_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B7503AX_24SP_BG404_05_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B7503AX_24SP_BG404_02_02.jpg'],
//   //     sizes: ['XS', 'S', 'M','L','XL'], 
//   //     colors: [''],
//   //     price:1299,
//   //     offer:20
//   //   },
//   //   {//8
//   //     name: 'High Waist Linen Look Trousers with Jogger Pockets',
//   //     description: 'Model Measurements:Height: 1.81Bust: 87Waist: 65Hips: 91  Main Fabric Content : Polyamide 15%,Viscose 85%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/R0433AZ_23AU_BG159_02_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/R0433AZ_23AU_BK27_02_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/R0433AZ_24SM_BK81_07_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/R0433AZ_23SP_GN1181_01_02.jpg'],
//   //     sizes: ['XS', 'S', 'M','L','XL'], 
//   //     colors: ['Beige','Black','Mint'],
//   //     price:899,
//   //     offer:15
//   //   },
//   //   {//9
//   //     name: 'Crop Jean Shirt',
//   //     description: 'Main Fabric Content : Cotton 100%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/B8265AX_24SP_NM85_01_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B8265AX_24SP_NM85_03_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B8265AX_24SP_NM85_02_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/B8265AX_24SP_NM85_05_01.jpg'],
//   //     sizes: ['XS', 'S', 'M','L','XL'], 
//   //     colors: [''],
//   //     price:1499,
//   //     offer:20
//   //   },
//   //   {//10
//   //     name: 'Wrap Collar Striped Linen Look Butterfly Sleeve Midi Short Sleeve Dress',
//   //     description: 'Model Measurements:Height: 1.68 Main Fabric Content : Cotton 100%',
//   //     images: ['https://dfcdn.defacto.com.tr/7/A6460AX_23SM_BG737_05_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/A6460AX_23SM_BG737_08_02.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/A6460AX_23SM_BG737_09_01.jpg',
//   //      'https://dfcdn.defacto.com.tr/7/A6460AX_23SM_BG737_01_02.jpg'],
//   //     sizes: ['XS', 'S', 'M','L','XL'], 
//   //     colors: [''],
//   //     price:1299,
//   //     offer:10
//   //   },
//   // ];


//   addProducts(products);

//   return (
//     <Text>Add producttt</Text>
    
//   );
// };
// export default AddProducts;