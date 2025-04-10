import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    Animated,
    PanResponder,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from "react-native";
import {
    PinchGestureHandler,
    State as GestureState,
} from "react-native-gesture-handler";
import Video from "react-native-video";
import LinearGradient from "react-native-linear-gradient";
import DraggableMedia from "./DraggableMedia";
import DraggableZoomableText from "./DraggableZoomableText";
import { exportMedia } from "./CommonData";

const { width, height } = Dimensions.get("window");

// Example filters
const filters = [
    { name: "Normal", style: {} },
    { name: "Clarendon", style: { filter: "contrast(1.2) saturate(1.2)" } },
    { name: "Juno", style: { filter: "sepia(0.2) contrast(1.1)" } },
    { name: "Ludwig", style: { filter: "brightness(1.05)" } },
];

// Example stickers and color palettes
const stickers = ["🌟", "❤️", "🔥", "👍", "🎉"];
const colorPalette = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FFA500",
    "#800080",
];
export default function StoryEditor({ media, onPost, onCancel, setMedia, videoRef }) {
    const [selectedTool, setSelectedTool] = useState(null); // "text", "sticker", "draw", "filter", etc.
    const [texts, setTexts] = useState([]); // Array of text objects
    const [paths, setPaths] = useState([]); // Array of drawing paths
    const [currentPath, setCurrentPath] = useState([]);
    const [activeFilter, setActiveFilter] = useState(filters[0]);
    const [draftText, setDraftText] = useState("");
    const [drawColor, setDrawColor] = useState("#FF0000"); const [realUrl, setRealUrl] = useState(null)
    const [textColor, setTextColor] = useState("#FFFFFF");
    const editorRef = useRef(null); const [videoTransform, setVideoTransform] = useState({
        scale: 1,
        translateX: 0,
        translateY: 0,
    });

    const pan = useRef(new Animated.ValueXY()).current;
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = Animated.multiply(baseScale, pinchScale);

    // Pan responder for media dragging with native driver disabled.
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => selectedTool === null,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => { },
        })
    ).current;

    // Pinch gesture for media scaling.
    const handlePinch = Animated.event(
        [{ nativeEvent: { scale: pinchScale } }],
        { useNativeDriver: true }
    );

    const handlePinchStateChange = (event) => {
        if (event.nativeEvent.state === GestureState.END) {
            let newScale = baseScale.__getValue() * pinchScale.__getValue();
            if (newScale < 0.5) newScale = 0.5;
            if (newScale > 2.5) newScale = 2.5;
            Animated.spring(baseScale, {
                toValue: newScale,
                useNativeDriver: true,
            }).start(() => {
                pinchScale.setValue(1);
            });
        }
    };



    const addText = () => {
        if (draftText.trim()) {
            const initialX = width / 2 - 50;
            const initialY = height / 2 - 50;
            const opacity = new Animated.Value(0);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            const newText = {
                content: draftText,
                color: textColor,
                position: new Animated.ValueXY({ x: initialX, y: initialY }),
                scale: new Animated.Value(1),
                opacity,
            };
            setTexts((prev) => [...prev, newText]);
            setDraftText("");
        }
        setSelectedTool(null);
    };


    const drawingResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => selectedTool === "draw",
            onPanResponderGrant: (e) => {
                setCurrentPath([{ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }]);
            },
            onPanResponderMove: (e) => {
                setCurrentPath((prev) => [
                    ...prev,
                    { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY },
                ]);
            },
            onPanResponderRelease: () => {
                if (currentPath.length > 0) {
                    setPaths((prev) => [...prev, { color: drawColor, points: currentPath }]);
                    setCurrentPath([]);
                }
            },
        })
    ).current;
    const handlePost = async () => {
        const uri = await exportMedia(media, editorRef, videoTransform);
        setMedia(null)
        if (videoRef.current) {
            videoRef.current.pause(); // Stop playback when component unmounts
        }
        setRealUrl(uri);
        onPost(uri);
        setPaths([]);
        setTexts([]);
        setCurrentPath([]);
        setSelectedTool(null);
        setDraftText("");
        setDrawColor("#FF0000");
        setTextColor("#FFFFFF");
        setActiveFilter(filters[0]);
        setSelectedTool(null);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View
                ref={editorRef}
                collapsable={false}
                style={{ flex: 1 }}
            >
                {media.type.startsWith("video") ? (
                    <DraggableMedia
                        source={{ uri: media.uri }}
                        type={"video"}
                        onTransformChange={(transform) => setVideoTransform(transform)}
                        ref={videoRef}
                    />
                ) : (
                    <DraggableMedia
                        source={{ uri: media.uri }}
                        type={"image"}
                    />
                )}

                <View
                    style={styles.drawingContainer}
                    pointerEvents={selectedTool === "draw" ? "auto" : "none"}
                    {...drawingResponder.panHandlers}
                >
                    {paths.map((pathObj, i) => (
                        <View key={i} style={styles.path}>
                            {pathObj.points.map((point, j) => (
                                <View
                                    key={j}
                                    style={[
                                        styles.drawPoint,
                                        { left: point.x, top: point.y, backgroundColor: pathObj.color },
                                    ]}
                                />
                            ))}
                        </View>
                    ))}
                    {currentPath.map((point, i) => (
                        <View
                            key={`current-${i}`}
                            style={[
                                styles.drawPoint,
                                { left: point.x, top: point.y, backgroundColor: drawColor },
                            ]}
                        />
                    ))}
                </View>

                {texts.map((textItem, index) => (
                    <DraggableZoomableText
                        key={index}
                        text={textItem}
                    />
                ))}
            </View>

            <LinearGradient
                colors={["rgba(0,0,0,0.7)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.topBar}
            >
                <TouchableOpacity onPress={onCancel} style={styles.topButton}>
                    <Text style={styles.topButtonText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePost()} style={styles.topButton}>
                    <Text style={styles.topButtonText}>Post</Text>
                </TouchableOpacity>
            </LinearGradient>

            {!media.type.startsWith("video") &&
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.bottomBar}
                >
                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => setSelectedTool("text")}
                        activeOpacity={0.8}
                    >
                        <Animated.Text style={styles.toolIcon}>Aa</Animated.Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => setSelectedTool("sticker")}
                        activeOpacity={0.8}
                    >
                        <Animated.Text style={styles.toolIcon}>🌄</Animated.Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => setSelectedTool("draw")}
                        activeOpacity={0.8}
                    >
                        <Animated.Text style={styles.toolIcon}>✎</Animated.Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => setSelectedTool("filter")}
                        activeOpacity={0.8}
                    >
                        <Animated.Text style={styles.toolIcon}>FX</Animated.Text>
                    </TouchableOpacity>
                </LinearGradient>}


            {selectedTool === "text" && (
                <View style={styles.overlayContainer}>
                    <View style={styles.colorPaletteContainer}>
                        {colorPalette.map((color, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    color === textColor && styles.colorOptionSelected,
                                ]}
                                onPress={() => setTextColor(color)}
                            />
                        ))}
                    </View>
                    <View style={styles.textInputOverlay}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Type your text..."
                            placeholderTextColor="#555"
                            value={draftText}
                            onChangeText={setDraftText}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addText}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}


            {selectedTool === "sticker" && (
                <ScrollView
                    horizontal
                    style={styles.stickerOverlay}
                    contentContainerStyle={styles.stickerContent}
                >
                    {stickers.map((sticker, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.stickerItem}
                            onPress={() => {
                                setTexts((prev) => [
                                    ...prev,
                                    {
                                        content: sticker,
                                        color: "#FFFFFF",
                                        position: new Animated.ValueXY({
                                            x: width / 2 - 25,
                                            y: height / 2 - 25,
                                        }),
                                        scale: new Animated.Value(1),
                                        opacity: new Animated.Value(1),
                                    },
                                ]);
                                setSelectedTool(null);
                            }}
                        >
                            <Text style={styles.stickerText}>{sticker}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}


            {selectedTool === "draw" && (
                <View style={[styles.overlayContainer, { justifyContent: "flex-end" }]}>
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.colorPaletteScroll}
                        style={styles.colorPaletteOverlay}
                    >
                        {colorPalette.map((color, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    color === drawColor && styles.colorOptionSelected,
                                ]}
                                onPress={() => setDrawColor(color)}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}


            {selectedTool === "filter" && (
                <ScrollView
                    horizontal
                    style={styles.filterOverlay}
                    contentContainerStyle={styles.filterContent}
                >
                    {filters.map((filter, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.filterItem}
                            onPress={() => {
                                setActiveFilter(filter);
                                setSelectedTool(null);
                            }}
                        >
                            <Animated.View style={[styles.filterPreview, filter.style]}>
                                {media.type.startsWith("video") ? (
                                    <Text style={styles.filterTextPreview}>Vid</Text>
                                ) : (
                                    <Image
                                        source={{ uri: media.uri }}
                                        style={styles.filterImagePreview}
                                        resizeMode="cover"
                                    />
                                )}
                            </Animated.View>
                            <Text style={styles.filterLabel}>{filter.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    mediaContainer: {
        position: "absolute",
        width,
        height,
    },
    media: {
        width,
        height,
    },
    drawingContainer: {
        position: "absolute",
        width,
        height,
        zIndex: 2,
    },
    path: {},
    drawPoint: {
        position: "absolute",
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    textContainer: {
        position: "absolute",
        padding: 5,
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
        textShadowColor: "rgba(0,0,0,0.7)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    topBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 5,
    },
    topButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    topButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 5,
    },
    toolButton: {
        backgroundColor: "rgba(255,255,255,0.15)",
        padding: 15,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
    toolIcon: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "600",
    },
    overlayContainer: {
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        zIndex: 6,
        alignItems: "center",
    },
    textInputOverlay: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 10,
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    addButton: {
        backgroundColor: "#3897f0",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginLeft: 10,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    stickerOverlay: {
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        paddingVertical: 12,
        zIndex: 6,
    },
    stickerContent: {
        paddingHorizontal: 10,
        alignItems: "center",
    },
    stickerItem: {
        marginHorizontal: 10,
    },
    stickerText: {
        fontSize: 40,
    },
    filterOverlay: {
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        paddingVertical: 12,
        zIndex: 6,
    },
    filterContent: {
        paddingHorizontal: 10,
        alignItems: "center",
    },
    filterItem: {
        marginHorizontal: 10,
        alignItems: "center",
    },
    filterPreview: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    filterTextPreview: {
        color: "#fff",
        fontWeight: "bold",
    },
    filterImagePreview: {
        width: 50,
        height: 50,
    },
    filterLabel: {
        color: "#fff",
        fontSize: 13,
        marginTop: 5,
    },
    colorPaletteContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: 8,
        borderRadius: 25,
        marginBottom: 8,
    },
    colorPaletteScroll: {
        paddingHorizontal: 10,
        alignItems: "center",
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorOptionSelected: {
        borderColor: "#fff",
    },
});
