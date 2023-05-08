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
