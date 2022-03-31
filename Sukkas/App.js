import React, { Component } from 'react';
import { View, Text, StatusBar, Image, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalFont from 'react-native-global-font'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomTabHelper from './BottomTabHelper';
import { getData, removeData } from './src/services/AsyncStorageServices';
import { actuatedNormalize } from './src/services/actuatedNormalizeFont';
import {
  LoginScreen,
  ForgotPasswordScreen,
  DashboardScreen,
  OrderStatusScreen,
  SettingsScreen,
  MapScreen,
  RouteDirectionScreen
} from './src/screens'

const LoginStack = createNativeStackNavigator()
function LoginStackScreen() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Group screenOptions={{ headerShown: false }}>
        <LoginStack.Screen name="Login" component={LoginScreen} />
        <LoginStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </LoginStack.Group>
    </LoginStack.Navigator>
  )
}

const TabStack = createBottomTabNavigator()
function TabStackScreen() {
  return (
    <TabStack.Navigator initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {

          return (
            <View style={styles.tabItem}>
              <View style={styles.imageView}>               
                <Image
                  source={BottomTabHelper.setTabIcon(route, focused)}
                  style={styles.tabIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.titleView}>
                <Text style={[styles.title, (focused) ? styles.titleActive : null]}>{BottomTabHelper.setTabTitle(route)}</Text>
              </View>

            </View>
          );
        },
      })}
    >
      <TabStack.Screen name="Dashboard" component={DashboardScreen} />
      <TabStack.Screen name="OrderStatus" component={OrderStatusScreen} />
      <TabStack.Screen name="Settings" component={SettingsScreen} />

    </TabStack.Navigator>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rememberme: false
    };
  }

  async componentDidMount() {
    SplashScreen.hide()
    let fontName = 'InterRegular'
    GlobalFont.applyGlobal(fontName)

    const rememberme = await getData('rememberme')
    console.log('rememberme', rememberme);
    if (rememberme != null && rememberme != 0) {
      this.setState({
        rememberme: true
      })
    }

  }

  render() {
    const { rememberme } = this.state
    const Stack = createNativeStackNavigator()
    return (
      <SafeAreaProvider>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName={(rememberme) ? "Root" : "Login"}  >
            <Stack.Group screenOptions={{ headerShown: false }}>
              <Stack.Screen name="LoginStack" component={LoginStackScreen} />
              <Stack.Screen name="Root" component={TabStackScreen} />
              <Stack.Screen name="Map" component={MapScreen} />
              <Stack.Screen name="RouteDirection" component={RouteDirectionScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    //alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    width: actuatedNormalize(100),
    paddingTop: 5,
  },
  imageView: {
    flex: 0.6,
  },
  titleView: {
    flex: 0.4,
  },
  tabIcon: {
    width: actuatedNormalize(30),
    flex: 1
  },
  title: {
    textAlign: 'center',
    fontSize: actuatedNormalize(12),
    fontWeight: 'bold',
    color: '#5D4F39'
  },
  titleActive: {
    color: '#62AF31'
  }
})
