import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { getAuth } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Voice from 'react-native-voice';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { KJUR } from 'jsrsasign';

const dialogflowConfig={
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

const createJWT = (payload, privateKey) => {
  const header = { alg: 'RS256', typ: 'JWT' };
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);
  
  const jwt = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, privateKey);
  return jwt;
};

const getAccessToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: dialogflowConfig.client_email,
    sub: dialogflowConfig.client_email,
    aud: dialogflowConfig.token_uri,
    iat: now,
    exp: now + 3600, // Expiration time set to 1 hour
    scope: 'https://www.googleapis.com/auth/drive.readonly'
  };

  const jwtToken = createJWT(payload, dialogflowConfig.private_key);

  console.log('JWT Token:', jwtToken); // Debugging JWT token

  try {
    const response = await axios.post(dialogflowConfig.token_uri, null, {
      params: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Access Token Response:', response.data); // Debugging response

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      const q = query(collection(db, 'users', auth.currentUser.uid, 'messages'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesFirestore = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
            quickReplies: data.quickReplies || null,
          };
        });
        setMessages(messagesFirestore);

        if (messagesFirestore.length === 0) {
          sendWelcomeMessage();
        }
      });

      return () => unsubscribe();
    } else {
    }

  
  }, []);

  const handleSend = async (newMessage = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
    const text = newMessage[0].text;

    const auth = getAuth();
    if (auth.currentUser) {
      await saveMessage(newMessage[0]);
    }

    try {
      const accessToken = await getAccessToken();

      const response = await axios.post(
        `https://dialogflow.googleapis.com/v2/projects/${dialogflowConfig.project_id}/agent/sessions/${uuidv4()}:detectIntent`,
        {
          queryInput: {
            text: {
              text,
              languageCode: 'en-US',
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Dialogflow Response:', response.data); // Debugging response
      handleResponse(response.data);
    } catch (error) {
      console.error('Error sending query to Dialogflow:', error.response ? error.response.data : error.message);
    }
  };

  const handleResponse = (result) => {
    const message = result.queryResult.fulfillmentMessages[0];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, {
        _id: Math.random().toString(),
        text: message.text.text[0],
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
        },
      })
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default ChatComponent;