import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axiosInstance from "../api/axios";

export default function StaffCard({ name, date, refresh }) {
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [modifyVisible, setModifyVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [enterDay, setEnterDay] = useState(date); //2025-01-01 형식
    const [enterDayKO, setEnterDayKO] = useState(""); //2025년 1월 1일 형식
    const [enterDayISO, setEnterDayISO] = useState(new Date()); //ISO형식

    useEffect(() => {
        const [year, month, day] = date.split("-");
        setEnterDayISO(new Date(year, month - 1, day));
        setEnterDayKO(`${year}년 ${month}월 ${day}일`);
    }, []);

    const transformDate = (date) => {
        const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        setEnterDay(date.toISOString().split("T")[0]);
        setEnterDayKO(`${year}년 ${month}월 ${day}일`);
    };

    const toggleConfirm = () => {
        setDeleteVisible(!deleteVisible);
    };

    const toggleModify = () => {
        setModifyVisible(!modifyVisible);
    };

    const handleDelete = async () => {
        //강제 랜더링
        const url = `${name}/deactivate`;
        await axiosInstance.put(url);
        refresh((prevRefresh) => prevRefresh + 1);
        toggleConfirm();
    };

    const toggleDatePicker = () => {
        setDatePickerVisible(!isDatePickerVisible);
    };

    const handleDateConfirm = (date) => {
        transformDate(date);
        toggleDatePicker();
    };

    const renderDateModal = () => {
        return (
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={toggleDatePicker}
                date={enterDayISO}
            />
        );
    };

    const modifyConfirm = async () => {
        toggleModify();
        console.log(enterDay);
        const postData = {
            name: name,
            date: enterDay,
        };

        const url = "/modification/enterDate";
        await axiosInstance.put(url, postData);
        refresh((prevRefresh) => prevRefresh + 1);
    };

    const renderModify = () => {
        return (
            <Modal isVisible={modifyVisible} onBackdropPress={toggleModify}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{name} 정보 수정</Text>

                    <TouchableOpacity style={styles.dateInput} onPress={toggleDatePicker}>
                        <Text style={styles.dateText}>{enterDayKO}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={modifyConfirm}>
                        <Text style={styles.modalButtonText}>변경하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={toggleModify}>
                        <Text style={styles.modalButtonText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.staffCard}>
            {renderModify()}
            {renderDateModal()}
            <TouchableOpacity style={styles.cardInfoContainer} onPress={toggleModify}>
                <Icon name="person-circle-outline" size={40} color="black" />
                <View style={styles.staffDetails}>
                    <Text style={styles.staffName}>{name}</Text>
                    <Text style={styles.staffDate}>{date}</Text>
                </View>
            </TouchableOpacity>

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
