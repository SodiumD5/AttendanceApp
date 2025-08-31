import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "../components/Colors";

import AdminHeader from "../layout/AdminHeader";
import StaffCard from "../components/StaffCard";
import AlertModal from "../components/AlertModal";
import useTokenStore from "../store/tokenStore";
import axiosInstance from "../api/axios";
import RectangleButton from "../components/RectangleButton";
import useUrlStore from "../store/urlStore";

const BaseUrl = useUrlStore.getState().BaseUrl;

const Manage = ({ navigation }) => {
    const [staffInfo, setStaffInfo] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [registerDay, setRegisterDay] = useState(new Date());
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [refresh, setRefresh] = useState(0);

    //토큰 만료될 시 로그인 화면으로 튕김
    const [sessionExpiration, setSessionExpiration] = useState(false);
    const { token } = useTokenStore();
    useEffect(() => {
        if (!token) {
            setSessionExpiration(true);
        }
    }, [token]);
    const viewSessionExpiration = () => {
        return (
            <AlertModal
                isVisible={sessionExpiration}
                setIsVisible={setSessionExpiration}
                title={"세션이 만료되어 로그아웃 됩니다."}
                bgColor={Colors.primary_red}
                onClose={() => {
                    navigation.reset({
                        index: 1,
                        routes: [{ name: "StartPage" }, { name: "Login" }],
                    });
                }}
            />
        );
    };

    useEffect(() => {
        const getStaffList = async () => {
            try {
                const response = await fetch(`${BaseUrl}/staff/active`);
                const info = await response.json();
                setStaffInfo(info);
            } catch (e) {
                console.log("failed to get staff list : ", e);
            }
        };

        getStaffList();
    }, [refresh]);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const toggleConfirm = () => {
        setIsConfirmVisible(!isConfirmVisible);
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateConfirm = (date) => {
        setRegisterDay(date);
        hideDatePicker();
    };

    const [isNoNameAlert, setNoNameAlert] = useState(false);
    const wrong_name = () => {
        return (
            <AlertModal
                isVisible={isNoNameAlert}
                setIsVisible={setNoNameAlert}
                title="이름을 입력해주세요"
                bgColor={Colors.primary_red}
            />
        );
    };

    const handleAddStaff = async () => {
        if (newStaffName.trim() === "") {
            setNoNameAlert(true);
            return;
        }

        var enterDay = registerDay.toISOString().split("T")[0];

        const postData = { staff_name: newStaffName, enroll_date: enterDay };
        const url = "/manager/enrollment";
        const response = await axiosInstance.post(url, postData);
        setConfirmMessage(response.data);

        toggleModal();
        toggleConfirm();
        setNewStaffName("");
        setRegisterDay(new Date());
        setRefresh((prevRefresh) => prevRefresh + 1);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderAlert = () => {
        let bgColor;
        if (confirmMessage === "이미 존재하는 이름입니다.") {
            bgColor = Colors.primary_red;
        } else {
            bgColor = Colors.primary_purple;
        }
        return (
            <AlertModal
                isVisible={isConfirmVisible}
                setIsVisible={setIsConfirmVisible}
                title={confirmMessage}
                bgColor={bgColor}></AlertModal>
        );
    };

    const renderAddStaff = () => {
        return (
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>교직원 추가</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="이름을 입력하세요"
                        value={newStaffName}
                        onChangeText={setNewStaffName}
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline={false}
                        keyboardType="default"
                    />
                    <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
                        <Text style={styles.dateText}>{formatDate(registerDay)}</Text>
                    </TouchableOpacity>

                    <RectangleButton
                        message="추가하기"
                        onPress={handleAddStaff}
                        buttontype="modal"></RectangleButton>
                    <RectangleButton
                        message="취소"
                        onPress={toggleModal}
                        buttonColor="white"
                        buttontype="modal"></RectangleButton>
                </View>
            </Modal>
        );
    };

    const renderDateModal = () => {
        return (
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
            />
        );
    };

    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="교직원 관리"></AdminHeader>

            <View style={{ marginTop: 20, flex: 1, alignItems: "center" }}>
                <FlatList
                    data={staffInfo}
                    numColumns={1}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <StaffCard name={item.name} date={item.registerDay} refresh={setRefresh} />
                    )}
                    bounces={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>

            <RectangleButton message="교직원 추가" onPress={toggleModal}></RectangleButton>

            {renderAlert()}
            {viewSessionExpiration()}
            {renderAddStaff()}
            {renderDateModal()}
            {wrong_name()}
        </View>
    );
};

export default Manage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingBottom: 80,
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
});
