import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AlertBox from '../../Components/AlertMessage';
import { uploadStory } from '../../Components/CommonData';
import RecordButton from '../../Components/RecordButton';
import StoryEditor from '../../Components/StoryEditor';

const MAX_RECORDING_DURATION = 120;
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const ITEM_WIDTH = 70;
const SPACER_ITEM_SIZE = (ITEM_WIDTH * 2) / 2;
const AddPostCamera = () => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [cameraPosition, setCameraPosition] = useState('back');
    const [torch, setTorch] = useState(false);
    const cameraRef = useRef(null);
    const devices = useCameraDevices();
    const backDevice = devices.find(d => d.position === 'back');
    const frontDevice = devices.find(d => d.position === 'front');
    const [editorVisible, setEditorVisible] = useState(false);
    const isFocused = useIsFocused()
    const device = cameraPosition === 'back' ? backDevice : frontDevice;
    const [remainingTime, setRemainingTime] = useState(0);
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);
    const [pickedMedia, setPickedMedia] = useState(null);


    const videoRef = useRef(null);

    const [recordingSpeed, setRecordingSpeed] = useState(1);
    const [beautyMode, setBeautyMode] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(15);
    const durationOptions = [15, 30, 60, 120];
    const flatListRef = useRef(null);

    const animatedValue = useRef(new Animated.Value(0)).current;

    const durationsWithSpacers = [
        'left-spacer',
        ...durationOptions,
        'right-spacer',
    ];
    const [selectedEffect, setSelectedEffect] = useState(null);
    const [timerDelay, setTimerDelay] = useState(0);

    const [isMessage, setIsMessage] = useState({
        message: '',
        heading: '',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => { },
        setShowAlert: () => { },
        showAlert: false,
    });
    const closeAlert = () => {
        setIsMessage(prev => ({ ...prev, showAlert: false }));
    };

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermission();
            const microphonePermission = await Camera.requestMicrophonePermission();
            setHasPermission(
                (cameraPermission === 'authorized' || cameraPermission === 'granted') &&
                (microphonePermission === 'authorized' || microphonePermission === 'granted')
            );
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor('#151515');
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setBackgroundColor('#fff');
                StatusBar.setBarStyle('dark-content');
            };
        }, [])
    );


    const startRecording = async () => {
        if (!cameraRef.current) return;
        const beginRecording = async () => {
            setIsRecording(true);
            try {
                await cameraRef.current.startRecording({
                    maxDuration: MAX_RECORDING_DURATION,
                    onRecordingFinished: (video) => {
                        setIsRecording(false);

                        navigation.navigate('UploadScreen', {
                            path: video.path,
                            speed: recordingSpeed,
                            beauty: beautyMode,
                            effect: selectedEffect
                        });
                    },
                    onRecordingError: (error) => {
                        console.error('Recording error:', error);
                        setIsRecording(false);
                    },
                });
            } catch (e) {
                console.error(e);
                setIsRecording(false);
            }
        };

        if (timerDelay > 0) {
            Alert.alert('Timer', `Recording will start in ${timerDelay / 1000} seconds.`);
            setTimeout(beginRecording, timerDelay);
        } else {
            beginRecording();
        }
    };

    const stopRecording = async () => {
        if (!cameraRef.current) return;
        try {
            await cameraRef.current.stopRecording();
            setIsRecording(false);
        } catch (e) {
            console.error(e);
        } finally {
            setRemainingTime(0);
        }
    };

    const handleRecordPress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };
    const handleRecordingComplete = async () => {
        if (isRecording) {
            try {
                await stopRecording();
            } catch (err) {
                console.error('Error stopping recording:', err);
            }
        }
    };

    const handleGallery = () => {
        setIsLauncherOpen(true)

        const options = {
            mediaType: 'video',
            selectionLimit: 1,
            durationLimit: MAX_RECORDING_DURATION,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled gallery picker');
                setIsLauncherOpen(false)
            } else if (response.errorCode) {
                console.error('Gallery Error: ', response.errorMessage);
                setIsLauncherOpen(false)

            } else if (response.assets && response.assets.length > 0) {
                const videoAsset = response.assets[0];
                if (videoAsset.duration && videoAsset.duration > MAX_RECORDING_DURATION) {
                    setIsMessage({
                        message: 'Please select a video that is 2 minutes or shorter.',
                        heading: 'Video Too Long',
                        isRight: false,
                        rightButtonText: 'OK',
                        triggerFunction: () => { },
                        setShowAlert: () => {

                            setIsMessage(prevState => ({
                                ...prevState,
                                showAlert: false,
                            }));
                        },
                        showAlert: true,
                    });
                    setIsLauncherOpen(false)

                    return;
                }
                if (videoAsset.fileSize && videoAsset.fileSize > MAX_FILE_SIZE) {
                    setIsMessage({
                        message: 'Please select a video smaller than 100 MB.',
                        heading: 'File Too Large',
                        isRight: false,
                        rightButtonText: 'OK',
                        triggerFunction: () => { },
                        setShowAlert: () => {
                            setIsMessage(prevState => ({
                                ...prevState,
                                showAlert: false,
                            }));
                        },
                        showAlert: true,
                    });
                    setIsLauncherOpen(false)

                    return;
                }
                navigation.navigate('UploadScreen', { path: videoAsset.uri });
                setIsLauncherOpen(false)

            }
        });
    };




    const handleSpeedPress = () => {
        Alert.alert(
            'Select Recording Speed',
            '',
            [
                { text: '0.5x', onPress: () => setRecordingSpeed(0.5) },
                { text: '1x', onPress: () => setRecordingSpeed(1) },
                { text: '2x', onPress: () => setRecordingSpeed(2) },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    useEffect(() => {
        const backPressHandler = () => {
            if (editorVisible) {
                if (videoRef.current) {
                    videoRef.current.pause(); // Stop playback when component unmounts
                }
                setEditorVisible(false);
                return true;
            }
            return false;
        }

        const unsubscribeBackPress = BackHandler.addEventListener('hardwareBackPress', backPressHandler);
        return () => {
            unsubscribeBackPress.remove();
        }
    }, [editorVisible, navigation])

    const handleBeautyPress = () => {
        setBeautyMode(prev => !prev);
        Alert.alert('Beauty Mode', !beautyMode ? 'Beauty mode activated' : 'Beauty mode deactivated');
    };


    const handleEffectsPress = () => {
        setIsLauncherOpen(true);
        const options = {
            mediaType: 'mixed',
            selectionLimit: 1,
            durationLimit: MAX_RECORDING_DURATION,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled gallery picker');
                setIsLauncherOpen(false);
            } else if (response.errorCode) {
                console.error('Gallery Error: ', response.errorMessage);
                setIsLauncherOpen(false);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];


                if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
                    setIsMessage({
                        message: 'Please select a file smaller than 100 MB.',
                        heading: 'File Too Large',
                        isRight: false,
                        rightButtonText: 'OK',
                        triggerFunction: () => { },
                        setShowAlert: () => {
                            setIsMessage(prev => ({ ...prev, showAlert: false }));
                        },
                        showAlert: true,
                    });
                    setIsLauncherOpen(false);
                    return;
                }


                if (asset.type === 'video' && asset.duration > MAX_RECORDING_DURATION) {
                    setIsMessage({
                        message: 'Please select a video that is 2 minutes or shorter.',
                        heading: 'Video Too Long',
                        isRight: false,
                        rightButtonText: 'OK',
                        triggerFunction: () => { },
                        setShowAlert: () => {
                            setIsMessage(prev => ({ ...prev, showAlert: false }));
                        },
                        showAlert: true,
                    });
                    setIsLauncherOpen(false);
                    return;
                }



                setPickedMedia(asset);
                setEditorVisible(true);
                setIsLauncherOpen(false);
            }
        });
    };


    const handleTimerPress = () => {
        Alert.alert(
            'Select Timer Delay',
            '',
            [
                { text: 'No Timer', onPress: () => setTimerDelay(0) },
                { text: '3 sec', onPress: () => setTimerDelay(3000) },
                { text: '5 sec', onPress: () => setTimerDelay(5000) },
                { text: '10 sec', onPress: () => setTimerDelay(10000) },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };
    const handleSendStory = async (media, transform) => {
        transform.rotation = transform.rotation * (180 / Math.PI)
        try {
            const result = await uploadStory(media, transform);
        } catch (e) {
            Alert.alert('Upload failed', e.message || 'Try again.');
        }
        navigation.canGoBack() && navigation.goBack();
    }

    if (!hasPermission || !device) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading camera...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            {
                editorVisible && pickedMedia && (
                    <StoryEditor
                        media={pickedMedia}
                        setMedia={setPickedMedia}
                        videoRef={videoRef}
                        onCancel={() => {
                            setEditorVisible(false);
                            if (videoRef.current) {
                                videoRef.current.pause();
                            }
                        }}
                        onPost={(finalMedia, transform) => {
                            handleSendStory(finalMedia, transform)
                            setPickedMedia(null)
                            setEditorVisible(false);
                        }}
                    />
                )
            }
            {!editorVisible && <><Camera
                key={cameraPosition + String(isLauncherOpen)}
                lowLightBoost={true}
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isFocused && !isLauncherOpen}
                video={true}
                torch={torch ? 'on' : 'off'}
                focusable={true}
                audio={true}
                enableZoomGesture={true}
            />



                <View style={styles.topOverlay}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    {isRecording && <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{remainingTime}s</Text>
                    </View>}
                    <TouchableOpacity onPress={() => {
                        if (!device.hasFlash && !device.hasTorch) {
                            return
                        }
                        setTorch(!torch)
                    }} style={styles.iconButton}>
                        <Ionicons name={torch ? "flash-off" : "flash"} size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomOverlay}>
                    <TouchableOpacity
                        onPress={() => setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'))}
                        style={styles.iconButton}
                    >
                        <Ionicons name="camera-reverse" size={28} color="#fff" />
                    </TouchableOpacity>

                    <RecordButton
                        isRecording={isRecording}
                        onPress={handleRecordPress}
                        duration={recordingDuration}
                        onRecordingComplete={() => {
                            handleRecordingComplete()
                        }} onTimeUpdate={(time) => setRemainingTime(time)}
                    />

                    <TouchableOpacity onPress={handleGallery} style={styles.iconButton}>
                        <Ionicons name="images-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Right side overlay with additional TikTok-like features */}
                <View style={styles.sideOverlay}>
                    <TouchableOpacity onPress={() => handleEffectsPress()} style={[styles.addStoryButton]}>
                        <MaterialIcons name="add-circle-outline" size={28} color="#fff" />
                        <Text style={{ marginLeft: 5, color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Add Story</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity onPress={handleEffectsPress} style={styles.sideIconButton}>
                        <Ionicons name="color-wand-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("Face Effects pressed")} style={styles.sideIconButton}>
                    <Ionicons name="happy-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTimerPress} style={styles.sideIconButton}>
                    <Ionicons name="timer-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("Music pressed")} style={styles.sideIconButton}>
                    <Ionicons name="musical-note-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSpeedPress} style={styles.sideIconButton}>
                    <Ionicons name="speedometer-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBeautyPress} style={styles.sideIconButton}>
                    <Ionicons name="brush-outline" size={28} color="#fff" />
                </TouchableOpacity> */}
                </View>
                {!isRecording && <View style={styles.durationScrollContainer}>
                    <Animated.FlatList
                        ref={flatListRef}
                        data={durationsWithSpacers}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        snapToInterval={ITEM_WIDTH}
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: SPACER_ITEM_SIZE,
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                            { useNativeDriver: true }
                        )}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                            const selected = durationOptions[index];
                            if (selected) setRecordingDuration(selected);
                        }}
                        renderItem={({ item, index }) => {
                            if (item === 'left-spacer' || item === 'right-spacer') {
                                return <View style={{ width: SPACER_ITEM_SIZE }} />;
                            }

                            const inputRange = [
                                (index - 2) * ITEM_WIDTH,
                                (index - 1) * ITEM_WIDTH,
                                index * ITEM_WIDTH,
                            ];

                            const scale = animatedValue.interpolate({
                                inputRange,
                                outputRange: [0.8, 1, 0.8],
                                extrapolate: 'clamp',
                            });

                            const opacity = animatedValue.interpolate({
                                inputRange,
                                outputRange: [0.5, 1, 0.5],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    style={[
                                        {
                                            width: ITEM_WIDTH,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transform: [{ scale }],
                                            opacity,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.durationLabel,
                                            recordingDuration === item && styles.durationLabelSelected,
                                        ]}
                                    >
                                        {item === 60 ? '1m' : item === 120 ? '2m' : `${item}s`}
                                    </Text>
                                </Animated.View>
                            );
                        }}
                    />

                </View>}</>}
            <AlertBox
                heading={isMessage.heading}
                message={isMessage.message}
                setShowAlert={closeAlert}
                showAlert={isMessage.showAlert}
                triggerFunction={isMessage.triggerFunction}
                isRight={isMessage.isRight}
                rightButtonText={isMessage.rightButtonText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#fff',
    },
    topOverlay: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }, timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }, timerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconButton: {
        padding: 10,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 5,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'red',
    }, addStoryButton: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 10,
        marginVertical: 8,
    },
    recordingInnerActive: {
        width: 50,
        height: 50,
        borderRadius: 5,
        backgroundColor: 'red',
    },
    sideOverlay: {
        position: 'absolute',
        right: 10,
        top: 100,
        alignItems: 'center',
    },
    sideIconButton: {
        padding: 10,
        marginVertical: 8,
    }, durationSelector: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    durationContentContainer: {
        paddingHorizontal: (70 * 2) / 2,
    },

    durationItem: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#888',
        marginHorizontal: 5,
    },
    durationScrollContainer: {
        position: 'absolute',
        bottom: 160,
        width: '100%',
        alignItems: 'center',
        height: 50,
    },


    durationItemSelected: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },

    durationLabel: {
        color: '#ccc',
        fontSize: 16, borderWidth: 1, borderColor: '#888', padding: 5, borderRadius: 10,
    },

    durationLabelSelected: {
        color: '#fff',
        fontWeight: 'bold', borderWidth: 1, borderColor: '#fff', padding: 5, borderRadius: 10,
    },

});

export default AddPostCamera;
