// npm i geolib

import { Dimensions, PermissionsAndroid, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import MapView from "../Hooks/ClusteredMapView";
import datas from './task.json';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
// import { LocationGeofencingEventType } from 'expo-location';
import { Searchbar } from "react-native-paper";
import * as TaskManager from 'expo-task-manager';
import BottomSheet from "react-native-bottomsheet-reanimated";
interface Props {
  navigation?: any;
}

export default function Map({ navigation }: Props): ReactElement {
  const [searchItem, setsearchItem] = useState({
    "item": ``
  });
  const [state, setstate] = useState({
    "latitude": 60.1098678,
    "longitude": 24.7385084,
    "latitudeDelta": 8.5,
    "longitudeDelta": 8.5

  });

  useEffect(() => {
    _onMapReady();
  }, [_onMapReady]);

  const _onMapReady = useCallback(async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    // console.log(status);
    if (status !== `granted`) {
      console.log(`Permisson Denied`);
    }

    const location = await Location.getCurrentPositionAsync({ "accuracy": Location.Accuracy.High });
    setstate({
      ...state,
      "latitude": location.coords.latitude,
      "longitude": location.coords.longitude
    });

    // const properties = useSelector(state => state.properties)

    // const regions = properties.map((i) => ({
    //   "identifier": i.uuid,
    //   "latitude": i.coordinates.latitude,
    //   "longitude": i.coordinates.longitude,
    //   "radius": 2000,
    //   "notifyOnEnter": true,
    //   "notifyOnExit": true,
    // }))

    console.log(`CurrentLocation`, location);
    // Location.startGeofencingAsync(`LOCATION_GEOFENCE`, [
    //   {
    //     "identifier": `estates logs properties`,
    //     "latitude": state.latitude,
    //     "longitude": state.longitude,
    //     "radius": 2000,
    //     "notifyOnEnter": true,
    //     "notifyOnExit": true
    //   }
    // ]);
  }, [state]);
  console.log(`Updated lat`, state?.latitude, `update long`, state?.longitude);
  const nameFilter = datas?.data.filter((list) => {
    return list?.Property?.toLowerCase().includes(searchItem?.item?.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={state}
        showsIndoors={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
        zoomTapEnabled={true}
        showsScale={true}
        // showsTraffic={true}
        // onRegionChangeComplete={state, { "isGesture": true }}
        showsBuildings={true}
        showsUserLocation={true}
        showsCompass={true}
        onMapReady={_onMapReady}
        style={styles.mapStyle} >
        {
          nameFilter?.map((i, index) => {
            return (
              <Marker
                key={index}
                coordinate={{ "latitude": i.location.lat, "longitude": i.location.lng }}
                animation={true}
              >
                <Callout
                  style={{ "width": 100, "height": 50 }}>
                  <View>
                    <Text>{i.Property}</Text>
                  </View>
                </Callout>
              </Marker>);
          })
        }
      </MapView>
      <Searchbar
        value={searchItem?.item}
        onChangeText={(item) => setsearchItem({ ...searchItem, item })}
        placeholder="Search"
        style={{
          "position": `absolute`,
          "top": 20,
          "margin": 10
        }}
        icon="menu"
        onIconPress={() => { }}
      />
      <BottomSheet
        bottomSheerColor="#FFFFFF"
        initialPosition={`30%`}  // 200, 300
        snapPoints={[`30%`, `80%`]}
        isBackDropDismisByPress={true}
        isRoundBorderWithTipHeader={true}
        containerStyle={{ "backgroundColor": `#0af` }}
        header={
          <View>
            <Text style={styles.text}>Places Near you</Text>
          </View>
        }
        body={
          <View style={styles.body}>
            {datas?.data.map((i, index) => <View key={index} >
              <Text style={{ "fontSize": 20, "marginBottom": 5, "color": `white` }}>{i.Property}</Text>
              <Text style={{ "fontSize": 20, "marginBottom": 5 }}>{i.task}</Text>
            </View>)}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  "container": {
    "flex": 1,
    "backgroundColor": `#fff`,
    "alignItems": `center`,
    "justifyContent": `center`
    // position: 'absolute',
    // height: Dimensions.get("window").height,
    // width: Dimensions.get("window").width
  },
  "mapStyle": {
    // "width": 390,
    // "height": 390
    "height": Dimensions.get(`window`).height,
    "width": Dimensions.get(`window`).width
  },
  "body": {
    "justifyContent": `center`,
    "alignItems": `center`
  },
  "text": {
    "fontSize": 20,
    "fontWeight": `bold`
  }
});

TaskManager.defineTask(`LOCATION_GEOFENCE`, ({ "data": { eventType, region }, error }) => {
  if (error) {
    console.log(`ERROR: ` + error);
    return;
  }
  if (eventType === Location.GeofencingEventType.Enter) {
    // add property to an array of properties within range
    alert(`enter in region!`);
    console.log(`You've entered region:`, region);
  } else if (eventType === Location.GeofencingEventType.Exit) {
    // remove property from array
    console.log(`You've left region:`, region);
  }
});
