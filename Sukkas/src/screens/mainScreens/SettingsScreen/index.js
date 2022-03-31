import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { actuatedNormalize } from '../../../services/actuatedNormalizeFont';
import {
    StyledTextInput,
    Button
} from '../../../component'
import { callApi } from '../../../services/apiServices'
import { showToastMessage, showErrorAlertMessage } from '../../../services/ShowAlertMessages'
import { getData } from '../../../services/AsyncStorageServices';

const logo = require('../../../images/logo.png')

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            confirmPassword: '',
            rememberMe: false,
            loader: false
        };
    }

    async resetPassword() {
        const { newPassword, confirmPassword } = this.state
        const userid = await getData('userid')
        const param = {
            userid: userid,
            newpassword: newPassword
        }

        if (newPassword != confirmPassword) {
            showErrorAlertMessage('Password mismatch!', 'Password doesnot match.')
            return
        }

        this.setState({ loader: true })
        const response = await callApi('settings/', param)
        this.setState({ loader: false })

        if (response.status == 'Success') {
            showToastMessage(response.status_message, 'bottom')
        }
        else if (response.status == 'Failure') {
            showErrorAlertMessage('Error!', response.status_message)
        }
        else if (response === false) {
            showErrorAlertMessage('Internal Error!', 'Something went wrong.\nTry again later.')
        }

    }

    render() {
        const { rememberMe } = this.state
        return (
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}>

                <View style={[styles.imageContainer]}>
                    <Image source={logo} style={[styles.image]} resizeMode="contain" />
                </View>

                <View style={[styles.body]}>
                    <Text style={[styles.headerText]}>Reset password</Text>
                    <View style={[styles.inputsContainer]}>
                        <StyledTextInput
                            placeholder="********"
                            label="Password"
                            onChangeText={(text) => this.setState({ newPassword: text })}
                            secureTextEntry={true}
                            placeholderTextColor="#BCBCBC"
                            value={this.state.newPassword}
                        />

                        <StyledTextInput
                            placeholder="********"
                            label="Confirm Password"
                            textInputContainerStyles={{ marginTop: 30 }}
                            onChangeText={(text) => this.setState({ confirmPassword: text })}
                            secureTextEntry={true}
                            placeholderTextColor="#BCBCBC"
                            value={this.state.confirmPassword}
                        />
                    </View>

                    <Button
                        buttonStyle={styles.btnPassword}
                        labelStyle={styles.btnText}
                        label="Reset Password"
                        loader={this.state.loader}
                        onPress={() => this.resetPassword()}
                    />


                </View>

            </KeyboardAwareScrollView>
        );
    }
}

export default ResetPassword

const styles = StyleSheet.create({
    imageContainer: {
        flex: 0.35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 0.65,        
    },
    image: {
        height: actuatedNormalize(50),
    },
    headerText: {
        fontSize: actuatedNormalize(25),
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#15224F'
    },
    inputsContainer: {
        padding: 20,
        marginTop: 30,
    },

    btnPassword: {
        height: actuatedNormalize(50),
        marginHorizontal: 20,
        backgroundColor: '#584933',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        marginTop: 30
    },
    btnText: {
        fontSize: actuatedNormalize(14),
        color: '#fff',
        fontWeight: 'bold'
    },
})