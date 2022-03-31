import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { actuatedNormalize } from '../../../services/actuatedNormalizeFont';

const iccall = require('../../../images/ic-call.png')

export default class OrderListViewBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { item, handleDetailsModal, skipOrder, index, addToRoute, orderStatus } = this.props
    
    return (
      <View style={styles.contianer}>
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <View style={styles.leftBlock}>

            <View>
              <Text style={styles.title}>Order ID:</Text>
              <Text style={styles.value}>{item.order_number}</Text>
            </View>

            <View style={styles.topGap}>
              <Text style={styles.title}>Product:</Text>

              <View>
                {
                  item.product_details.map((v, i) => {
                    return (
                      <Text style={styles.value} key={i}>{v.trim()} </Text>
                    )
                  })
                }
              </View>
            </View>

            <View style={styles.topGap}>
              <Text style={styles.title}>Total charges:</Text>
              <Text style={styles.value}>$ {item.order_total}</Text>
            </View>

            <View style={styles.topGap}>
              <Text style={styles.title}>Phone:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={iccall} style={{ width: 20, height: 20 }} resizeMode="contain" />
                <Text style={[styles.value, { marginLeft: 7 }]}>{item.phone}</Text>
              </View>
            </View>

          </View>

          <View style={styles.rightBlock}>

            <View>
              <View style={styles.btnContainer}>
                <TouchableOpacity onPress={() => handleDetailsModal(item)} style={styles.btn} >
                  <Ionicons name="information-circle" style={{ color: '#fff' }} size={actuatedNormalize(12)} />
                  <Text style={styles.btnText}>Details</Text>
                </TouchableOpacity>
              </View>

              {
                (item.isSkip === false) ?
                  <View style={styles.btnContainer}>                
                    <TouchableOpacity onPress={() => skipOrder(index)} style={styles.btn} >
                      <Entypo name="circle-with-cross" style={{ color: '#fff' }} size={actuatedNormalize(12)} />
                      <Text style={styles.btnText}>Skip</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.addtoRouteBtn} onPress={() => addToRoute(index)}>
                      <Text style={styles.addtoRouteBtnText}>Add to Route</Text>
                    </TouchableOpacity>
                  </View>
              }
            </View>
            <Text style={styles.orderStatusText}>
              {orderStatus}
            </Text>

          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contianer: {
    padding: 10,
  },
  leftBlock: {
    flex: 0.65
  },
  rightBlock: {
    flex: 0.35,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: actuatedNormalize(14),
    color: '#A3A6B2',
    fontWeight: 'bold',
  },
  value: {
    fontSize: actuatedNormalize(15),
    color: '#15224F',
    fontWeight: 'bold',
    marginTop: 5
  },
  topGap: {
    marginTop: 15
  },
  divider: {
    backgroundColor: '#C3C5CD',
    height: 1,
    marginTop: 25
  },
  addtoRouteBtn: {
    backgroundColor: '#62AF31',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent:'center',
    height: actuatedNormalize(30),
    width: actuatedNormalize(70),
  },
  addtoRouteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: actuatedNormalize(10)
  },
  btnContainer: {
    alignItems: 'flex-end',
    marginVertical: 5,
    //backgroundColor:'pink'
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#584933',
    paddingHorizontal: 15,
    borderRadius: 100,
    height: actuatedNormalize(30),
    width: actuatedNormalize(70),
    justifyContent:'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: actuatedNormalize(10)
  },
  orderStatusText: {
    fontSize: actuatedNormalize(12),
    textTransform: 'capitalize',
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#62AF31'
  }
})
