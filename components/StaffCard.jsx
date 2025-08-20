import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import axiosInstance from "../api/axios";

export default function StaffCard({ name, date, refresh }) {
    const [deleteVisible, setDeleteVisible] = useState(false);

    const toggleConfirm = () => {
        setDeleteVisible(!deleteVisible);
    };

    const handleDelete = async () => {
        const url = `${name}/deactivate`;
        await axiosInstance.put(url);
        refresh((prevRefresh) => prevRefresh + 1);
        toggleConfirm();
    };

    return (
        <View style={styles.staffCard}>
            <View style={styles.cardInfoContainer}>
                <Icon name="person-circle-outline" size={40} color="black" />
                <View style={styles.staffDetails}>
                    <Text style={styles.staffName}>{name}</Text>
                    <Text style={styles.staffDate}>{date}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={toggleConfirm}>
                <View style={styles.deleteContainer}>
                    <Icon name="trash-outline" size={24} color="black" />
                    <Text style={styles.deleteText}>삭제</Text>
                </View>
            </TouchableOpacity>

            <Modal isVisible={deleteVisible} onBackdropPress={toggleConfirm}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>정말 삭제하시겠습니까?</Text>
                    <Text>
                        해당 기능은, 숨기기 기능입니다. 숨기기를 해제하고 싶다면, 같은 이름을 다시
                        추가해 보세요!
                    </Text>
                    <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                        <Text style={styles.modalButtonText}>확인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={toggleConfirm}>
                        <Text style={styles.modalButtonText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    staffCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        margin: 12,
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: 350,
        height: 100,
    },
    cardInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    staffDetails: {
        marginLeft: 15,
    },
    staffName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    staffDate: {
        fontSize: 14,
        color: "gray",
        marginTop: 5,
    },
    deleteContainer: {
        alignItems: "center",
    },
    deleteText: {
        fontSize: 12,
        color: "black",
        marginTop: 3,
    },
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
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    dateInput: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: "center",
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 16,
        color: "#000",
    },
    modalButton: {
        width: "100%",
        backgroundColor: "#596DE9",
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
    cancelButton: {
        backgroundColor: "#D3D3D3",
    },
});
