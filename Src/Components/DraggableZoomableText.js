import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function DraggableZoomableText({ text }) {
    const scale = useSharedValue(1);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const savedScale = useSharedValue(1);
    const savedTranslationX = useSharedValue(0);
    const savedTranslationY = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translationX.value = savedTranslationX.value + event.translationX;
            translationY.value = savedTranslationY.value + event.translationY;
        })
        .onEnd(() => {
            savedTranslationX.value = translationX.value;
            savedTranslationY.value = translationY.value;
        });

    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translationX.value },
            { translateY: translationY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={composedGesture}>
                <Animated.View style={styles.container}>
                    <Animated.View style={[styles.textContainer, animatedStyle]}>
                        <Text style={[styles.text, { color: text.color }]}>
                            {text.content}
                        </Text>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textContainer: {
        position: 'absolute',
        top: height / 2,
        left: width / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
});
