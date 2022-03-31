import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import OrderListViewBlock from './OrderListViewBlock'
import { FilterModal, DetailsModal } from '../../../component'
import { _getOrderList } from '../../../operations/dashboardOP';
import { actuatedNormalize } from '../../../services/actuatedNormalizeFont';
import { CommonActions } from '@react-navigation/native';
import { getData, storeData, removeData } from "../../../services/AsyncStorageServices";
const btn_start_route = require('../../../images/btn_start_route.png')

const DATA_TO_SHOW = 10

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      orderList: [],
      offset: 0,
      orderStatus: 'pending',
      onlyForToday: 1,
      openDetailsModal: false,
      detailsModalItem: null,
      openFilterModal: false,
      totalOrder: 0
    };
  }

  async componentDidMount() {
    await this._getOrderList()
  }

  async _getOrderList(refresh = false) {

    if (refresh) {
      this.setState({
        orderList: [],
        offset: 0,
        orderStatus: this.state.orderStatus,
        onlyForToday: this.state.onlyForToday,
        loader: true,
        totalOrder: 0
      })
    }

    const userid = await getData('userid')

    const param = {
      userid: userid,
      offset: this.state.offset,
      orderstatus: this.state.orderStatus,
      onlyForToday: this.state.onlyForToday
    }

    this.setState({ loader: true })
    const response = await _getOrderList(param)
    this.setState({ loader: false })

    if (response !== false) {
      let sum = 0

      if (this.state.offset >= 10)
        sum = parseInt(this.state.totalOrder) + response.total_count
      else
        sum = response.total_count

      this.setState({
        orderList: [...this.state.orderList, ...response.data],
        totalOrder: sum
      })
    }

  }

  skipOrder = (index) => {
    let copyOrderListData = this.state.orderList
    copyOrderListData[index].isSkip = !copyOrderListData[index].isSkip
    this.setState({
      orderList: copyOrderListData
    })
    //console.log(this.state.orderList);
  }

  addToRoute = (index) => {
    let copyOrderListData = this.state.orderList
    copyOrderListData[index].isSkip = !copyOrderListData[index].isSkip
    this.setState({
      orderList: copyOrderListData
    })
  }

  handleDetailsModal = (item) => {
    this.setState({
      openDetailsModal: true,
      detailsModalItem: item
    })
  }

  startRoute = () => {
    const { orderList } = this.state
    let coordinateList = []
    orderList.map((item, index) => {
      if (item.isSkip === false && (!isNaN(item.lat) && !isNaN(item.lng))) {
        coordinateList.push({
          lat: item.lat,
          lng: item.lng,
          address: item.address
        })
      }
    })
    //&& this.state.orderStatus == 'pending' && this.state.onlyForToday == 1
    if (coordinateList.length > 0 )
      this.props.navigation.navigate('Map', { tripCoordinateList: coordinateList })
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

  loadMore = () => {
    this.setState({
      offset: this.state.offset + DATA_TO_SHOW,
    }, async () => await this._getOrderList())

  }

  renderLoadMoreButton() {
    return (
      <TouchableOpacity style={styles.loadMoreBtn} onPress={this.loadMore} >
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <OrderListViewBlock
        index={index}
        item={item}
        handleDetailsModal={(item) => this.handleDetailsModal(item)}
        skipOrder={(index) => this.skipOrder(index)}
        addToRoute={(index) => this.addToRoute(index)}
        orderStatus={this.state.orderStatus}
      />
    )
  }

  render() {
    return (
      <View style={[styles.container]}>

        <View style={styles.header}>
          <View style={styles.logoutView}>
          </View>

          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Dashboard</Text>
          </View>

          <TouchableOpacity style={[styles.logoutView]} onPress={() => this._logout()}>
            <AntDesign name="logout" color="#15224F" style={{ fontSize: actuatedNormalize(25), marginRight: 10 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.routeBtnContainer}>
          <TouchableOpacity onPress={() => this.startRoute()}>
            <View style={{ height: actuatedNormalize(47) }}>
              <Image source={btn_start_route} style={{ flex: 1, width: actuatedNormalize(130) }} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.filterBtnView}>
          <Text style={{ paddingLeft: 10, fontSize: actuatedNormalize(12) }}>
            {this.state.totalOrder} Order found.
          </Text>
          <TouchableOpacity style={styles.filterBtn} onPress={() => this.setState({ openFilterModal: true })}>
            <Ionicons
              name="filter-outline"
              size={actuatedNormalize(14)}
            />
            <Text style={{ fontSize: actuatedNormalize(14) }}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.listView]}>
          <FlatList
            data={this.state.orderList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
            ListFooterComponent={
              (!this.state.loader && this.state.totalOrder > 9) &&
              this.renderLoadMoreButton.bind(this)
            }
            refreshing={this.state.loader}
            onRefresh={async () => await this._getOrderList(true)}
          />
          <View style={styles.bottomBtnView}>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => {
              this.setState({
                onlyForToday: (this.state.onlyForToday == 1) ? 0 : 1
              }, async () => await this._getOrderList(true))
            }}>
              <Text style={styles.btnText}>
                {
                  (this.state.onlyForToday == 1) ?
                    "Show all"
                    :
                    'Today\'s order'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DetailsModal
          closeDetailsModal={() => this.setState({ openDetailsModal: false })}
          isVisible={this.state.openDetailsModal}
          detailsModalItem={this.state.detailsModalItem}
        />
        <FilterModal
          isVisible={this.state.openFilterModal}
          selectedFilterValue={this.state.orderStatus}
          closeFilterModal={() => this.setState({ openFilterModal: false })}
          onPressFilterOption={(v) => {
            this.setState({
              orderStatus: v,
              openFilterModal: false
            }, () => this._getOrderList(true))
          }}
        />

      </View>
    );
  }
}

export default DashboardScreen

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
    fontSize: actuatedNormalize(25)
  },
  headerTextView: {
    flex: 0.85,
    //backgroundColor:'red'
  },
  logoutView: {
    flex: 0.15,
    alignItems: 'flex-end',
    justifyContent: 'center',
    //backgroundColor:'pink',
    // paddingRight: 10 
  },
  routeBtnContainer: {
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listView: {
    flex: 1,
    //marginTop: 20
  },
  loadMoreBtn: {
    padding: actuatedNormalize(10),
    backgroundColor: '#62AF31',
    marginHorizontal: wp('20%'),
    borderRadius: 100,
    marginVertical: 15
  },
  loadMoreText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: actuatedNormalize(13)
  },
 
  filterBtnView: {
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  filterBtn: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomBtnView: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  bottomBtn: {
    width: actuatedNormalize(80),
    height: actuatedNormalize(40),
    justifyContent: 'center',
    backgroundColor: '#15224F',
    borderRadius: 100,
    elevation: 10,
    paddingHorizontal: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: actuatedNormalize(12),
    textAlign: 'center'
  }
})