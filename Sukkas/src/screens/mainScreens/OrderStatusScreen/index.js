import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { showToastMessage, showErrorAlertMessage } from '../../../services/ShowAlertMessages';
import { getData, storeData, removeData } from '../../../services/AsyncStorageServices';
import { _completeOrder, _getPendendingOrders } from '../../../operations/oderstatusOP';
import { Dropdown, Button } from '../../../component'
import { actuatedNormalize } from '../../../services/actuatedNormalizeFont';

const ic_camera = require('../../../images/ic_camera.png')
const btn_order_completed = require('../../../images/btn_order_completed.png')

class OrderStatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      refreshLoader: false,
      btnloader: false,
      comment: '',
      pendingOrderList: [],
      defaultValue: '',
      pictureBase64Code: '',
      pictureMime: ''
    };
  }

  async componentDidMount() {
    await this._getPendendingOrders()
  }

  async _getPendendingOrders() {
    const userid = await getData('userid')

    const param = {
      userid: userid,
    }

    this.setState({ loader: true, refreshLoader: true })
    const response = await _getPendendingOrders(param)
    this.setState({ loader: false, refreshLoader: false })

    if (response !== false) {

      this.setState({
        pendingOrderList: response.list,
        defaultValue: parseInt(response.defaultValue),
        comment: '',
        pictureBase64Code: '',
        pictureMime: ''
      })
    } else {
      this.setState({
        pendingOrderList: [],
        defaultValue: '',
        comment: '',
        pictureBase64Code: '',
        pictureMime: ''
      })
    }
  }

  async _completeOrder() {
    const userid = await getData('userid')
    const orderid = this.state.defaultValue
    const comment = this.state.comment
    const image = this.state.pictureBase64Code

    if (this.state.pictureBase64Code == '') {
      showErrorAlertMessage('Error', 'Please take a picture.')
      return
    }
    if(orderid === ''){
      showErrorAlertMessage('Alert', 'Please select an order.')
      return
    }

    const param = {
      userid: userid,
      orderid: orderid,
      comment: comment,
      image: image
    }
    console.log(param);
    this.setState({ btnloader: true })
    const response = await _completeOrder(param)
    this.setState({ btnloader: false })

    if (response === true) {
      await this._getPendendingOrders()
    }

  }

  openCamera = () => {
    try {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
        includeBase64: true
      }).then(image => {

        this.setState({
          pictureBase64Code: image.data,
          pictureMime: image.mime
        })

      }).catch(err => {
        showToastMessage('Camera canceled!')
      })
    } catch (error) {
      showErrorAlertMessage('Error', 'Something went wrong! \nCamera cannot launch. \n \nPlease try again.')
    }
  }

  _logout = async () => {
    await storeData('rememberme', '0')
    await removeData('userid')
    const action = CommonActions.reset({
      index: 0,
      routes: [{ name: 'LoginStack' }]
    })
    this.props.navigation.dispatch(
      action
    )
  }

  render() {

    return (
      <View style={[styles.container]}>
        <View style={styles.header}>
          <View style={styles.logoutView}>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Order Status</Text>
          </View>

          <TouchableOpacity style={[styles.logoutView]} onPress={() => this._logout()}>
            <AntDesign name="logout" color="#15224F" style={{ fontSize: actuatedNormalize(25), marginRight: 10 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.body} >

          <KeyboardAwareScrollView enableOnAndroid={true} style={{ flexGrow: 1,}}>
            <View style={{marginHorizontal: wp('8%')}} >
              <View style={styles.dropdownView}>
                <Text style={styles.title}>Select Order:</Text>

                <Dropdown
                  items={this.state.pendingOrderList}
                  defaultValue={this.state.defaultValue}
                  onChangeItem={item => this.setState({
                    defaultValue: item.value
                  })}
                />

              </View>

              <View style={styles.cameraView}>

                {
                  (this.state.pictureBase64Code != '') ?
                    <View style={styles.picContainer}>
                      <Image source={{ uri: `data:${this.state.pictureMime};base64,${this.state.pictureBase64Code}` }} style={styles.takenPic} resizeMode="contain" />
                    </View>
                    :
                    <TouchableOpacity style={styles.cameraBtn} onPress={() => this.openCamera()} >
                      <Image source={ic_camera} style={styles.cameraImg} resizeMode="contain" />
                    </TouchableOpacity>
                }

                {
                  (this.state.pictureBase64Code != '') &&
                  <View style={styles.cancelBtnContainer}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => this.setState({ pictureBase64Code: '', pictureMime: '', picturePath: '' })} >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                }

              </View>

              <View style={styles.commentView}>
                <Text style={styles.title}>Comment:</Text>
                <TextInput multiline={true} style={styles.commentInput} numberOfLines={5} value={this.state.comment} placeholder="Write your comment here..." onChangeText={(text) => this.setState({ comment: text })} />
              </View>

              <Button
                buttonStyle={styles.orderBtn}
                labelStyle={styles.btnText}
                label="Order Completed"
                loader={this.state.btnloader}
                onPress={() => this._completeOrder()}
              />

            </View>
          </KeyboardAwareScrollView>

          {
            (this.state.loader) &&
            <View style={[styles.loaderContiner]}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff', marginTop: 15 }} >Please Wait...</Text>
            </View>
          }

          <TouchableOpacity style={styles.refreshBtnView} onPress={async () => await this._getPendendingOrders()} disabled={(this.state.refreshLoader) ? true : false}>
            {
              (this.state.refreshLoader) ?
                <Entypo name="dots-three-horizontal" color="#fff" style={{ fontSize: actuatedNormalize(20) }} />
                :
                <Ionicons name="refresh" color="#fff" style={{ fontSize: actuatedNormalize(20) }} />
            }
          </TouchableOpacity>

        </View>

      </View>

    );
  }
}
export default OrderStatusScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: actuatedNormalize(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#15224F',
    fontSize: actuatedNormalize(25),
  },
  headerTextView: {
    flex: 0.85,
  },
  logoutView: {
    flex: 0.15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  dropdownView: {
    marginTop: 10
  },
  pickerContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 2
  },
  dropdownStyle: {
    height: 40,
    backgroundColor: 'red',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  title: {
    fontSize: actuatedNormalize(12),
    color: '#A3A6B2',
    fontWeight: 'bold',
  },
  cameraView: {
    height: hp('40%'),
    padding: 10,
    backgroundColor: '#EAEBEE',
    borderRadius: 8,
    marginTop: 15
  },
  cameraBtn: {
    flex: 1,
    alignItems: 'center'
  },
  cameraImg: {
    flex: 1,
    width: wp('50%'),
  },
  picContainer: {
    flex: 1,
  },
  takenPic: {
    flex: 1,
  },
  commentView: {
    marginTop: 20
  },
  commentInput: {
    marginTop: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 15,
    textAlignVertical: 'top',
    color: '#15224F',
    fontWeight: 'bold',
    fontSize: actuatedNormalize(15)
  },
  orderBtn: {
    height: actuatedNormalize(50),
    //marginHorizontal: 20,
    backgroundColor: '#584933',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  btnText: {
    fontSize: actuatedNormalize(14),
    color: '#fff',
    fontWeight: 'bold'
  },
  cancelBtnContainer: {
    position: 'absolute',
    zIndex: 9,
    backgroundColor: 'red',
    padding: 10,
    bottom: 10,
    right: 10,
    borderRadius: 30
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%')
  },
  loaderContiner: {
    //flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    padding: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshBtnView: {
    backgroundColor: '#62AF31',
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: actuatedNormalize(50),
    width: actuatedNormalize(50),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8
  }
})