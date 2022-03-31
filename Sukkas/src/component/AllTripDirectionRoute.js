import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps'

export default class AllTripDirectionRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {route} = this.props
        return route ? (
            <MapboxGL.ShapeSource id="routeSource" shape={route.geometry} >
                <MapboxGL.LineLayer id="routeLineLayer" style={{ lineColor: "#3887BE", lineWidth: 5, lineCap: MapboxGL.LineJoin.Round, lineOpacity: 1 }} />
            </MapboxGL.ShapeSource>
        ) : null;
    }
}
