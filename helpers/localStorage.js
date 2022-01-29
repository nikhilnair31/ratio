import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
    wait: (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    },
    getLocalData: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log('getLocalData value: ', value);
            if (value !== null) 
                return value;
        } 
        catch (error) {
            console.log('getLocalData error: ', error);
        }
    },
};