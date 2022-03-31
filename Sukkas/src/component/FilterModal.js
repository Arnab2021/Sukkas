import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather'
import { actuatedNormalize } from '../services/actuatedNormalizeFont';
const close = require('../images/ic_pop-up_close.png')

export default class FilterModal extends Component {
    render() {
        const { isVisible, selectedFilterValue, closeFilterModal, onPressFilterOption } = this.props
        
        return (
            <View>
                <Modal
                    coverScreen={true}
                    isVisible={isVisible}
                    onBackdropPress={closeFilterModal}
                    animationOut="fadeOutDown"
                    backdropTransitionOutTiming={100}
                    useNativeDriver={false}
                    useNativeDriverForBackdrop={false}
                >
                    <View style={styles.contentContainer}>
                        {/*<View style={styles.closeBtnContainer}>
                            <TouchableOpacity onPress={closeFilterModal} style={{ padding: 8 }}>
                                <Image source={close} style={styles.closeImg} />
                            </TouchableOpacity>
                        </View>*/}
                        <View style={styles.content}>
                            <TouchableOpacity style={styles.filterOption} onPress={ () => onPressFilterOption('pending') }>
                                <Text style={styles.title}>
                                    Pending
                                </Text>
                                {
                                    (selectedFilterValue == 'pending') &&
                                    <Feather
                                        name="check-circle"
                                        size={25}
                                        style={{ color: '#15224F' }}
                                    />
                                }

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterOption} onPress={ () => onPressFilterOption('completed') }>
                                <Text style={styles.title}>
                                    Completed
                                </Text>
                                {
                                    (selectedFilterValue == 'completed') &&
                                    <Feather
                                        name="check-circle"
                                        size={actuatedNormalize(18)}
                                        style={{ color: '#15224F' }}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    contentContainer: {
        //flex: 1,
        backgroundColor: '#fff',
        borderRadius: 6,
        height: actuatedNormalize(90)
    },  
    content: {
        flex: 1,
        marginHorizontal: wp('6%'),
    },
    filterOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    title: {
        fontSize: actuatedNormalize(12),
    }
})