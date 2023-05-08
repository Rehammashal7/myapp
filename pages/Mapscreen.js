// import React, { useState } from 'react';
// import {View , Text , StyleSheet} from 'react-native';

// // import MapView from 'react-native-web-maps';
// // import Marker  from 'react-native-web-maps';
// // import { WebView } from 'react-native-webview';

// // const API_KEY = 'AIzaSyCtGDSb9fhScS4MYwoX6mY-9iDjWBWF7h4';

// // //import 'react-native-maps/lib/MapView';
// // //import 'react-native-maps/lib/MapView.web';
// // //import 'react-native-web-maps/lib/stylesheet/mapView.css';




// const Mapscreen =()=>{
// //     const [location, setLocation] = useState({
// //         latitude: 30.0444,
// //         longitude: 31.2357,
// //         latitudeDelta: 0.0922,
// //         longitudeDelta: 0.0421,
// //       });

// //       const markerLocation = {
// //         latitude: 30.0444,
// //         longitude: 31.2357,
      
// //       };

// //       const [error, setError] = useState(null);

// //   const handleMapError = () => {
// //     setError('Error loading map');
// //   };

// //   const handleMarkerError = () => {
// //     setError('Error loading marker');
// //   };


//     return(
//         <View style = {{flex:1 , alignItems:'center' , justifyContent:'center'}}>
//           <Text>Map Screenn</Text>
//           {/* <MapView
//           style={styles.map}
//           region={{
//            latitude: 30.0444,
//         longitude: 31.2357,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//           }}
//       googleMapsApiKey={ 'AIzaSyCtGDSb9fhScS4MYwoX6mY-9iDjWBWF7h4'}
//       onError={handleMapError}
//       >
//       <Marker 
//       coordinate={markerLocation}
//       onError={handleMarkerError} />

//       </MapView> */}
//       {/* <WebView
//       source={{ uri: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCtGDSb9fhScS4MYwoX6mY-9iDjWBWF7h4' }}
//       onError={(error) => setError('Error loading web view')}
//     /> */}
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     map: {
//       flex: 1,
//       width: '100%',
//       height: '100%',
//     },
//   });
// export default Mapscreen;



///////////////////////////////////////////////////////////

import React from 'react';
import GoogleMapReact from 'google-map-react';
//import Marker  from 'google-map-react';

const Mapscreen = () => {
  const defaultProps = {
    center: {
      lat: 30.0444,
    lng: 31.2357,
    },
    zoom: 10,
  };

  const Marker = ({ text }) => <div>{text}</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAg_OCpvTnPsWbcdiiNJUcGVmmRoFrrCT8' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker
         lat={30.0444}
         lng={31.2357}
         text="Cairo"
        />
      </GoogleMapReact>
    </div>
  );
};

export default Mapscreen;
