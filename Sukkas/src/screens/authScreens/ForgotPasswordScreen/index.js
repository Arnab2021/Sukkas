import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  StyledTextInput,
  Button
} from '../../../component'
import { callApi } from '../../../services/apiServices'
import { showErrorAlertMessage } from '../../../services/ShowAlertMessages'
import { actuatedNormalize } from '../../../services/actuatedNormalizeFont';

const logo = require('../../../images/logo.png')

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loader: false
    };
  }

  async _forgotPassword() {
    const { email } = this.state
    const param = {
      email: email
    }

    this.setState({ loader: true })
    const response = await callApi('forgot_password/', param)
    this.setState({ loader: false })

    if (response.status == 'Success') {
      showErrorAlertMessage('Success', response.status_message)
    } else if (response.status == 'Failure') {
      showErrorAlertMessage('Error', response.status_message)
    }
  }

  render() {

    return (
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}>

        <View style={[styles.imageContainer]}>
          <Image source={logo} style={[styles.image]} resizeMode="contain" />
        </View>

        <View style={[styles.body]}>
          <Text style={[styles.headerText]}>Forgot password</Text>
          <View style={[styles.inputsContainer]}>
            <StyledTextInput
              placeholder="Example@mail.com"
              label="Email/User name"
              keyboardType="email-address"
              labelStyle={[styles.labelStyle]}
              inputStyle={[styles.inputStyle]}
              inputContainerStyle={styles.inputContainerStyle}
              placeholderTextColor="#BCBCBC"
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email}
            />
          </View>

          <Button
            buttonStyle={styles.btnPassword}
            labelStyle={styles.btnText}
            label="Send Password"
            loader={this.state.loader}
            onPress={() => this._forgotPassword()}
          />

        </View>

      </KeyboardAwareScrollView>
    );
  }
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
 
  imageContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 0.75,
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
  labelStyle: {
    fontSize: wp('3.5%')
  },
  inputStyle: {
    height: 35,
    minHeight: 35,
    fontSize: wp('5%'),
    padding: 0,
    color: '#15224F',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  inputContainerStyle: {
    margin: 0,
    padding: 0,
  },
  btnPassword: {
    height: actuatedNormalize(50),
    marginHorizontal: 20,
    backgroundColor: '#584933',
    borderRadius: 100,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  },
  btnText: {
    fontSize: actuatedNormalize(17),
    color: '#fff',
    fontWeight: 'bold'
  },
})