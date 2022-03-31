import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps'
import { actuatedNormalize } from '../services/actuatedNormalizeFont';

let marker = {
    iconImage: require('../images/ic_trip_on_map.png'),
    iconAllowOverlap: true,
    iconSize: 0.59,
    iconOffset: [0, -50],
    iconOptional: true,
    textIgnorePlacement: true,
    textField: '{addressName}',
    textSize: 15,
    textMaxWidth: 50,
    textColor: '#fff',
    textAnchor: 'center',
    textTranslate: [0, -10],
    textAllowOverlap: true,
    textHaloColor: '#000',
    textHaloWidth: 2,
    textHaloBlur: 0.5
}

export default class ShapeSource extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { shapeSourceArray, setSingleTripDirectionRoute } = this.props
        return shapeSourceArray ?
            <MapboxGL.ShapeSource
                id="shapesourcebox"
                hitbox={{ width: 20, height: 20 }}
                shape={shapeSourceArray}
                onPress={(e) => {

                    let delivery_latitude = e.features[0].properties.coordinates[1]
                    let delivery_longitude = e.features[0].properties.coordinates[0]

                    setSingleTripDirectionRoute(delivery_latitude, delivery_longitude)

                }}
            >
                <MapboxGL.CircleLayer
                    id="pointCircles"
                    style={{ circleStrokeColor: '#fff', circleStrokeWidth: actuatedNormalize(4), circleRadius: actuatedNormalize(8), circleColor: '#584933' }}
                />
                <MapboxGL.SymbolLayer
                    id="shapesourcesymbol"
                //style={marker}
                />
            </MapboxGL.ShapeSource>
            : null
    }
}
