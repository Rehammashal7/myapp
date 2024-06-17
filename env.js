
// // import 'react-native-get-random-values';
// // import axios from 'axios';
// // import jwt from 'react-native-jwt-io';
// // import { v4 as uuidv4 } from 'uuid';
// // //import jwt from 'jsonwebtoken'

// import { Buffer } from 'buffer';
// import { v4 as uuidv4 } from 'uuid';
// import * as Crypto from 'expo-crypto';
// import { TextEncoder, TextDecoder } from 'text-encoding';

// import 'react-native-get-random-values';
// import axios from 'axios';

// import { KJUR, b64utoutf8, utf8tob64u } from 'jsrsasign';

// const base64UrlEncode = (str) => {
//   return utf8tob64u(str);
// };

// const createJWT =async (payload, privateKey) => {
//   const header = {
//     alg: 'RS256',
//     typ: 'JWT'
//   };

//   const encodedHeader = base64UrlEncode(JSON.stringify(header));
//   const encodedPayload = base64UrlEncode(JSON.stringify(payload));

//   const data = `${encodedHeader}.${encodedPayload}`;

//   const signature = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
//   signature.init(privateKey);
//   signature.updateString(data);
//   const sig = signature.sign();
  
//   return `${data}.${sig}`;
// };

// const createMyJWT = async () => {
//   const now = Math.floor(Date.now() / 1000);
//   const payload = {
//     iss: dialogflowConfig.client_email,
//     sub: dialogflowConfig.client_email,
//     aud: dialogflowConfig.token_uri,
//     iat: now,
//     exp: now + 3600 // Expiration time set to 1 hour
//   };

//   const token = await createJWT(payload, dialogflowConfig.private_key);
//   console.log('token',token);
//   return token;
// };

// const getAccessToken = async () => {
//   const jwtToken = createMyJWT();
//   try {
//     const response = await axios.post(dialogflowConfig.token_uri, {
//       grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
//       assertion: jwtToken
//     });

//     console.log('Full response:', response);

//     if (response.data && response.data.access_token) {
//       console.log('response.data.access_token', response.data.access_token);
//       return response.data.access_token;
//     } else {
//       console.error('Access token not found in response:', response.data);
//       throw new Error('Access token not found');
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error('Error response data:', error.response.data);
//       console.error('Error response status:', error.response.status);
//       console.error('Error response headers:', error.response.headers);
//     } else {
//       console.error('Error message:', error.message);
//     }
//     throw error;
//   }
// };

// // مثال على كيفية استخدام getAccessToken
// getAccessToken().then(accessToken => {
//   console.log('Access Token:', accessToken);
// }).catch(error => {
//   console.error('Error:', error);
// });

// // const getAccessToken = async () => {
// //   const jwtToken = await createMyJWT();
// //   const response = await axios.post(dialogflowConfig.token_uri, {
// //     grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
// //     assertion: jwtToken
// //   });
// //   console.log('response.data.access_token',response.data.access_token);

// //   return response.data.access_token;
// // };

// export const dialogflowConfig={
//   "type": "service_account",
//   "project_id": "chatbot-phql",
//   "private_key_id": "6140762e93e128ac197469a38e3e75ef7e421695",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsZ1p0aheoYNn5\nEPozj0SzPv/CmEUat0797W+QWNOPPM8zY/wlRrmT14s+7E4VG6v7PGwW/1o8/BLW\naUGmHRQ7Wf7uR5yYM5kukTG7BjPerCFb8sLnX5mj11WksjiMXaFYH8AM6UIRUG2b\n6brx4kf/c6RgbbPnIK4jJkaSbEj6zgaCd2FxOHVSgpsigX3H9sBPBOn9YOmeS2B9\nEk6Kq789Iqe53/vedAaPRfq80ft1OuD6nW4nVwSYNIkAj/Ntt9sNBO41qht7gFJV\nRq8LX5BoslaO+2D21eVFWYu0cenHHs3sjJZ7KPD2xrESe6pSxfLxbs5CXKhsjdIM\n51E+oHm/AgMBAAECggEACIw8noupY0kfWuCjRxh8s4EVdTR6LfpAtF5Sqw7RuRxZ\nZEGPfYRQLIBXVbtUSRT3e0a3pTxBNnIuYkBoZ4VcPMUYMAA6R2GSNWOFhQb9s2Cd\nbCL71DTtN9kJVK0cGKQxHQlrSuNAdKikMULEE2drYm2oDLqOXOXwkaroJ4JZlqBj\nf0Sax65f6cMybYe6w04BTCmd94QHRHCNrYCgLWHnE8e7/+y7BjjKc9iQAk686ASL\nn6wY7MPRr8Jo9hoSex2se2LQuGZKKLpYukGp3TeCeCXXNH41pRetgYH53NltzaBr\nujz4Z2HQcn8zfvI/9DyK+87Li+70uG2jv3vZw5QIQQKBgQDjTkFFuwOs1j6NME4j\nLK8wj5ur72w9uCbvNqhfwu3LzfdkAGfG3VeW1kf3vT1q+iXdllDuIUn4rZrGb9tz\n4xMT69BloSpcQrWMQtX0jfD0DP1odPeQnJU1BiDU5DsEvc2BvQJrjD9nZhjHsBWP\ngIqj3wpK/AcynKC138ARQLnkZwKBgQDCKtqpMBMzM9p3kPePGefrzvBFNqly0k10\nQ7YQjWHJztsGnSeCMQb0Iw/8eCsNy4n1gid598+cY7ZhkP3GdboiVQyAjaTWTfjG\nVvPsQ/fTvr3o+wUC1IdJGi5CTbJTg/FIZ5R22sdOMGD3FNduqb/VtvdrbJV8yzkm\nfM+K1JSo6QKBgDqyzrBPJxfPC8AyJTt4IpWLwEuaPH2DvKoxlzGDiR0ER0qPwDze\nk+vj0hnryJyDlJuwYZ3dAtkxG7L619UJYrfWQa68+89veqqJ5+6LaRnc8OO0sOmr\nRey3dGsFtSf4S8WhJarYQNdWyjdnBWpVa3f99Q6AHuu2/tl4uoS6DkcpAoGAXCJt\no762PaOrVPUrI3JNhK2rgYxQl7WHH1ZJ/Ey6TEKl19uWtcaB4DMLEOgMtf0RN7hM\n9ylKEJGYJ2/fm96dNlFZH18XCsHw/FyiXkhaPtXR083ZMOCcWWnc7YVkyxBe29aa\nslNaI5X9TQFMwKw35Tdu7ECYJqFgOw0ahmwdJpECgYBLGpMgghEncpPbiu7LWEfF\n3TcFtqHRREe30e/s4bsladcGHfpSFNE1ZrLkSocZWHWyfIiPYO///enohe3v1+Ko\ne9+7MlSmCWZliNiPrdumNkNip+yGuITL8Lt7npMlG38Uiprvut1mNsjDSjs4ZmjR\nFEiW47sBGgOvjgvBODevWA==\n-----END PRIVATE KEY-----\n",
//   "client_email": "chatbot-atoz@chatbot-phql.iam.gserviceaccount.com",
//   "client_id": "111646448023610404955",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/chatbot-atoz%40chatbot-phql.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }

// // إعداد ملف التكوين لـ Dialogflow
// const dialogflowConfig2 = {
//   type: "service_account",
//   project_id: "chatbot-phql",
//   private_key_id: "6140762e93e128ac197469a38e3e75ef7e421695",
//    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsZ1p0aheoYNn5\nEPozj0SzPv/CmEUat0797W+QWNOPPM8zY/wlRrmT14s+7E4VG6v7PGwW/1o8/BLW\naUGmHRQ7Wf7uR5yYM5kukTG7BjPerCFb8sLnX5mj11WksjiMXaFYH8AM6UIRUG2b\n6brx4kf/c6RgbbPnIK4jJkaSbEj6zgaCd2FxOHVSgpsigX3H9sBPBOn9YOmeS2B9\nEk6Kq789Iqe53/vedAaPRfq80ft1OuD6nW4nVwSYNIkAj/Ntt9sNBO41qht7gFJV\nRq8LX5BoslaO+2D21eVFWYu0cenHHs3sjJZ7KPD2xrESe6pSxfLxbs5CXKhsjdIM\n51E+oHm/AgMBAAECggEACIw8noupY0kfWuCjRxh8s4EVdTR6LfpAtF5Sqw7RuRxZ\nZEGPfYRQLIBXVbtUSRT3e0a3pTxBNnIuYkBoZ4VcPMUYMAA6R2GSNWOFhQb9s2Cd\nbCL71DTtN9kJVK0cGKQxHQlrSuNAdKikMULEE2drYm2oDLqOXOXwkaroJ4JZlqBj\nf0Sax65f6cMybYe6w04BTCmd94QHRHCNrYCgLWHnE8e7/+y7BjjKc9iQAk686ASL\nn6wY7MPRr8Jo9hoSex2se2LQuGZKKLpYukGp3TeCeCXXNH41pRetgYH53NltzaBr\nujz4Z2HQcn8zfvI/9DyK+87Li+70uG2jv3vZw5QIQQKBgQDjTkFFuwOs1j6NME4j\nLK8wj5ur72w9uCbvNqhfwu3LzfdkAGfG3VeW1kf3vT1q+iXdllDuIUn4rZrGb9tz\n4xMT69BloSpcQrWMQtX0jfD0DP1odPeQnJU1BiDU5DsEvc2BvQJrjD9nZhjHsBWP\ngIqj3wpK/AcynKC138ARQLnkZwKBgQDCKtqpMBMzM9p3kPePGefrzvBFNqly0k10\nQ7YQjWHJztsGnSeCMQb0Iw/8eCsNy4n1gid598+cY7ZhkP3GdboiVQyAjaTWTfjG\nVvPsQ/fTvr3o+wUC1IdJGi5CTbJTg/FIZ5R22sdOMGD3FNduqb/VtvdrbJV8yzkm\nfM+K1JSo6QKBgDqyzrBPJxfPC8AyJTt4IpWLwEuaPH2DvKoxlzGDiR0ER0qPwDze\nk+vj0hnryJyDlJuwYZ3dAtkxG7L619UJYrfWQa68+89veqqJ5+6LaRnc8OO0sOmr\nRey3dGsFtSf4S8WhJarYQNdWyjdnBWpVa3f99Q6AHuu2/tl4uoS6DkcpAoGAXCJt\no762PaOrVPUrI3JNhK2rgYxQl7WHH1ZJ/Ey6TEKl19uWtcaB4DMLEOgMtf0RN7hM\n9ylKEJGYJ2/fm96dNlFZH18XCsHw/FyiXkhaPtXR083ZMOCcWWnc7YVkyxBe29aa\nslNaI5X9TQFMwKw35Tdu7ECYJqFgOw0ahmwdJpECgYBLGpMgghEncpPbiu7LWEfF\n3TcFtqHRREe30e/s4bsladcGHfpSFNE1ZrLkSocZWHWyfIiPYO///enohe3v1+Ko\ne9+7MlSmCWZliNiPrdumNkNip+yGuITL8Lt7npMlG38Uiprvut1mNsjDSjs4ZmjR\nFEiW47sBGgOvjgvBODevWA==\n-----END PRIVATE KEY-----\n",
// client_email: "chatbot-atoz@chatbot-phql.iam.gserviceaccount.com",
//   client_id: "111646448023610404955",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/chatbot-atoz%40chatbot-phql.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com"
// };

// // const createJWT = () => {
// //   const now = Math.floor(Date.now() / 1000);
// //   const payload = {
// //     iss: dialogflowConfig.client_email,
// //     sub: dialogflowConfig.client_email,
// //     aud: dialogflowConfig.token_uri,
// //     iat: now,
// //     exp: now + 3600 // Expiration time set to 1 hour
// //   };
// //   console.log('dialogflowConfig.client_email',dialogflowConfig.client_email)

// //   const token = jwt.(payload, dialogflowConfig.private_key, 'RS256');
// //   console.log('tokeen',token)

// //   return token;
// // };

// // const getAccessToken = async () => {
// //   const jwtToken = createJWT();
// //   const response = await axios.post(dialogflowConfig.token_uri, {
// //     grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
// //     assertion: jwtToken
// //   });

// //   return response.data.access_token;
// // };


// export const sendQueryToDialogflow = async (query, sessionId) => {
//   try {
//     const accessToken = await getAccessToken();
//     console.log('accessToken',accessToken)

//     const response = await axios.post(
//       `https://dialogflow.googleapis.com/v2/projects/${dialogflowConfig.project_id}/agent/sessions/${sessionId}:detectIntent`,
//       {
//         queryInput: {
//           text: {
//             text: query,
//             languageCode: 'en-US',
//           },
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error sending query to Dialogflow:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

import 'react-native-get-random-values';
import axios from 'axios';
import { KJUR, b64utoutf8, utf8tob64u } from 'jsrsasign';

// إعداد تكوين Dialogflow


const base64UrlEncode = (str) => {
  return utf8tob64u(str);
};

const createJWT = async (payload, privateKey) => {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
  signature.init(privateKey);
  signature.updateString(data);
  const sig = signature.sign();

  return `${data}.${sig}`;
};

const createMyJWT = async () => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: dialogflowConfig.client_email,
    sub: dialogflowConfig.client_email,
    aud: dialogflowConfig.token_uri, // استخدم العنوان الصحيح من التكوين
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    iat: now,
    exp: now + 3600 // Expiration time set to 1 hour
  };

  const token = await createJWT(payload, dialogflowConfig.private_key);
  console.log('token', token);
  return token;
};

const getAccessToken = async () => {
  const jwtToken = await createMyJWT(); // Ensure awaiting the JWT creation

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('assertion', jwtToken);

  try {
    const response = await axios.post(dialogflowConfig.token_uri, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Full response:', response);

    if (response.data && response.data.access_token) {
      console.log('response.data.access_token', response.data.access_token);
      return response.data.access_token;
    } else {
      console.error('Access token not found in response:', response.data);
      throw new Error('Access token not found');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const sendQueryToDialogflow = async (query, sessionId) => {
  try {
    const accessToken = await getAccessToken();
    console.log('accessToken', accessToken);

    const response = await axios.post(
      `https://dialogflow.googleapis.com/v2/projects/${dialogflowConfig.project_id}/agent/sessions/${sessionId}:detectIntent`,
      {
        queryInput: {
          text: {
            text: query,
            languageCode: 'en-US',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Corrected the template string usage
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending query to Dialogflow:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const dialogflowConfig={
  "type": "service_account",
  "project_id": "chatbot-phql",
  "private_key_id": "6140762e93e128ac197469a38e3e75ef7e421695",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsZ1p0aheoYNn5\nEPozj0SzPv/CmEUat0797W+QWNOPPM8zY/wlRrmT14s+7E4VG6v7PGwW/1o8/BLW\naUGmHRQ7Wf7uR5yYM5kukTG7BjPerCFb8sLnX5mj11WksjiMXaFYH8AM6UIRUG2b\n6brx4kf/c6RgbbPnIK4jJkaSbEj6zgaCd2FxOHVSgpsigX3H9sBPBOn9YOmeS2B9\nEk6Kq789Iqe53/vedAaPRfq80ft1OuD6nW4nVwSYNIkAj/Ntt9sNBO41qht7gFJV\nRq8LX5BoslaO+2D21eVFWYu0cenHHs3sjJZ7KPD2xrESe6pSxfLxbs5CXKhsjdIM\n51E+oHm/AgMBAAECggEACIw8noupY0kfWuCjRxh8s4EVdTR6LfpAtF5Sqw7RuRxZ\nZEGPfYRQLIBXVbtUSRT3e0a3pTxBNnIuYkBoZ4VcPMUYMAA6R2GSNWOFhQb9s2Cd\nbCL71DTtN9kJVK0cGKQxHQlrSuNAdKikMULEE2drYm2oDLqOXOXwkaroJ4JZlqBj\nf0Sax65f6cMybYe6w04BTCmd94QHRHCNrYCgLWHnE8e7/+y7BjjKc9iQAk686ASL\nn6wY7MPRr8Jo9hoSex2se2LQuGZKKLpYukGp3TeCeCXXNH41pRetgYH53NltzaBr\nujz4Z2HQcn8zfvI/9DyK+87Li+70uG2jv3vZw5QIQQKBgQDjTkFFuwOs1j6NME4j\nLK8wj5ur72w9uCbvNqhfwu3LzfdkAGfG3VeW1kf3vT1q+iXdllDuIUn4rZrGb9tz\n4xMT69BloSpcQrWMQtX0jfD0DP1odPeQnJU1BiDU5DsEvc2BvQJrjD9nZhjHsBWP\ngIqj3wpK/AcynKC138ARQLnkZwKBgQDCKtqpMBMzM9p3kPePGefrzvBFNqly0k10\nQ7YQjWHJztsGnSeCMQb0Iw/8eCsNy4n1gid598+cY7ZhkP3GdboiVQyAjaTWTfjG\nVvPsQ/fTvr3o+wUC1IdJGi5CTbJTg/FIZ5R22sdOMGD3FNduqb/VtvdrbJV8yzkm\nfM+K1JSo6QKBgDqyzrBPJxfPC8AyJTt4IpWLwEuaPH2DvKoxlzGDiR0ER0qPwDze\nk+vj0hnryJyDlJuwYZ3dAtkxG7L619UJYrfWQa68+89veqqJ5+6LaRnc8OO0sOmr\nRey3dGsFtSf4S8WhJarYQNdWyjdnBWpVa3f99Q6AHuu2/tl4uoS6DkcpAoGAXCJt\no762PaOrVPUrI3JNhK2rgYxQl7WHH1ZJ/Ey6TEKl19uWtcaB4DMLEOgMtf0RN7hM\n9ylKEJGYJ2/fm96dNlFZH18XCsHw/FyiXkhaPtXR083ZMOCcWWnc7YVkyxBe29aa\nslNaI5X9TQFMwKw35Tdu7ECYJqFgOw0ahmwdJpECgYBLGpMgghEncpPbiu7LWEfF\n3TcFtqHRREe30e/s4bsladcGHfpSFNE1ZrLkSocZWHWyfIiPYO///enohe3v1+Ko\ne9+7MlSmCWZliNiPrdumNkNip+yGuITL8Lt7npMlG38Uiprvut1mNsjDSjs4ZmjR\nFEiW47sBGgOvjgvBODevWA==\n-----END PRIVATE KEY-----\n",
  "client_email": "chatbot-atoz@chatbot-phql.iam.gserviceaccount.com",
  "client_id": "111646448023610404955",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/chatbot-atoz%40chatbot-phql.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}