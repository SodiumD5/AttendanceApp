import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RectangleButton from "./RectangleButton";
import { supabase } from "../lib/supabase";

export default function StaffCard({ name, date, refresh }) {
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [modifyVisible, setModifyVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    
    // 상태를 Date 객체 하나로 통합
    const [selectedDate, setSelectedDate] = useState(new Date(date));

    // 화면 표시용 (한국어 형식)
    const getFormattedDateKO = (dateObj) => {
        return `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
    };

    // DB 전송용 (YYYY-MM-DD 형식)
    const getISODateString = (dateObj) => {
        const offset = dateObj.getTimezoneOffset() * 60000;
        const localDate = new Date(dateObj.getTime() - offset);
        return localDate.toISOString().split("T")[0];
    };

    const toggleConfirm = () => setDeleteVisible(!deleteVisible);
    const toggleModify = () => setModifyVisible(!modifyVisible);
    const toggleDatePicker = () => setDatePickerVisible(!isDatePickerVisible);

    const handleDateConfirm = (date) => {
        setSelectedDate(date);
        toggleDatePicker();
    };

    const handleDelete = async () => {
        const { error } = await supabase.rpc("deactivate_employee", {
            p_name: name,
        });

        if (error) {
            Alert.alert("오류", error.message);
        } else {
            refresh((prev) => prev + 1);
            toggleConfirm();
        }
    };

    const modifyConfirm = async () => {
        const { error } = await supabase.rpc("update_employee_register_day", {
            p_name: name,
            p_date: getISODateString(selectedDate),
        });

        if (error) {
            Alert.alert("오류", error.message);
        } else {
            refresh((prev) => prev + 1);
            toggleModify();
        }
    };

    return (
        <View style={styles.staffCard}>
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

            {/* 수정 모달 */}
            <Modal isVisible={modifyVisible} onBackdropPress={toggleModify}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{name} 정보 수정</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={toggleDatePicker}>
                        <Text style={styles.dateText}>{getFormattedDateKO(selectedDate)}</Text>
                    </TouchableOpacity>
                    <RectangleButton message="변경하기" onPress={modifyConfirm} buttontype="modal" />
                    <RectangleButton message="취소" onPress={toggleModify} buttonColor="white" buttontype="modal" />
                </View>
            </Modal>

            {/* 날짜 선택기 */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={toggleDatePicker}
                date={selectedDate}
            />

            {/* 삭제 확인 모달 */}
            <Modal isVisible={deleteVisible} onBackdropPress={toggleConfirm}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>정말 삭제하시겠습니까?</Text>
                    <Text style={styles.modalDesc}>해당 기능은 숨기기 기능입니다. 다시 추가하면 해제됩니다.</Text>
                    <RectangleButton message="확인" onPress={handleDelete} buttontype="modal" />
                    <RectangleButton message="취소" onPress={toggleConfirm} buttonColor="white" buttontype="modal" />
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
        margin: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalDesc: {
        textAlign: 'center',
        marginBottom: 20,
        color: 'gray'
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
});