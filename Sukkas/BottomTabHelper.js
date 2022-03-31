import { View, Text } from 'react-native'
const dashboard_default = require('./src/images/ic_dashboard_default_without_lable.png')
const order_status_default = require('./src/images/ic_order_status_default_without_lable.png')
const settings_default = require('./src/images/ic_settings_default_without_lable.png')

const dashboard_active = require('./src/images/ic_dashboard_active_without_lable.png')
const order_status_active = require('./src/images/ic_order_status_active_without_lable.png')
const settings_active = require('./src/images/ic_settings_active_without_lable.png')

export default class BottomTabHelper {
    static setTabIcon(route, focused) {

        if (focused) {
            if (route.name == 'Dashboard')
                return dashboard_active
            if (route.name == 'OrderStatus')
                return order_status_active
            if (route.name == 'Settings')
                return settings_active

        } else {
            if (route.name == 'Dashboard')
                return dashboard_default
            if (route.name == 'OrderStatus')
                return order_status_default
            if (route.name == 'Settings')
                return settings_default
        }
    }

    static setTabTitle(route) {
        if (route.name == 'Dashboard')
            return 'Dashboard'
        if (route.name == 'OrderStatus')
            return 'Order Status'
        if (route.name == 'Settings')
            return 'Settings'
    }
  
}