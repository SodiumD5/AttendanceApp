import Modal from "react-native-modal";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Colors from "./Colors";
import RectangleButton from "./RectangleButton";

const AlertModal = ({
    isVisible,
    setIsVisible,
    title,
    bgColor = Colors.primary_red,
    onClose = () => {},
    meg = ""
}) => {
    const close = () => {
        setIsVisible(!isVisible);
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => {
                close();
                onClose();
            }}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{title}</Text>
                {meg ? <Text style={styles.message}>{meg}</Text> : null}
                <RectangleButton
                    message="확인"
                    onPress={() => {
                        close();
                        onClose();
                    }}
                    buttonColor="red"
                    buttontype="modal"
                />
            </View>
        </Modal>
    );
};
export default AlertModal;

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    message: {
        fontSize: 16
    }
});
