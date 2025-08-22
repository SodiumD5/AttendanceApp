import { FlatList, Pressable, View, StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";
import Colors from "./Colors";

const PickerModal = ({ data, select, setSelect, isVisible, setIsVisible, keyExtractor, renderText }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsVisible(false)}
            style={styles.Modal}>
            <View style={styles.pickerModal}>
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.pickerItem, item === select && styles.pickerItemActive]}
                            onPress={() => {
                                setSelect(renderText(item));
                                setIsVisible(false);
                            }}>
                            <Text style={styles.pickerItemText}>{renderText(item)}</Text>
                        </Pressable>
                    )}
                    bounces={false}
                />
            </View>
        </Modal>
    );
};
export default PickerModal;

const styles = StyleSheet.create({
    Modal: {
        justifyContent: "center",
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    pickerModal: {
        backgroundColor: Colors.primary_white,
        borderRadius: 20,
        maxHeight: "50%",
        width: "80%",
        overflow: "hidden",
    },
    pickerItem: {
        padding: 15,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary_gray,
    },
    pickerItemText: {
        fontSize: 18,
    },
    pickerItemActive: {
        backgroundColor: Colors.primary_gray,
    },
});
