import React, { useEffect, useState } from 'react'
import { View, Text, BackHandler, Alert, StyleSheet } from 'react-native'
import MapboxNavigation from '@homee/react-native-mapbox-navigation';

const RouteDirectionScreen = (props) => {
    const [isShow, setIsShow] = useState(true)
    useEffect(() => {
        const unsubscribe = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }

    }, []);

    const handleBackButton = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?',
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => { BackHandler.exitApp() } }
            ])
        return true;
    }

    const handleQuitNavigation = () => {
      
        Alert.alert('Stop Navigation', 'Are you sure you want to stop?',
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                { text: "OK", onPress: () => setIsShow(false) }
            ])
            
            setTimeout(() => {props.navigation.goBack();}, 5000)
      };

    const { driver_position, delivery_postiton } = props.route.params
    return (
        <View style={styles.container}>
            {
                (isShow) ?
                    <MapboxNavigation
                        origin={driver_position}
                        destination={delivery_postiton}
                        shouldSimulateRoute
                        //showsEndOfRouteFeedback
                        onLocationChange={(event) => {
                            const { latitude, longitude } = event.nativeEvent;
                        }}

                        onRouteProgressChange={(event) => {
                            const {
                                distanceTraveled,
                                durationRemaining,
                                fractionTraveled,
                                distanceRemaining,
                            } = event.nativeEvent;
                        }}
                        onError={(event) => {
                            const { message } = event.nativeEvent;
                            console.log('err msg ', message);
                        }}
                        onDestroy={() => {

                        }}
                        onCancelNavigation={() => {
                            
                            console.log('onCancelNavigation');
                            handleQuitNavigation();
                        }}
                        onArrive={() => {
                            // Called when you arrive at the destination.
                            console.log('arrived...');
                        }}

                        onClick={() => console.log('click')}
                    />
                    : 
                    <View style={styles.container}>
                        <Text style={{ marginTop: 50, textAlign: 'center', fontSize: 20 }}>Stopping Navigation.....</Text>
                    </View>
            }
            <Text></Text>
        </View>
    )
}

export default RouteDirectionScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});