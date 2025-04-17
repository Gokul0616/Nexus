
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Video from "react-native-video";
import Modal from "react-native-modal";
import CustomLoadingIndicator from "./CustomLoadingIndicator";
import apiClient from "../Services/api/apiInterceptor";

const { width, height } = Dimensions.get("window");

export default function StoryViewer({ visible, story, onClose, onReply }) {

    const stories = Array.isArray(story) ? story : [story];


    const [isLoading, setIsLoading] = useState(true);
    const animationRef = useRef(null);

    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [reply, setReply] = useState("");
    const [videoDuration, setVideoDuration] = useState(null);
    const progress = useRef(new Animated.Value(0)).current;
    const transitionAnim = useRef(new Animated.Value(0)).current;

    const currentStory = stories[currentStoryIndex];
    const currentItem = currentStory?.slides?.[currentSlideIndex];
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [transformStyle, setTransformStyle] = useState({});


    useEffect(() => {
        markSlideAsViewed(currentItem);
        try {
            const placement = JSON.parse(currentItem?.placement || '{}');
            const style = {
                transform: [
                    { translateX: placement.translateX || 0 },
                    { translateY: placement.translateY || 0 },
                    { scale: placement.scale > 0.8 ? 0.8 : placement.scale || 1 },
                    { rotate: `${placement.rotation || 0}deg` }
                ]
            };
            setTransformStyle(style);
        } catch (err) {
            console.warn("Failed to parse placement:", err);
            setTransformStyle({});
        }
    }, [currentItem]);


    useEffect(() => {

        if (visible) {
            setVideoDuration(null);

            if (animationRef.current) animationRef.current.stop();
            progress.setValue(0);



            Animated.timing(transitionAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(transitionAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            resetViewer();

        }
    }, [visible, currentStoryIndex]);


    const resetViewer = () => {
        setCurrentStoryIndex(0);
        setCurrentSlideIndex(0);
        if (animationRef.current) animationRef.current.stop();
        progress.setValue(0);
        setVideoDuration(null);
    };


    const markSlideAsViewed = async (slideId) => {
        const id = slideId.id
        try {
            const response = await apiClient.post("stories/view", {
                storyId: id
            });
            slideId.viewed = true;
        } catch (err) {
            console.log("Failed to mark story as viewed", err);
        }
    };


    const animateProgress = (duration, shouldReset = false) => {
        if (animationRef.current) animationRef.current.stop();

        if (shouldReset) {

            progress.setValue(0);
        }

        progress.stopAnimation((currentValue) => {
            const startingValue = shouldReset ? 0 : currentValue;
            const remaining = 1 - startingValue;
            const remainingDuration = duration * remaining;

            animationRef.current = Animated.timing(progress, {
                toValue: 1,
                duration: remainingDuration,
                useNativeDriver: false,
            });

            if (!isInputFocused) {
                animationRef.current.start(({ finished }) => {
                    if (finished) handleNext();
                });
            }
        });
    };


    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsInputFocused(true);
            animationRef.current?.stop();
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsInputFocused(false);
            if (currentItem?.type === "video" && videoDuration) {
                animateProgress(videoDuration * 1000, false);
            } else if (currentItem?.type === "image") {
                animateProgress(5000, false);
            }
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [videoDuration, currentItem]);

    const handleNext = () => {
        setVideoDuration(null);
        if (currentSlideIndex < currentStory?.slides.length - 1) {
            setCurrentSlideIndex((prev) => prev + 1);
        } else if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex((prev) => prev + 1);
            setCurrentSlideIndex(0);
            progress.setValue(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex((prev) => prev - 1);
        } else if (currentStoryIndex > 0) {
            const prevStory = stories[currentStoryIndex - 1];
            setCurrentStoryIndex((prev) => prev - 1);
            setCurrentSlideIndex(prevStory.slides.length - 1);
            progress.setValue(0);
        }
    };



    const handleLeftTap = () => handlePrev();
    const handleRightTap = () => handleNext();

    const handleSendReply = () => {
        if (reply.trim()) {
            onReply(reply);
            setReply("");
        }
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modalContainer}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
            useNativeDriver={false}
            onBackButtonPress={() => {
                onClose();
            }}
        >
            <Animated.View
                style={[
                    styles.container,
                    {
                        opacity: transitionAnim,
                        transform: [
                            {
                                translateX: transitionAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.container}>
                    {/* Left & Right tap areas */}
                    <Pressable style={styles.leftTap} onPress={handleLeftTap} />
                    <Pressable style={styles.rightTap} onPress={handleRightTap} />
                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <CustomLoadingIndicator />
                        </View>
                    )}

                    {/* Top area: Progress bar */}
                    <View style={styles.topArea}>
                        <View style={styles.progressBarContainer}>
                            {currentStory?.slides.map((_, i) => (
                                <View key={i} style={styles.progressSegment}>
                                    {i < currentSlideIndex && (
                                        <View style={[styles.progressFill, { width: "100%" }]} />
                                    )}
                                    {i === currentSlideIndex && (
                                        <Animated.View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: progress.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ["0%", "100%"],
                                                    }),
                                                },
                                            ]}
                                        />
                                    )}
                                </View>
                            ))}
                        </View>

                    </View>
                    <Pressable style={styles.avatarContainer} onPress={() => { }}>
                        <Image
                            source={{ uri: stories[currentStoryIndex]?.avatar }}
                            style={styles.avatar}
                        />
                        <Text style={styles.username}>{stories[currentStoryIndex]?.username}</Text>
                    </Pressable>

                    {/* Middle area: Story content */}
                    <View style={styles.content}>

                        {currentItem?.type === "video" ? (
                            <Video
                                source={{ uri: currentItem?.uri }}
                                style={[styles.media, transformStyle]}
                                useTextureView={true}
                                resizeMode="contain"

                                muted={false}
                                repeat={false}
                                paused={isInputFocused}
                                onLoadStart={() => setIsLoading(true)}
                                onLoad={(data) => {
                                    if (data?.duration) {
                                        setIsLoading(false);
                                        setVideoDuration(data.duration);
                                        animateProgress(data.duration * 1000, true);
                                    }
                                }}

                                onEnd={handleNext}
                                pointerEvents="none"
                            />
                        ) : (
                            <Image
                                source={{ uri: currentItem?.uri }}
                                style={[styles.media, transformStyle]}
                                resizeMode="contain"
                                onLoadStart={() => setIsLoading(true)}
                                onLoadEnd={() => {
                                    setIsLoading(false);
                                    animateProgress(5000, true);
                                }}
                                pointerEvents="none"
                            />
                        )}
                    </View>

                    {/* Bottom area: Reply input */}
                    <View style={styles.bottomArea}>
                        <TextInput
                            value={reply}
                            onChangeText={setReply}
                            placeholder="Send reply..."
                            placeholderTextColor="#ccc"
                            style={styles.input}

                            onFocus={() => {
                                setIsInputFocused(true);
                                animationRef.current?.stop();
                            }}
                            onBlur={() => {


                            }}
                        />
                        <Pressable style={styles.sendButton} onPress={handleSendReply}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </Pressable>
                    </View>

                    {/* Close button */}
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    modalContainer: {
        margin: 0,
        justifyContent: "flex-start",
    },
    topArea: {
        position: "absolute",
        top: 20,
        width: width,
        paddingHorizontal: 10,
        zIndex: 2,
    },
    progressBarContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    progressSegment: {
        flex: 1,
        height: 3,
        backgroundColor: "rgba(255,255,255,0.3)",
        marginHorizontal: 2,
        borderRadius: 2,
        overflow: "hidden",
    },
    progressFill: {
        height: 3,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50,
    },
    media: {
        width: '100%',
        height: '100%',
    },
    bottomArea: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        zIndex: 9999,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: "#333",
        borderRadius: 20,
        paddingHorizontal: 15,
        color: "white",
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#ff004f",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 2,
    },
    closeText: {
        color: "white",
        fontSize: 18,
    },
    leftTap: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width / 2,
        height: height - 80,
        zIndex: 3,
    },
    rightTap: {
        position: "absolute",
        top: 0,
        right: 0,
        width: width / 2,
        height: height - 80,
        zIndex: 3,
    },
    avatarContainer: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 9999,
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#ff004f",
    },
    username: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
});
