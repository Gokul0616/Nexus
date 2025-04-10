// import React, { forwardRef, useRef } from 'react';
// import { Dimensions, Image, StyleSheet, Text } from 'react-native';
// import Video from 'react-native-video';
// import {
//     GestureHandlerRootView,
//     GestureDetector,
//     Gesture,
// } from 'react-native-gesture-handler';
// import Animated, {
//     useSharedValue,
//     useAnimatedStyle,
//     withSpring,
//     withDecay,
//     withTiming,
//     runOnJS,
// } from 'react-native-reanimated';

// const { width, height } = Dimensions.get('window');

// const DraggableMedia = forwardRef(({ source, type, onTransformChange }, ref) => {
//     const scale = useSharedValue(1);
//     const translationX = useSharedValue(0);
//     const translationY = useSharedValue(0);
//     const savedScale = useSharedValue(1);
//     const savedTranslationX = useSharedValue(0);
//     const savedTranslationY = useSharedValue(0);

//     const pinchGesture = Gesture.Pinch()
//         .onUpdate((event) => {
//             scale.value = savedScale.value * event.scale;
//         })
//         .onEnd(() => {
//             savedScale.value = scale.value;
//             if (onTransformChange) {

//                 runOnJS(onTransformChange)({
//                     scale: savedScale.value,
//                     translateX: savedTranslationX.value,
//                     translateY: savedTranslationY.value,
//                 });
//             }

//         });

//     const panGesture = Gesture.Pan()
//         .onUpdate((event) => {
//             translationX.value = savedTranslationX.value + event.translationX;
//             translationY.value = savedTranslationY.value + event.translationY;
//         })
//         .onEnd(() => {
//             savedTranslationX.value = translationX.value;
//             savedTranslationY.value = translationY.value;
//             if (onTransformChange) {

//                 runOnJS(onTransformChange)({
//                     scale: savedScale.value,
//                     translateX: savedTranslationX.value,
//                     translateY: savedTranslationY.value,
//                 });
//             }

//         });

//     const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

//     const animatedStyle = useAnimatedStyle(() => ({
//         transform: [
//             { translateX: translationX.value },
//             { translateY: translationY.value },
//             { scale: scale.value },
//         ],
//     }));

//     return (
//         <GestureHandlerRootView style={styles.container}>
//             <GestureDetector gesture={composedGesture}>
//                 <Animated.View style={[styles.mediaContainer, animatedStyle]}>
//                     {type === 'video' ? (
//                         <Video
//                             source={{ uri: source.uri }}
//                             style={styles.media}
//                             resizeMode="contain"
//                             repeat
//                             muted={false} ref={ref}
//                         />
//                     ) : type === 'image' ? (
//                         <Image
//                             source={{ uri: source.uri }}
//                             style={styles.media}
//                             resizeMode="contain"
//                         />
//                     ) : type === 'text' ? <Text style={{ color: source.color }}>{source.content}</Text> : null}
//                 </Animated.View>
//             </GestureDetector>
//         </GestureHandlerRootView>
//     );
// });

// export default DraggableMedia;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     mediaContainer: {
//         width,
//         height,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     media: {
//         width: width * 0.9,
//         height: height * 0.6,
//     },
// });

import React, { forwardRef } from 'react';
import { Dimensions, Image, StyleSheet, Text } from 'react-native';
import Video from 'react-native-video';
import {
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const DraggableMedia = forwardRef(({ source, type, onTransformChange }, ref) => {
    const scale = useSharedValue(1);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const rotation = useSharedValue(0);

    const savedScale = useSharedValue(1);
    const savedTranslationX = useSharedValue(0);
    const savedTranslationY = useSharedValue(0);
    const savedRotation = useSharedValue(0);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            if (onTransformChange) {
                runOnJS(onTransformChange)({
                    scale: savedScale.value,
                    translateX: savedTranslationX.value,
                    translateY: savedTranslationY.value,
                    rotation: savedRotation.value,
                });
            }
        });

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translationX.value = savedTranslationX.value + event.translationX;
            translationY.value = savedTranslationY.value + event.translationY;
        })
        .onEnd(() => {
            savedTranslationX.value = translationX.value;
            savedTranslationY.value = translationY.value;
            if (onTransformChange) {
                runOnJS(onTransformChange)({
                    scale: savedScale.value,
                    translateX: savedTranslationX.value,
                    translateY: savedTranslationY.value,
                    rotation: savedRotation.value,
                });
            }
        });

    const rotationGesture = Gesture.Rotation()
        .onUpdate((event) => {
            rotation.value = savedRotation.value + event.rotation;
        })
        .onEnd(() => {
            savedRotation.value = rotation.value;
            if (onTransformChange) {
                runOnJS(onTransformChange)({
                    scale: savedScale.value,
                    translateX: savedTranslationX.value,
                    translateY: savedTranslationY.value,
                    rotation: savedRotation.value,
                });
            }
        });

    // Combine the pinch, pan, and rotation gestures simultaneously.
    const composedGesture = Gesture.Simultaneous(
        pinchGesture,
        panGesture,
        rotationGesture
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translationX.value },
            { translateY: translationY.value },
            { scale: scale.value },
            { rotate: `${rotation.value}rad` },  // Rotation in radians
        ],
    }));

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={composedGesture}>
                <Animated.View style={[styles.mediaContainer, animatedStyle]}>
                    {type === 'video' ? (
                        <Video
                            source={{ uri: source.uri }}
                            style={styles.media}
                            resizeMode="contain"
                            repeat
                            muted={false}
                            ref={ref}
                            useTextureView={true}
                        />
                    ) : type === 'image' ? (
                        <Image
                            source={{ uri: source.uri }}
                            style={styles.media}
                            resizeMode="contain"
                        />
                    ) : type === 'text' ? (
                        <Text style={{ color: source.color }}>
                            {source.content}
                        </Text>
                    ) : null}
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
});

export default DraggableMedia;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mediaContainer: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    media: {
        width: width * 0.9,
        height: height * 0.6,
    },
});
