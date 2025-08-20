import Modal from "react-native-modal";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Colors from "./Colors";

const AlertModal = ({ isVisible, setIsVisible, title, bgColor }) => {
    const close = () => {
        setIsVisible(!isVisible);
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={close}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity
                    style={{
                        ...styles.modalButton,
                        backgroundColor: bgColor,
                    }}
                    onPress={close}>
                    <Text style={styles.modalButtonText}>확인</Text>
                </TouchableOpacity>
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
    modalButton: {
        width: "100%",
        backgroundColor: Colors.primary_blue,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
