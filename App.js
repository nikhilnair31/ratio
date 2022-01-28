import { NavigationContainer, getFocusedRouteNameFromRoute  } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox, StyleSheet, View } from 'react-native';
import React, {useState} from 'react';
import SplashScreen from './screens/SplashScreen.js';
import LoginPage from './screens/LoginPage.js';
import HomePage from './screens/HomePage.js';
import ProfilePage from './screens/ProfilePage.js';
import SearchPage from './screens/SearchPage.js';
import NewPostPage from './screens/NewPostPage.js';
import IndivPostPage from './screens/IndivPostPage.js';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator labeled={false} barStyle={{ backgroundColor: 'black' }} activeColor="white" >
            <Tab.Screen name="Home" component={HomePage} options={{tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="home" color={color} size={25}/>),}}/>
            <Tab.Screen name="Search" component={SearchPage} options={{tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="magnify" color={color} size={25}/>),}}/>
            <Tab.Screen name="Profile" component={ProfilePage} options={{tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account-circle" color={color} size={25}/>),}}/>
        </Tab.Navigator>
    );
}

const App = () => {
    LogBox.ignoreLogs(['Asyncstorage: ...']);
    const [saveddisplayName, setSaveddisplayName] = useState('');

    async function getLocalData (key) {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log('getLocalData value: ', value);
            if (value !== null) setSaveddisplayName(value);;
        } catch (error) {
            console.log('getLocalData error: ', error);
        }
    }
    function getHeaderTitle(route) {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'home';
        console.log('routeName: ', routeName);
        getLocalData('@expo:displayName');
        switch (routeName) {
            case 'Profile': {
                return {
                    headerTitle: 'profile',
                };
            }
            case 'Search': {
                return {
                    headerTitle: 'search',
                };
            }
            case 'Home':
            default: {
                return {
                    headerTitle: 'hey '+JSON.stringify(saveddisplayName).split(" ")[0].replace(/["']/g, "").toLowerCase(),
                };
            }
        }
    }

    return (
        <View style={styles.container}>
            <NavigationContainer >
                <Stack.Navigator initialRouteName='SplashScreen' >
                    <Stack.Screen name="SplashScreen" component={SplashScreen} />
                    <Stack.Screen name="Login" component={LoginPage} />
                    <Stack.Screen name="HomePage" component={HomeTabs} options={({ route }) => getHeaderTitle(route)}/>
                    <Stack.Screen name="NewPostPage" component={NewPostPage} />
                    <Stack.Screen name="IndivPostPage" component={IndivPostPage} />
                    <Stack.Screen name="ProfilePage" component={ProfilePage} /> 
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}
export default App

const styles = StyleSheet.create({
    container: {
        flex:1, 
        backgroundColor: 'black',
    },
});