import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import AlertModal from "../components/AlertModal";
import axiosInstance from "../api/axios";
import useTokenStore from "../store/tokenStore";
import RectangleButton from "../components/RectangleButton";
import PickerModal from "../components/PickerModal";

const MonthlyAttendance = ({ navigation }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedStaff, setSelectedStaff] = useState("직원 선택");
    const [stafflist, setStaffList] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showStaffPicker, setShowStaffPicker] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [titleMessage, setTitleMessage] = useState("검색조건을 설정해주세요");
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const [modifyData, setModifyData] = useState({});

    const years = Array.from({ length: 76 }, (_, i) => 2025 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

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
                    navigation.replace("Login");
                }}
            />
        );
    };

    useEffect(() => {
        const getStaffData = async () => {
            const response = await fetch("http://10.0.2.2:8000/staff/active");
            const staff = await response.json();
            setStaffList(staff);
        };

        getStaffData();
    }, []);

    const handleSearch = async () => {
        setTitleMessage(`${selectedYear}년 ${selectedMonth}월 ${selectedStaff} 출근부`);

        const response = await axiosInstance.get(
            `/attendance/?name=${selectedStaff}&year=${selectedYear}&month=${selectedMonth}`
        );
        setSearchResult(response.data);
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>날짜</Text>
            <Text style={styles.headerText}>출근 시각</Text>
            <Text style={styles.headerText}>퇴근 시각</Text>
            <Text style={styles.headerText}>휴가</Text>
        </View>
    );

    const restText = (rest) => {
        if (rest === "half") {
            return "반차";
        } else if (rest === "full") {
            return "연차";
        } else {
            return "출근";
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                toggleModifyModal({ item });
            }}>
            <View style={styles.tableRow}>
                <Text style={styles.rowText}>{item.day}</Text>
                <Text style={styles.rowText}>{item.work_time || "X"}</Text>
                <Text style={styles.rowText}>{item.leave_time || "X"}</Text>
                <Text style={styles.rowText}>{restText(item.rest)}</Text>
            </View>
        </TouchableOpacity>
    );

    const [workTimeModalVisible, setWorkTimeModalVisible] = useState(false);
    const [leaveTimeModalVisible, setLeaveTimeModalVisible] = useState(false);
    const [restModalVisible, setRestModalVisible] = useState(false);
    const [selectedRest, setSelectedRest] = useState();
    const toggleModifyModal = ({ item }) => {
        setSelectedItem(item);
        setShowModifyModal(!showModifyModal);
    };
    const submitModifyData = async () => {
        const url = "/modification/attendence";
        await axiosInstance.put(url, modifyData);

        toggleModifyModal();
    };
    useEffect(() => {
        if (selectedItem) {
            //기본값 설정
            setSelectedRest(restText(selectedItem.rest));
            
            const [day_int, trash] = selectedItem.day.split("일");
            setModifyData({
                name: selectedStaff,
                year: parseInt(selectedYear),
                month: parseInt(selectedMonth),
                day: parseInt(day_int),
                work_time: "",
                leave_time: "",
            });
        }
    }, [selectedItem]);
    const TimeComponent = ({ guideText, infoText, onPress }) => {
        return (
            <TouchableOpacity style={styles.ModifyModalTimeContainer} onPress={onPress}>
                <Text style={styles.ModifyModalTimeText}>{guideText}</Text>
                <Text style={styles.ModifyModalTimeText}>{infoText}</Text>
            </TouchableOpacity>
        );
    };
    const renderWorkTimeModal = () => {};
    const renderLeaveTimeModal = () => {};
    const renderRestModal = () => {
        const RestData = ["출근", "반차", "연차"];
        return (
            <PickerModal
                data={RestData}
                select={selectedRest}
                setSelect={setSelectedRest}
                isVisible={restModalVisible}
                setIsVisible={setRestModalVisible}
                keyExtractor={(item) => item.toString()}
                renderText={(item) => item.toString()}
            />
        );
    };
    const toggleRestModal = () => {
        setRestModalVisible(!restModalVisible);
    };

    const ModifyModal = () => {
        if (!selectedItem) {
            return null;
        }

        const title = `${selectedItem.day} 출근부 수정`;
        let work_text;
        let leave_text;
        if (selectedItem.work_time) {
            const [work_hour, work_minute] = selectedItem.work_time.split(":");
            work_text = `${work_hour}시 ${work_minute}분`;
        } else {
            work_text = "X";
        }
        if (selectedItem.leave_time) {
            const [leave_hour, leave_minute] = selectedItem.leave_time.split(":");
            leave_text = `${leave_hour}시 ${leave_minute}분`;
        } else {
            leave_text = "X";
        }

        return (
            <Modal isVisible={showModifyModal} onBackdropPress={toggleModifyModal}>
                <View style={styles.ModifyModalContainer}>
                    <Text style={styles.ModifyModalTitle}>{title}</Text>

                    <TimeComponent guideText="출근 시각 : " infoText={work_text}></TimeComponent>
                    <TimeComponent guideText="퇴근 시각 : " infoText={leave_text}></TimeComponent>
                    <TimeComponent
                        guideText="휴가 : "
                        infoText={selectedRest}
                        onPress={toggleRestModal}></TimeComponent>

                    <RectangleButton
                        message="변경하기"
                        onPress={submitModifyData}
                        buttontype="modal"></RectangleButton>
                    <RectangleButton
                        message="취소"
                        onPress={() => {
                            toggleModifyModal({ item: null });
                        }}
                        buttonColor="white"
                        buttontype="modal"></RectangleButton>
                </View>
            </Modal>
        );
    };

    const renderYearPicker = () => (
        <PickerModal
            data={years}
            select={selectedYear}
            setSelect={setSelectedYear}
            isVisible={showYearPicker}
            setIsVisible={setShowYearPicker}
            keyExtractor={(item) => item.toString()}
            renderText={(item) => item.toString()}
        />
    );

    const renderMonthPicker = () => (
        <PickerModal
            data={months}
            select={selectedMonth}
            setSelect={setSelectedMonth}
            isVisible={showMonthPicker}
            setIsVisible={setShowMonthPicker}
            keyExtractor={(item) => item.toString()}
            renderText={(item) => item.toString()}
        />
    );

    const renderStaffPicker = () => (
        <PickerModal
            data={stafflist}
            select={selectedStaff}
            setSelect={setSelectedStaff}
            isVisible={showStaffPicker}
            setIsVisible={setShowStaffPicker}
            keyExtractor={(item) => item.id.toString()}
            renderText={(item) => item.name}
        />
    );

    const renderSearchModal = () => (
        <Modal
            isVisible={showSearchModal}
            onBackdropPress={() => setShowSearchModal(false)}
            style={styles.searchModal}>
            <View style={styles.modalView}>
                <View style={styles.filterRow}>
                    <Pressable style={styles.pickerButton} onPress={() => setShowYearPicker(true)}>
                        <Text style={styles.pickerText}>{selectedYear} 년</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                    <Pressable style={styles.pickerButton} onPress={() => setShowMonthPicker(true)}>
                        <Text style={styles.pickerText}>{selectedMonth} 월</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                </View>
                <View style={styles.filterRow}>
                    <Pressable style={styles.pickerButton} onPress={() => setShowStaffPicker(true)}>
                        <Text style={styles.pickerText}>{selectedStaff}</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                </View>

                <RectangleButton
                    message="검색"
                    onPress={() => {
                        if (selectedStaff === "직원 선택") {
                            setShowSearchModal(false);
                            setShowAlertModal(true);
                        } else {
                            handleSearch();
                            setShowSearchModal(false);
                        }
                    }}
                    buttonColor="blue"
                    buttontype="modal"></RectangleButton>
                <RectangleButton
                    message="취소"
                    onPress={() => {
                        setShowSearchModal(false);
                    }}
                    buttonColor="white"
                    buttontype="modal"></RectangleButton>
            </View>
        </Modal>
    );

    const renderAlert = () => {
        let bgColor = Colors.primary_red;
        return (
            <AlertModal
                isVisible={showAlertModal}
                setIsVisible={setShowAlertModal}
                title="직원을 선택해주세요"
                bgColor={bgColor}
            />
        );
    };

    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="월간 출근부"></AdminHeader>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{titleMessage}</Text>
            </View>

            <Pressable style={styles.openSearchButton} onPress={() => setShowSearchModal(true)}>
                <Text style={styles.openSearchButtonText}>검색 조건 설정</Text>
            </Pressable>

            <FlatList
                data={searchResult}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyHeader}>검색 결과가 없습니다.</Text>
                        <Text style={styles.emptyText}>
                            선택한 날짜와 직원을 다시 확인해주세요.
                        </Text>
                    </View>
                )}
                style={styles.listContainer}
            />

            {renderSearchModal()}
            {renderYearPicker()}
            {renderMonthPicker()}
            {renderStaffPicker()}
            {showAlertModal && renderAlert()}
            {viewSessionExpiration()}
            {ModifyModal()}

            {renderRestModal()}
        </View>
    );
};
export default MonthlyAttendance;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    titleContainer: { marginTop: 10 },
    titleText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 10,
    },
    pickerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: Colors.primary_gray,
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    pickerText: {
        fontSize: 16,
        color: Colors.text_gray,
        marginRight: 5,
    },
    arrowIcon: {
        fontSize: 14,
        color: Colors.text_gray,
    },
    listContainer: {
        flex: 1,
        width: "100%",
        padding: 10,
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.primary_gray,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
    },
    headerText: {
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        color: Colors.text_gray,
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.primary_white,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary_gray,
    },
    rowText: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        color: Colors.text_gray,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    emptyHeader: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text_gray,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.text_gray,
    },
    searchModal: {
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
    },
    pickerModal: {
        backgroundColor: Colors.primary_white,
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        maxHeight: "50%",
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
    modalView: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    openSearchButton: {
        backgroundColor: Colors.primary_blue,
        padding: 15,
        margin: 20,
        marginBottom: 0,
        borderRadius: 10,
        alignItems: "center",
    },
    openSearchButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    ModifyModalContainer: {
        backgroundColor: "white",
        padding: 20,
        paddingHorizontal: 30,
        marginHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    ModifyModalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    ModifyModalTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    ModifyModalTimeText: {
        fontSize: 16,
    },
});
