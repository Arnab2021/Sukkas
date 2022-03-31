import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps'

export default class SingleTripDirectionRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {singleTripRoute} = this.props

        return singleTripRoute ? (
            <MapboxGL.ShapeSource id="routeSource2" shape={singleTripRoute.geometry} belowLayerID="shapesourcebox">
                <MapboxGL.LineLayer id="routeLineLayer2" belowLayerID="shapesourcesymbol" style={{ lineColor: "#060E58", lineWidth: 8, lineCap: 'round', lineOpacity: 1, lineJoin: 'round' }} />
                {/*<MapboxGL.CircleLayer
                    id="pointCircles2"
                    belowLayerID="shapesourcesymbol"
                    style={{ circleStrokeColor: '#fff', circleStrokeWidth: 2, circleRadius: 3, circleColor: '#000' }}
                />*/}
            </MapboxGL.ShapeSource>
        ) : null;
    }
}
