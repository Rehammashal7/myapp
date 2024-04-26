import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
 
const ChatScreen = () => {
    const config = {
        dialogflow: {
          clientEmail: "firebase-adminsdk-dihuz@software-engineering-dcd78.iam.gserviceaccount.com",
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6R3bi1BraIy0R\nM9zoO2tbWfqNeuvNYKiVjstHYV3UyV4rzqfDCtiGEWbeWwpgdXzBILjaChGCb049\nnF41ymk3TJz192pShN6r55XSC3ZIrbfAJhruttBzvA4CobbmRxDwHJ1hzje9yMYp\nIMZRRDM3pOQPVLpIhqhpE86ddW8ZFLAJfAOoGmRu/39S/TBUx7Ch/gLWGR2aBWra\nOBHrZJMgMun/o8+wTRQEJ/fbYBdsFW/VOxzzWtTw6HgrbijU1rjKz92kFwBwCPEo\nQ72waz5SC2GKkeSzETfZJGr5NQazlGwzBRo3llZN3t+P9ligtDCKUps5QiAPlR+M\nsLMeFb/LAgMBAAECggEASMxc/dB+nflZR3vJPUjbb9v+OwRq2tyHhctETiUTEnGP\nx/b/QQ4gCGUMmqFhsMi5dJBhLXT52su8+/78InF0JRRf0xBaEN20V+ItfuTT2Rtq\n0EEUDW6MkG5R211vqRbk27GTIAIDbrvkFXalimTozzo1lng6RNW7QzVmbcrTHC15\n6ztBGxZPnutB2t8byC8h9W9zPg4iEMN4yRTHrbVq36SVxvQhupysmgt09s+ZxV0H\n+pkCQTEKADWYY03a+ZGDjbcdJ3wdDqEoEBpcyMaZN4S5AShRYs+fCadbdEOQjN9v\nemhY3LPuomcpFVIBJOhAEzFxWTJX0AHeON59PcG/YQKBgQDysk3g+1VRFw/JIwoW\nTEjKQoQj43Fa8n2CET/f/+NSFuhr/UQ8hfE4hpWTgx4yBfOpQitu40aspYREcYoe\nQbZdTlrA6UYbtnazPeAZ3RrccL+omGK5Sg3QsMYgyz8hUC6LJi+E8fY404NXrHHG\n6N4YcFr8sDhyPWA66GneYc5ebQKBgQDEfXh1DYfB2XJnFUXBpEYGbqekhSxBzkwf\nMaovGKw6Y4i6leKWLTakh3JWP6nNM14iS5CcaLloc7JRyHYmaE00gxuQxPVkE+gi\nedFW8zmnL7g58l72NDAfnlQ+TxMneRFlK3Yx8rJF9KRr+h3K8TIKjahpNsJsG8Fd\ncA3WLB3UFwKBgDWMWdqWGdD2gakjbgpVcooN+xHgERa8Ai08mRdXYlSucUHCc9fW\nxc5vA3m0qGjpH0XtL6AbzXAyZOilFJBwd0hHDYca8TkUHUSXFmcefdq9lcwhM0cm\nq72sA0shDSDQjDRvjHSM3oLTSFuD1ObKYpaJ08mFKC8sk5rrxNAoTFxRAoGAT9dE\nCRw0W7qF2Ak2zRZ5Ncfk6t8KOrsfB1Xg9z4pTZiASID7D1bT60r2VMGNt8n1qC3Y\nVxXesOjCPqUcDUM4i+vyWYMOy1mja87gF1rBxIOJclJf798I5vAo/yCWgeWaAegF\nIQqjEfX0kcOSM5KKaOti0U3k9pTYn6UWmj5W6IUCgYEAjT02Mlo9w0vEKcrMBTWb\n7pQHI9jF+PVZ6u08QDdlsEl0UyrorrnfhBmWfXQZk1c10EQed+7uj99SOm36EczC\n5tg6DmT0bAACGW6KluzFh2JUQP2gDCGseqyaQ8L/qPvRryBRxTRdzqtzHdSAAsF3\nbJDlECTZz50TKiuKyLj8n9I=\n-----END PRIVATE KEY-----\n",
          projectId: "software-engineering-dcd78"
        }
      };
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'مرحبًا، كيف يمكنني مساعدتك اليوم؟',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
        },
      },
    ]);

    Dialogflow_V2.setConfiguration(
      config.dialogflow.clientEmail,
      config.dialogflow.privateKey,
      Dialogflow_V2.LANG_ENGLISH,
      config.dialogflow.projectId
    );
  }, []);
//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: 'مرحبًا، كيف يمكنني مساعدتك اليوم؟',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'ChatBot',
//         },
//       },
//     ]);
//   }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    sendToDialogflow(messages[0].text);
  }, []);

//   // إرسال الرسالة إلى Dialogflow ومعالجة الرد
//   const sendToDialogflow = (text) => {
//     Dialogflow_V2.requestQuery(
//       text,
//       result => {
//         const { queryResult } = result;
//         handleDialogflowResponse(queryResult);
//       },
//       error => {
//         console.log(error);
//       }
//     );
//   };

  const sendToDialogflow = (text) => {
    Dialogflow_V2.requestQuery(
      text,
      result => {
        const { queryResult } = result;
        handleDialogflowResponse(queryResult);
      },
      error => {
        console.error("Dialogflow request failed:", error);
      }
    );
  };
  
  const handleDialogflowResponse = (queryResult) => {
    if (queryResult && queryResult.fulfillmentText) {
      const botMessage = {
        _id: messages.length + 1,
        text: queryResult.fulfillmentText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    } else {
      console.error("Received empty response from Dialogflow");
    }
  };
  
  // التعامل مع الرد من Dialogflow
//   const handleDialogflowResponse = (queryResult) => {
//     const message = {
//       _id: messages.length + 1,
//       text: queryResult.fulfillmentText,
//       createdAt: new Date(),
//       user: {
//         _id: 2,
//         name: 'ChatBot',
//       },
//     };
//     setMessages(previousMessages => GiftedChat.append(previousMessages, [message]));
//   };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1, // تعريف المستخدم الحالي (المستخدم البشري)
      }}
    />
  );
};

export default ChatScreen;
