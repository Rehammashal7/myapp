import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import theme from "./Color";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useThemeStyles = (userId) => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const docRef = doc(db, "users", userId);
            const getref = await getDoc(docRef);
            const isdark = getref.data()?.isDark ?? false;
            console.log(isdark)
            setDark(isdark);
            console.log(dark);
        };
        getUser();
    }, [userId]);

    const COLORS = dark ? theme.DARK_COLORS : theme.LIGHT_COLORS;

    return COLORS;
};

export default useThemeStyles;