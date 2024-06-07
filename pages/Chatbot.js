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
import {Dialogflow_V2} from 'react-native-dialogflow';
 import Voice from 'react-native-voice';
import { dialogflowConfig } from '../env';
import axios from 'axios';


const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const botAvatar = require('../assets/Avatar.png');
  const BOT = {
    _id: 2,
    name: 'Mr.Bot',
    avatar: botAvatar,
  };

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
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


  const handleSend = (newMessage = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    );
    const text = newMessage[0].text;

  
Dialogflow_V2.requestQuery(
      text,
      result => handleResponse(result),
      error => console.log(error)
    );
  };


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

