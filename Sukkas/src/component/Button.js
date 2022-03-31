import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { buttonStyle, label, labelStyle, onPress, loader } = this.props
        return (
            <TouchableOpacity style={buttonStyle} onPress={onPress} >
                {
                    (loader) ?
                        <ActivityIndicator
                            size="large"
                            color="#fff"
                        />
                        :
                        <Text style={labelStyle}>{label}</Text>
                }

            </TouchableOpacity>
        );
    }
}
