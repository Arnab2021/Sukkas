import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, BackHandler, Alert } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CommonActions, StackActions } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps'
import Geolocation from 'react-native-geolocation-service';
import { AllTripDirectionRoute, SingleTripDirectionRoute, ShapeSource } from '../../../component'
import LocationServices from '../../../services/LocationServices';
import { showErrorAlertMessage } from '../../../services/ShowAlertMessages'
import axios from 'axios'

Logger.setLogCallback(log => {

    if (log.level == "warning") {
        return true
    }
    return false
});

const accessToken = "pk.eyJ1IjoiYXJuYWIyMDIxIiwiYSI6ImNrb3o1NjFjdTB3bjgydm1wb3BkOWwxNHQifQ.ErbCAht7iOq6xkrA0q0M0Q"
const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 1 //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const zoom = Math.round(Math.log(360 / LONGITUDE_DELTA) / Math.LN2)
console.log('LONGITUDE_DELTA', LONGITUDE_DELTA);
console.log('zoom', zoom);

const btn_start_direction = require('../../../images/btn_start_direction.png')


export default class MapScreen extends Component {
    constructor(props) {

        super(props);
        this.state = {
            routeLoader: true,
            driver_longitude: 0,
            driver_latitude: 0,
            delivery_longitude: 0,
            delivery_latitude: 0,
            route: null,
            singleTripRoute: null,
            shapeSourceArray: null,
            longestTripCoords: [],
        };
    }

    setSingleTripDirectionRoute = async (delivery_latitude, delivery_longitude) => {

        const { driver_latitude, driver_longitude } = this.state
        let coordinateString = driver_longitude + ',' + driver_latitude + ';' + delivery_longitude + ',' + delivery_latitude;

        this.setState({
            delivery_latitude: parseFloat(delivery_latitude),
            delivery_longitude: parseFloat(delivery_longitude)
        }, () => this.fitCamera())

        let url = 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + coordinateString + '?geometries=geojson&roundtrip=true&access_token=pk.eyJ1IjoiYXJuYWIyMDIxIiwiYSI6ImNrb3o1NjFjdTB3bjgydm1wb3BkOWwxNHQifQ.ErbCAht7iOq6xkrA0q0M0Q'
        axios
            .request({
                method: 'get',
                url: url,
            })
            .then((response) => {
                if (response.data.code == 'NoRoute') {
                    showErrorAlertMessage('No Route', "Sorry! There is no route found for some trips.")
                    return
                }
                this.setState({
                    singleTripRoute: response.data.trips[0],
                })
            })
            .catch((e) => {
                console.log(e);
            });
    }

    getAllTripDirectionsRoute = async () => {

        const { driver_latitude, driver_longitude } = this.state
        let distanceArray = []
        const { tripCoordinateList } = this.props.route.params

        let coordinateString = driver_longitude + ',' + driver_latitude + ';';
        let shapeSourceList = {
            type: 'FeatureCollection',
            features: []
        }
        let featuresList = []

        tripCoordinateList.map((item, index) => {

            coordinateString = coordinateString + item.lng + ',' + item.lat + ';'

            const distance = this.getDistanceFromLatLonInKm(driver_latitude, driver_longitude, item.lat, item.lng)
            distanceArray.push({ coords: [parseFloat(item.lng), parseFloat(item.lat)], distance: distance })

            featuresList.push({
                type: 'Feature',
                properties: {
                    addressName: item.address,
                    coordinates: [parseFloat(item.lng), parseFloat(item.lat)],
                },
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(item.lng), parseFloat(item.lat)],
                },
            })
        })

        coordinateString = coordinateString.substr(0, coordinateString.length - 1)
        shapeSourceList.features = featuresList
        const largeDistance = this.getLargestDistance(distanceArray)

        this.setState({
            shapeSourceArray: shapeSourceList,
            longestTripCoords: largeDistance.coords
        })

        let url = 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + coordinateString + '?geometries=geojson&roundtrip=true&access_token=pk.eyJ1IjoiYXJuYWIyMDIxIiwiYSI6ImNrb3o1NjFjdTB3bjgydm1wb3BkOWwxNHQifQ.ErbCAht7iOq6xkrA0q0M0Q'

        axios
            .request({
                method: 'get',
                url: url,
            })
            .then((response) => {
                //  console.log(response.data.waypoints);
                if (response.data.code == 'NoRoute') {
                    this.setState({ routeLoader: false })
                    Alert.alert(
                        'No Route',
                        "Sorry! There is no route found for some trips.",
                        [
                            { text: "OK", onPress: () => { this.showtripCoordsOverview() } }
                        ]
                    )
                    // showErrorAlertMessage('No Route', "Sorry! There is no route found for some trips.")
                    return
                }
                this.setState({
                    route: response.data.trips[0],
                    routeLoader: false
                })
            })
            .catch((e) => {
                console.log(e);
            });
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    getLargestDistance(arr) {
        let i;

        let max = arr[0].distance;
        let pocket = 0

        for (i = 1; i < arr.length; i++) {
            if (arr[i].distance > max) {
                max = arr[i].distance;
                pocket = i
            }
        }

        return arr[pocket]
    }

    async componentDidMount() {
        MapboxGL.setAccessToken(accessToken)
        MapboxGL.setConnected(true);
        MapboxGL.setTelemetryEnabled(true);
        const permission = await MapboxGL.requestAndroidLocationPermissions();

        const LocPermission = await LocationServices.CheckLocationPermission()
        if (LocPermission == true) {
            await this.getLocation()
        }
    }



    async getLocation() {
        Geolocation.getCurrentPosition(
            async (position) => {
                //console.log(position);
                const driver_position = position
                //22.680289, 88.272803
                /*this.setState({
                    driver_latitude: driver_position.coords.latitude,
                    driver_longitude: driver_position.coords.longitude
                }, async () => {
                    await this.getAllTripDirectionsRoute()
                })*/
                this.setState({
                    driver_latitude: 37.773972,
                    driver_longitude: -122.431297
                }, async () => {
                    await this.getAllTripDirectionsRoute()
                })
            },
            async (error) => {
                console.log(error);
                if (error.message == 'No location provider available.') {
                    await this.getLocation()
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true, forceRequestLocation: true }
        );
    }


    fitToScreen = async () => {
       
        const { driver_latitude, driver_longitude, longestTripCoords } = this.state

        const neBound = longestTripCoords
        const swBound = [parseFloat(driver_longitude), parseFloat(driver_latitude)]

        this._mapCamera.fitBounds(neBound, swBound, [50, 50, 150, 50], 3000)  //top, right, bottom, left
    }

    fitCamera() {
        const { driver_latitude, driver_longitude, delivery_latitude, delivery_longitude } = this.state

        const neBound = [parseFloat(delivery_longitude), parseFloat(delivery_latitude)]
        const swBound = [parseFloat(driver_longitude), parseFloat(driver_latitude)]

        this._mapCamera.fitBounds(neBound, swBound, [50, 80, 150, 80], 3000) //top, right, bottom, left
    }

    showtripCoordsOverview() {
        const { longestTripCoords } = this.state

        const CameraSettings = {
            centerCoordinate: longestTripCoords,
            zoomLevel: zoom / 5,
            animationDuration: 3000,
            animationMode: 'flyTo'
        }
        this._mapCamera.setCamera(CameraSettings)
    }



    startDirection = () => {
        const { driver_latitude, driver_longitude, delivery_longitude, delivery_latitude } = this.state

        if (delivery_longitude == 0 && delivery_latitude == 0) {
            showErrorAlertMessage('Location Error', 'Please select a trip destination.\nSo that we can direct you the route.')
            return
        }

        const param = {
            driver_position: [parseFloat(driver_longitude), parseFloat(driver_latitude)],
            delivery_postiton: [parseFloat(delivery_longitude), parseFloat(delivery_latitude)]
        }
        this.props.navigation.navigate('RouteDirection', param)
    }

    render() {

        return (
            <View style={styles.container}>

                {
                    (this.state.routeLoader) ?
                        <ActivityIndicator
                            size="small"
                            color="#15224F"
                        />
                        :

                        <MapboxGL.MapView
                            ref={(c) => this._map = c}
                            style={{ flex: 1, zIndex: -10 }}
                            styleURL={MapboxGL.StyleURL.Street}
                            showUserLocation={true}
                            centerCoordinate={[this.state.driver_longitude, this.state.driver_latitude]}
                            logoEnabled={true}
                            zoomEnabled={true}
                            localizeLabels={true}
                            surfaceView={true}
                            onDidFinishRenderingMapFully={() => {
                                this.fitToScreen()
                            }}
                        >
                            <MapboxGL.UserLocation></MapboxGL.UserLocation>
                            <MapboxGL.Camera
                                ref={(c) => this._mapCamera = c}
                            />

                            <SingleTripDirectionRoute singleTripRoute={this.state.singleTripRoute} />
                            <AllTripDirectionRoute route={this.state.route} />

                            <ShapeSource shapeSourceArray={this.state.shapeSourceArray} setSingleTripDirectionRoute={(delivery_latitude, delivery_longitude) => this.setSingleTripDirectionRoute(delivery_latitude, delivery_longitude)} />


                        </MapboxGL.MapView>

                }

                <View style={styles.myLocationBtnContainer}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            routeLoader: true,
                            driver_longitude: 0,
                            driver_latitude: 0,
                            delivery_longitude: 0,
                            delivery_latitude: 0,
                            route: null,
                            singleTripRoute: null
                        }, async () => await this.getLocation())
                    }}>
                        <MaterialIcons
                            name="my-location"
                            style={{
                                color: '#fff',
                                fontSize: wp('5.5%')
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.footerBtnContainer}>
                    <TouchableOpacity onPress={() => this.startDirection()}>
                        <Image source={btn_start_direction} style={styles.directionImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>


            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    footerBtnContainer: {
        padding: 10,
        width: wp('100%'),
        backgroundColor: '#DDDDDD',
        position: 'absolute',
        bottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    directionImg: {
        width: wp('50%'),
        height: 50
    },
    myLocationBtnContainer: {
        position: 'absolute',
        right: 10,
        bottom: 150,
        padding: 10,
        backgroundColor: '#584933',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff'
    }
})