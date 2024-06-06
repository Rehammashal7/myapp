// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat';
// import Dialogflow from 'react-native-dialogflow';
// import Voice from 'react-native-voice';
// //import { dialogflowConfig } from './env'; 
// import { dialogflowConfig } from '../env';



// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [isListening, setIsListening] = useState(false);
// const botAvatar=require('../assets/Avatar.PNG')
// const BOT ={
//     _id:2,
//     name:'Mr.Bot',
//     avatar:botAvatar,
// };
//   useEffect(() => {
//     Dialogflow.setConfiguration(
//       dialogflowConfig.client_email,
//       dialogflowConfig.private_key,
//       Dialogflow.LANG_ENGLISH_US,
//       dialogflowConfig.project_id
//     );

//     setMessages([
//       {
//         _id: 2,
//         text: 'Hi! How can I help you today?',
//         createdAt: new Date(),
//         user: BOT,
//       },
//       {
//         _id: 1,
//         text: 'Hi',
//         createdAt: new Date(),
//         user:BOT,
//       },
//     ]);

// //     Voice.onSpeechResults = (event) => {
// //       handleSend([{ text: event.value[0] }]);
// //     };

// //     return () => {
// //       Voice.destroy().then(Voice.removeAllListeners);
// //     };
//    }, []);

// //   const handleSend = (newMessage = []) => {
// //     setMessages((previousMessages) =>
// //       GiftedChat.append(previousMessages, newMessage)
// //     );
// //     const text = newMessage[0].text;
// //     Dialogflow.requestQuery(
// //       text,
// //       (result) => handleResponse(result),
// //       (error) => console.log(error)
// //     );
// //   };

// //   const handleVoiceStart = async () => {
// //     setIsListening(true);
// //     try {
// //       await Voice.start('en-US');
// //     } catch (e) {
// //       console.error(e);
// //     }
// //   };

// //   const handleVoiceStop = async () => {
// //     setIsListening(false);
// //     try {
// //       await Voice.stop();
// //     } catch (e) {
// //       console.error(e);
// //     }
// //   };

//   const handleResponse = (result) => {
//     let text = result.queryResult.fulfillmentMessages[0].text.text[0];
//     // const message = {
//     //   _id: messages.length + 1,
//     //   text: text,
//     //   createdAt: new Date(),
//     //   user: BOT,
//     // };
//     // setMessages((previousMessages) =>
//     //   GiftedChat.append(previousMessages, [message])
//     // );
//     sendBotresponse(text);
//   };

//   const sendBotresponse=(text)=>{
//     let message = {
//         _id: messages.length + 1,
//         text: text,
//         createdAt: new Date(),
//         user: BOT,
//       };
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, [message])
//       );
//   }

//    const handleSend = (newMessage = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, newMessage)
//     );
//     let massage = newMessage[0].text;
//     Dialogflow.requestQuery(
//         massage,
//       (result) => handleResponse(result),
//       (error) => console.log(error)
//     );
//   }; 
//   const handleonQuickReply=(quickReply)=>{
//     setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, quickReply)
//       );
//       let massage = quickReply[0].value;
//       Dialogflow.requestQuery(
//           massage,
//         (result) => handleResponse(result),
//         (error) => console.log(error)
//       );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <GiftedChat
//         messages={messages}
//         onSend={(newMessage) => handleSend(newMessage)}
//         onQuickReply={(quickReply)=> handleonQuickReply(quickReply)}
//         user={{
//           _id: 1,
//         }}
//         placeholder="Type your message here..."
//         renderUsernameOnMessage
//         scrollToBottom
//       />
//       <View style={styles.footer}>
//         {/* <Button
//           title={isListening ? 'Listening...' : 'Start Voice'}
//           onPress={isListening ? handleVoiceStop : handleVoiceStart}
//         /> */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 20,
//     paddingHorizontal: 10,
//   },
// });

// export default Chatbot;
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Dialogflow from 'react-native-dialogflow';
import Voice from 'react-native-voice';
import { dialogflowConfig } from '../env';
import axios from 'axios';


const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const botAvatar = require('../assets/Avatar.PNG');
  const BOT = {
    _id: 2,
    name: 'Mr.Bot',
    avatar: botAvatar,
  };

  useEffect(() => {
    Dialogflow.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );

    setMessages([
      {
        _id: 2,
        text: 'Hi! How can I help you today?',
        createdAt: new Date(),
        user: BOT,
      },
      {
        _id: 1,
        text: 'Hi',
        createdAt: new Date(),
        user: BOT,
      },
    ]);

    Voice.onSpeechResults = (event) => {
      handleSend([{ text: event.value[0] }]);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  // const handleSend = (newMessage = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, newMessage)
  //   );
  //   const text = newMessage[0].text;
  
  //   // إعداد بيانات الطلب لـ Dialogflow
  //   const requestData = {
  //     query: text,
  //     lang: 'en', // لغة الطلب
  //     sessionId: '12345' // يمكنك استخدام معرّف الجلسة الخاص بك
  //   };
  
  //   axios.post('https://api.api.ai/v1/query?v=20150910', requestData, {
  //     headers: {
  //       'Authorization': `Bearer ${dialogflowConfig.accessToken}`, 
  //       'Content-Type': 'application/json',
  //       'origin': 'http://localhost:8080', 
  //       'x-requested-with': 'XMLHttpRequest' 
  //     }
  //   })
  //   .then(response => {
  //     handleResponse(response.data);
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
  // };
  // const handleSend = (newMessage = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, newMessage)
  //   );
  //   const text = newMessage[0].text;
  //   Dialogflow.requestQuery(
  //     text,
  //     result => handleResponse(result),
  //     error => console.log(error),
  //     {
  //       origin: 'http://localhost:8080', // تحديد رأس origin
  //       'x-requested-with': 'XMLHttpRequest' // تحديد رأس x-requested-with
  //     }
  //   );
  // };
 
  const handleSend = (newMessage = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    );
    const text = newMessage[0].text;
    fetch('https://api.api.ai/v1/query?v=20150910', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:19006',
        'X-Requested-With': 'XMLHttpRequest',
        'charset': 'utf-8'
      },
      body: JSON.stringify({
        query: text,
        lang: 'en',
        sessionId: 'somerandomsessionid'
      })
    })
    .then(response => response.json())
    .then(result => handleResponse(result))
    .catch(error => console.log(error));
  };
  

//   const handleSend = (newMessage = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, newMessage)
//     );
//     const text = newMessage[0].text;
// //     fetch('https://your-firebase-project-id.cloudfunctions.net/dialogflowProxy', {
// //   method: "POST",
// //   headers: {
// //     "Content-Type": "application/json"
// //   },
// //   body: JSON.stringify({
// //     query: text,
// //     lang: "en",
// //     sessionId: dialogflowConfig.project_id
// //   })
// // })
// // .then(response => response.json())
// // .then(result => handleResponse(result))
// // .catch(error => console.log(error));
// Dialogflow.requestQuery(
//     text,
//     result => handleResponse(result),
//     error => console.log(error),
//     {
//       origin: 'http://localhost:8080', // تحديد رأس origin
//       'x-requested-with': 'XMLHttpRequest' // تحديد رأس x-requested-with
//     }
//   );
  
// // Dialogflow.requestQuery(
// //     `http://localhost:8080/https://api.api.ai/v1/query?v=20150910&query=${encodeURIComponent(text)}`,
// //     result => handleResponse(result),
// //     error => console.log(error)
// //   );
  
//     // Dialogflow.requestQuery(
//     //   text,
//     //   result => handleResponse(result),
//     //   error => console.log(error)
//     // );
//   };

// const handleSend = async (newMessage = []) => {
//     try {
//       const apiUrl = 'https://api.dialogflow.com/v1/query';
      
//       // استخدم Axios لإرسال الطلب POST إلى API
//       const response = await axios.post(apiUrl, {
//         query: newMessage[0].text,
//         lang: 'en',
//         sessionId: dialogflowConfig.project_id
//       }, {
//         headers: {
//           Authorization: `Bearer ${dialogflowConfig.client_email}`,
//           'Content-Type': 'application/json; charset=utf-8'
//         }
//       });
  
//       // استخدم الدالة handleResponse لمعالجة الرد
//       handleResponse(response.data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };


// const handleSend = async (newMessage = []) => {
//     try {
//      // const apiUrl = 'https://dialogflow.googleapis.com/v2/projects/' + dialogflowConfig.project_id + '/agent/sessions/123456789:detectIntent';
//       const apiUrl = 'https://api.api.ai/v1/query?v=20150910';

      
//           const response = await axios.post(apiUrl, {
//         query: newMessage[0].text,
//         lang: dialogflowConfig.private_key,
//         sessionId: "9a8c1699-746e-2173-4973-4a3807034b1c"
//       }, {
//         headers: {
//           Authorization: `Bearer ${dialogflowConfig.client_email}`,
//           'Content-Type': 'application/json; charset=utf-8'
//         }
//       }
    
//     );

//       handleResponse(response.data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };


  const handleResponse = (result) => {
    if (result.queryResult && result.queryResult.fulfillmentMessages) {
      const text = result.queryResult.fulfillmentMessages[0].text.text[0];
      sendBotResponse(text);
    } else {
      console.error('Invalid response format', result);
    }
  };

  const sendBotResponse = (text) => {
    const message = {
      _id: messages.length + 1,
      text: text,
      createdAt: new Date(),
      user: BOT,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );
  };

  const handleVoiceStart = async () => {
    setIsListening(true);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const handleVoiceStop = async () => {
    setIsListening(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnQuickReply = (quickReply) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, quickReply)
    );
    const text = quickReply[0].value;
    Dialogflow.requestQuery(
      text,
      result => handleResponse(result),
      error => console.log(error)
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        onQuickReply={(quickReply) => handleOnQuickReply(quickReply)}
        user={{
          _id: 1,
        }}
        placeholder="Type your message here..."
        renderUsernameOnMessage
        scrollToBottom
      />
      {/* <View style={styles.footer}>
        <Button
          title={isListening ? 'Listening...' : 'Start Voice'}
          onPress={isListening ? handleVoiceStop : handleVoiceStart}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
});

export default Chatbot;

