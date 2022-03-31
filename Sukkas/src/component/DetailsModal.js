import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import { actuatedNormalize } from '../services/actuatedNormalizeFont';

const close = require('../images/ic_pop-up_close.png')

export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { closeDetailsModal, isVisible, detailsModalItem } = this.props
        if (detailsModalItem == null) {
            return (
                <View></View>
            )
        }
        return (
            <View>
                <Modal
                    coverScreen={true}
                    isVisible={isVisible}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.closeBtnContainer}>
                            <TouchableOpacity onPress={closeDetailsModal} style={{ padding: 8 }}>
                                <Image source={close} style={styles.closeImg} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content}>
                            <ScrollView>
                              
                                <View style={styles.topGap}>
                                    <Text style={styles.title}>Address:</Text>
                                    <Text style={styles.value} >{detailsModalItem.address}</Text>
                                </View>
                             
                                <View style={styles.topGap}>
                                    <Text style={styles.title}>Phone Number:</Text>
                                    <Text style={styles.value}>{detailsModalItem.phone}</Text>
                                </View>

                                <View style={styles.topGap}>
                                    <Text style={styles.title}>Cell Number:</Text>
                                    <Text style={styles.value}>{detailsModalItem.mobile}</Text>
                                </View>
                             
                                <View style={styles.topGap}>
                                    <Text style={styles.title}>Items:</Text>
                                    <View>
                                        {
                                            detailsModalItem.product_details.map(( v, i ) => {
                                                return(
                                                    <Text style={styles.value} key={i}>{v.trim()} </Text>
                                                )
                                            })
                                        }
                                    </View>
                                </View>

                                <View style={styles.topGap}>
                                    <Text style={styles.title}>Total charges:</Text>
                                    <Text style={styles.value}>$ {detailsModalItem.order_total}</Text>
                                </View>


                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 6
    },
    closeBtnContainer: {
        padding: 5,
        alignItems: 'flex-end'
    },
    closeImg: {
        width: actuatedNormalize(15),
        height: actuatedNormalize(15)
    },
    content: {
        flex: 1,
        marginHorizontal: wp('10%'),
        paddingBottom: 30
        // backgroundColor: 'pink'
    },
    title: {
        fontSize: wp('3.7%'),
        color: '#A3A6B2',
        fontWeight: 'bold',
    },
    value: {
        fontSize: wp('4.5%'),
        color: '#15224F',
        fontWeight: 'bold',
        marginTop: 5
    },
    topGap: {
        marginTop: 20
    },
})