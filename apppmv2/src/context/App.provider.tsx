import React, { useCallback, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParams } from "../navigation/Stack.Navigator";

const storageKey = 'my-app-data';

const getAppData = async (): Promise<unknown> => {
    try {
        const data = await AsyncStorage.getItem(storageKey);

        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch {
        return null;
    }
};

const setAppData = async (newData: any) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
    } catch {}
  };

type AppContextType = {
    data: any;
};

const defaultValue = {
    data: [],
};

const AppContext = React.createContext<AppContextType>(defaultValue);

export const AppProvider: React.FC<{children: any}> = ({ children }) => {
    const [data, setData] = useState<any>();

    useEffect(() => {
        const getDataFromStorage = async () => {
            const data = await getAppData();

            if(data) {
                setData(data);
                setAppData(data);
            }
        };
        getDataFromStorage();
    }, []);

    return (
        <AppContext.Provider value={{ data }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => React.useContext(AppContext);