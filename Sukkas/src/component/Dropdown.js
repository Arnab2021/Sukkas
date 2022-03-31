import React, { Component } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from "react-native-custom-dropdown";
import { actuatedNormalize } from '../services/actuatedNormalizeFont';

export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const{items,defaultValue,onChangeItem} = this.props
        return (
            <DropDownPicker
                items={items}
                defaultValue={defaultValue}
                containerStyle={{
                    height: actuatedNormalize(40),
                }}
                style={{
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                }}
                itemStyle={{
                    justifyContent: 'flex-start',
                    backgroundColor: '#fff'
                }}
                dropDownStyle={{
                    backgroundColor: '#fff',
                    elevation: 5
                }}
                labelStyle={{
                    fontSize: actuatedNormalize(13),
                    color: '#15224F',
                    fontWeight: 'bold',
                    marginVertical: 5,
                }}
                selectedLabelStyle={{
                    textAlign: 'left',
                }}
                onChangeItem={item => onChangeItem(item) }
                dropDownMaxHeight={330}
            />
        );
    }
}
