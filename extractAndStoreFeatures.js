// extractAndStoreFeatures.js
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const admin = require('firebase-admin');
const serviceAccount = require('path/to/serviceAccountKey.json');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const extractFeatures = async (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);
  const tfImage = tf.node.decodeImage(imageBuffer).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
  const model = await mobilenet.load();
  const features = model.infer(tfImage, true);
  return features.dataSync();
};

const saveFeaturesToFirestore = async () => {
  const productImages = [
    // List of product image paths
    // 'path/to/product1.jpg',
    // 'path/to/product2.jpg',
  ];

  for (const imagePath of productImages) {
    const features = await extractFeatures(imagePath);
    const productDoc = {
      imagePath,
      features: Array.from(features),
    };
    await firestore.collection('products').add(productDoc);
  }
};

saveFeaturesToFirestore();
