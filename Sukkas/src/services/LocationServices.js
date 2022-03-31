import React from "react";
import { PermissionsAndroid } from "react-native"

class LocationServices {
    static async CheckLocationPermission() {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if (granted) {
                //console.log("You can use the ACCESS_FINE_LOCATION")
                return true
            }
            else {
                console.log("ACCESS_FINE_LOCATION permission denied")
                await LocationServices.requestLocationPermission()
                return true
            }

        } catch (err) {
            return false
        }
    }

    static async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This App needs access to your location ' +
                        'so we can know where you are.',
                    buttonPositive: "OK"
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use locations ")
            } else {
                console.log("Location permission denied")
                await LocationServices.requestLocationPermission()
            }
        } catch (err) {
            console.warn(err)
        }
    }


}


export default LocationServices