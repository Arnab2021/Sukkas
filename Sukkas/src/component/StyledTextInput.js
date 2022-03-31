import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { actuatedNormalize } from '../services/actuatedNormalizeFont';

export default class StyledTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { value, placeholder, keyboardType, label, onChangeText, secureTextEntry, placeholderTextColor, textInputContainerStyles } = this.props
        return (
            <View style={[styles.container,textInputContainerStyles]}>
                <Text style={styles.labelStyle}> {label} </Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    style={styles.inputStyle}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={placeholderTextColor}
                    autoCorrect={false}
                    caretHidden={false}
                    selectionColor='rgba(0, 0, 0, 0.60)'
                />               
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //padding:2,
        //backgroundColor:'pink'
    },
    labelStyle: {
        fontSize: actuatedNormalize(12),
        fontWeight: 'bold',
        color: '#969AA8',
        marginBottom: -10,
       // backgroundColor:'pink'
    },
    inputStyle: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        fontSize: actuatedNormalize(17),        
        fontWeight: 'bold',
        color: '#15224F',        
    }
})