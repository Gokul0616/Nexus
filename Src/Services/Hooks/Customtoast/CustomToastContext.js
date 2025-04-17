import React, { createContext, useState, useRef, useEffect } from 'react';
import { Animated, Text, View, StyleSheet, Dimensions, Image, Appearance } from 'react-native';

const { width } = Dimensions.get('window');

export const ToastContext = createContext({
    show: () => { },
});

export const ToastProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [withIcon, setWithIcon] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('rgba(50, 50, 50, 0.85)');
    const [textColor, setTextColor] = useState('#fff');
    const opacity = useRef(new Animated.Value(0)).current;

    const theme = Appearance.getColorScheme();

    useEffect(() => {
        if (theme === 'dark') {
            setBackgroundColor('rgba(50, 50, 50, 0.85)');
            setTextColor('#fff');
        } else {
            setBackgroundColor('rgba(255, 255, 255, 0.9)');
            setTextColor('#333');
        }
    }, [theme]);

    const show = (msg, icon = false, duration = 1500) => {
        setMessage(msg);
        setWithIcon(icon);
        setVisible(true);


        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(duration),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setVisible(false));
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {visible && (
                <Animated.View
                    style={[styles.toastContainer, { opacity, backgroundColor }]}>
                    <View style={styles.toastContent}>
                        {withIcon && (
                            <Image
                                source={require('../../../../assets/images/logo.png')}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        )}
                        <Text style={[styles.toastText, { color: textColor }]}>{message}</Text>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 16,
        zIndex: 9999,
        elevation: 10,
        maxWidth: width - 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        backdropFilter: 'blur(10px)',
    },
    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toastText: {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: '500',
        flexShrink: 1,
    },
    icon: {
        width: 20,
        height: 20,
        borderRadius: 4,
    },
});
