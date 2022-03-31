import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions } from '@react-navigation/native';
import {
  StyledTextInput,
  Button
} from '../../../component'
import { callApi } from '../../../services/apiServices'
import { showToastMessage, showErrorAlertMessage } from '../../../services/ShowAlertMessages'
import { storeData } from '../../../services/AsyncStorageServices';
import { actuatedNormalize } from '../../../services/actuatedNormalizeFont';

const logo = require('../../../images/logo.png')
const checkbox = require('../../../images/checkbox_default.png')
const checkboxSelected = require('../../../images/check_box_selected.png')

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'jhony@sukka.com',
      password: 'Abcd1234',
      //username: '',
      //password: '',
      rememberMe: false,
      loader: false
    };
  }

  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  _login = async () => {
    const { username, password } = this.state

    const param = {
      email: username,
      password: password
    }

    if (username == '' || password == "") {
      showErrorAlertMessage('Error!', "All fields are required.")
      return
    }

    this.setState({ loader: true })
    const response = await callApi('login/', param)
    this.setState({ loader: false })

    if (response.status == 'Success') {
      showToastMessage(response.status_message)
      await this._storeData(response.data.user_id)

      const action = CommonActions.reset({
        index: 0,
        routes: [{ name: 'Root' }]
      })
      this.props.navigation.dispatch(
        action
      )

    }
    else if (response.status == 'Failure') {
      showErrorAlertMessage('Error!', response.status_message)
    }
    else if (response === false) {
      showErrorAlertMessage('Internal Error!', 'Something went wrong.\nTry again later.')
    }
  }

  async _storeData(value) {
    const { rememberMe } = this.state
    await storeData('rememberme', ((rememberMe) ? 1 : 0).toString())
    await storeData('userid', value)
  }

  render() {
    const { rememberMe } = this.state
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }} >

        <View style={[styles.imageContainer]}>
          <Image source={logo} style={[styles.image]} resizeMode="contain" />
        </View>

        <View style={[styles.body]}>
          <Text style={[styles.headerText]} numberOfLines={1} adjustsFontSizeToFit>Login</Text>

          <View style={styles.inputsContainer}>
            <StyledTextInput
              placeholder="Example@gmail.com"
              label="Email/User name"
              keyboardType="email-address"
              placeholderTextColor="#BCBCBC"
              onChangeText={(text) => this.setState({ username: text })}
              value={this.state.username}
              autoCorrect
            />
            <StyledTextInput
              placeholder="*********"
              label="Password"
              textInputContainerStyles={{ marginTop: 30 }}
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={true}
              placeholderTextColor="#BCBCBC"
              value={this.state.password}
            />
          </View>

          <Button
            buttonStyle={styles.btnLogin}
            labelStyle={styles.btnText}
            label="Login"
            onPress={() => this._login()}
            loader={this.state.loader}
          />
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.checkboxBtn} onPress={() => this.setState({ rememberMe: !rememberMe })} >
              <Image source={(rememberMe) ? checkboxSelected : checkbox} style={styles.checkboxImage} resizeMode="contain" />
              <Text style={{ color: '#0C0D34', fontWeight: 'bold', marginLeft: 5, fontSize: actuatedNormalize(14) }}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotpasswordText}>Forgot password</Text>
            </TouchableOpacity>
          </View>

        </View>

      </KeyboardAwareScrollView>
    );
  }
}


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
    fontSize: actuatedNormalize(28),
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#15224F',
  },
  inputsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  btnLogin: {
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
    fontSize: actuatedNormalize(17),
    color: '#fff',
    fontWeight: 'bold'
  },
  footerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,    
    justifyContent: 'space-between'
  },
  checkboxBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxImage: {
    width: actuatedNormalize(16),
    height: actuatedNormalize(16),
  },
  forgotpasswordText: {
    color: '#75B94A',
    fontWeight: 'bold',
    fontSize: actuatedNormalize(14)
  }
})