import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Text, View, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PrimaryColor, SecondaryColor } from './CommonData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RecordButton = ({ isRecording, onPress, duration, onRecordingComplete, onTimeUpdate, }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [remainingTime, setRemainingTime] = useState(duration);
    const timerRef = useRef(null);

    const size = 80;
    const strokeWidth = 4;
    const radius = (size / 2) - (strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;


    useEffect(() => {
        if (isRecording) {
            progressAnim.setValue(0);

            Animated.timing(progressAnim, {
                toValue: 1,
                duration: duration * 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();

            timerRef.current = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        if (onRecordingComplete) onRecordingComplete();
                        return 0;
                    }
                    return prev - 1;
                });

            }, 1000);
        } else {
            progressAnim.stopAnimation();
            progressAnim.setValue(0);
            clearInterval(timerRef.current);
            setRemainingTime(duration);
        }

        return () => clearInterval(timerRef.current);
    }, [isRecording, duration]);
    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0]
    });
    useEffect(() => {
        if (onTimeUpdate) {
            onTimeUpdate(remainingTime);
        }
    }, [remainingTime]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="#ddd"
                    fill="none"
                />

                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={isRecording ? '#c00' : '#0c0'}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </Svg>

            <View style={[
                styles.innerButton,
                isRecording ? styles.recordingInner : styles.readyInner
            ]}>
                <Text style={styles.text}>
                    {isRecording ? remainingTime + "s" : 'REC'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    readyInner: {
        backgroundColor: SecondaryColor,
    },
    recordingInner: {
        backgroundColor: '#c00',

    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default RecordButton;
