import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput } from "react-native";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import StaffCard from "../components/StaffCard";
import AlertModal from "../components/AlertModal";
import RectangleButton from "../components/RectangleButton";
import { supabase } from "../lib/supabase";

const Manage = ({ navigation }) => {
    const [staffInfo, setStaffInfo] = useState([]);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [newStaffName, setNewStaffName] = useState("");
    const [registerDay, setRegisterDay] = useState(new Date());
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState({ success: false, message: "" });
    const [refresh, setRefresh] = useState(0);
    const [isNoNameAlert, setNoNameAlert] = useState(false);

    // 날짜 포맷팅 함수들
    const formatDateKO = (date) => {
        return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
    };

    const formatISODate = (date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split("T")[0];
    };

    useEffect(() => {
        const getStaffList = async () => {
            try {
                const { data, error } = await supabase.rpc("get_active_employee_list");
                if (error) throw error;
                setStaffInfo(data);
            } catch (e) {
                console.log("failed to get employee list : ", e);
            }
        };
        getStaffList();
    }, [refresh]);

    const toggleAddStaffModal = () => {
        if (!addModalVisible) {
            setNewStaffName("");
            setRegisterDay(new Date());
        }
        setAddModalVisible(!addModalVisible);
    };

    const handleAddStaff = async () => {
        if (newStaffName.trim() === "") {
            setNoNameAlert(true);
            return;
        }

        const { data, error } = await supabase.rpc("register_employee", {
            p_name: newStaffName,
            p_register_day: formatISODate(registerDay),
        });

        if (error) {
            console.log(`register error : ${error.message}`);
            return;
        }

        setIsSuccess(data[0]);
        toggleAddStaffModal();
        setIsConfirmVisible(true);
        setRefresh((prev) => prev + 1);
    };

    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="교직원 관리" />

            <View style={styles.listContainer}>
                <FlatList
                    data={staffInfo}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <StaffCard name={item.name} date={item.register_day} refresh={setRefresh} />
                    )}
                    contentContainerStyle={styles.listContent}
                    bounces={false}
                />
            </View>

            <RectangleButton message="교직원 추가" onPress={toggleAddStaffModal} />

            {/* 교직원 추가 모달 */}
            <Modal isVisible={addModalVisible} onBackdropPress={toggleAddStaffModal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>교직원 추가</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="이름을 입력하세요"
                        value={newStaffName}
                        onChangeText={setNewStaffName}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity style={styles.dateInput} onPress={() => setDatePickerVisible(true)}>
                        <Text style={styles.dateText}>{formatDateKO(registerDay)}</Text>
                    </TouchableOpacity>

                    <RectangleButton message="추가하기" onPress={handleAddStaff} buttontype="modal" />
                    <RectangleButton
                        message="취소"
                        onPress={toggleAddStaffModal}
                        buttonColor="white"
                        buttontype="modal"
                    />
                </View>
            </Modal>

            {/* 날짜 선택기 */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                    setRegisterDay(date);
                    setDatePickerVisible(false);
                }}
                onCancel={() => setDatePickerVisible(false)}
                date={registerDay}
            />

            {/* 결과 알림 모달 */}
            <AlertModal
                isVisible={isConfirmVisible}
                setIsVisible={setIsConfirmVisible}
                title={isSuccess.message}
                bgColor={isSuccess.success ? Colors.primary_purple : Colors.primary_red}
            />

            {/* 이름 미입력 알림 */}
            <AlertModal
                isVisible={isNoNameAlert}
                setIsVisible={setNoNameAlert}
                title="이름을 입력해주세요"
                bgColor={Colors.primary_red}
            />
        </View>
    );
};

export default Manage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContainer: {
        marginTop: 20,
        flex: 1,
        alignItems: "center",
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
