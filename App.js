import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { View } from 'react-native';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginPage from './screens/LoginPage.js';
import HomePage from './screens/HomePage.js';
import ProfilePage from './screens/ProfilePage.js';
import SearchPage from './screens/SearchPage.js';
import NewPostPage from './screens/NewPostPage.js';
import PostPage from './screens/PostPage.js';
import { LogBox } from 'react-native';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Asyncstorage: ...']);

function HomeTabs() {
    return (
        <Tab.Navigator labeled={false} barStyle={{ backgroundColor: 'black' }} activeColor="white" >
            <Tab.Screen name="Home" component={HomePage} options={{tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home" color={color} size={25}/>),}} />
            <Tab.Screen name="Search" component={SearchPage} options={{tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="magnify" color={color} size={25}/>),}}/>
            <Tab.Screen name="Profile" component={ProfilePage} options={{tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account-circle" color={color} size={25}/>),}}/>
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <View style={{ flex:1, backgroundColor: 'black' }}>
            <NavigationContainer >
                <Stack.Navigator initialRouteName='Login'>
                    <Stack.Screen name="Login" component={LoginPage} />
                    <Stack.Screen name="HomePage" component={HomeTabs} />
                    <Stack.Screen name="NewPostPage" component={NewPostPage} />
                    <Stack.Screen name="ProfilePage" component={ProfilePage} /> 
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}