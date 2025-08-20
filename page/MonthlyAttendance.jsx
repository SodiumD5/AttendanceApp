import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import Modal from "react-native-modal";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import AlertModal from "../components/AlertModal";
import axiosInstance from "../api/axios";
import useTokenStore from "../store/tokenStore";

const MonthlyAttendance = ({ navigation }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedUser, setSelectedUser] = useState("직원 선택");
    const [searchResult, setSearchResult] = useState([]);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showUserPicker, setShowUserPicker] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [titleMessage, setTitleMessage] = useState("검색조건을 설정해주세요");
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [userlist, setUserList] = useState([]);

    const years = Array.from({ length: 76 }, (_, i) => 2025 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

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
                    navigation.replace("Login");
                }}
            />
        );
    };

    useEffect(() => {
        const getUserData = async () => {
            const response = await fetch("http://10.0.2.2:8000/staff/active");
            const users = await response.json();
            setUserList(users);
        };

        getUserData();
    }, []);

    const handleSearch = async () => {
        setTitleMessage(`${selectedYear}년 ${selectedMonth}월 ${selectedUser} 출근부`);

        const response = await axiosInstance.get(
            //axiosInstance의 baseurl에 이미 설정 되있어서 앞 날려도 됨.
            `/attendance/?name=${selectedUser}&year=${selectedYear}&month=${selectedMonth}`
        );
        setSearchResult(response.data);
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>날짜</Text>
            <Text style={styles.headerText}>출근 시각</Text>
            <Text style={styles.headerText}>퇴근 시각</Text>
            <Text style={styles.headerText}>연차/반차</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            {/* 데이터 구조가 명확하지 않아 임시로 설정함 */}
            <Text style={styles.rowText}>{item.day || ""}</Text>
            <Text style={styles.rowText}>{item.work_time || ""}</Text>
            <Text style={styles.rowText}>{item.leave_time || ""}</Text>
            <Text style={styles.rowText}>{item.rest || ""}</Text>
        </View>
    );

    const renderYearPicker = () => (
        <Modal
            isVisible={showYearPicker}
            onBackdropPress={() => setShowYearPicker(false)}
            onSwipeComplete={() => setShowYearPicker(false)}
            swipeDirection={["down"]}
            style={styles.bottomModal}>
            <View style={styles.pickerModal}>
                <FlatList
                    data={years}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.pickerItem,
                                item === selectedYear && styles.pickerItemActive,
                            ]}
                            onPress={() => {
                                setSelectedYear(item);
                                setShowYearPicker(false);
                            }}>
                            <Text style={styles.pickerItemText}>{item}</Text>
                        </Pressable>
                    )}
                    bounces={false}
                />
            </View>
        </Modal>
    );

    const renderMonthPicker = () => (
        <Modal
            isVisible={showMonthPicker}
            onBackdropPress={() => setShowMonthPicker(false)}
            onSwipeComplete={() => setShowMonthPicker(false)}
            swipeDirection={["down"]}
            style={styles.bottomModal}>
            <View style={styles.pickerModal}>
                <FlatList
                    data={months}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.pickerItem,
                                item === selectedMonth && styles.pickerItemActive,
                            ]}
                            onPress={() => {
                                setSelectedMonth(item);
                                setShowMonthPicker(false);
                            }}>
                            <Text style={styles.pickerItemText}>{item}</Text>
                        </Pressable>
                    )}
                    bounces={false}
                />
            </View>
        </Modal>
    );

    const renderUserPicker = () => (
        <Modal
            isVisible={showUserPicker}
            onBackdropPress={() => setShowUserPicker(false)}
            onSwipeComplete={() => setShowUserPicker(false)}
            swipeDirection={["down"]}
            style={styles.bottomModal}>
            <View style={styles.pickerModal}>
                <FlatList
                    data={userlist}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.pickerItem,
                                item.name === selectedUser && styles.pickerItemActive,
                            ]}
                            onPress={() => {
                                setSelectedUser(item.name);
                                setShowUserPicker(false);
                            }}>
                            <Text style={styles.pickerItemText}>{item.name}</Text>
                        </Pressable>
                    )}
                    bounces={false}
                />
            </View>
        </Modal>
    );

    const renderSearchModal = () => (
        <Modal
            isVisible={showSearchModal}
            onBackdropPress={() => setShowSearchModal(false)}
            onSwipeComplete={() => setShowSearchModal(false)}
            swipeDirection={["down"]}
            style={styles.bottomModal}>
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
                    <Pressable style={styles.pickerButton} onPress={() => setShowUserPicker(true)}>
                        <Text style={styles.pickerText}>{selectedUser}</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                </View>
                <Pressable
                    style={styles.searchButton}
                    onPress={() => {
                        if (selectedUser === "직원 선택") {
                            setShowSearchModal(false);
                            setShowAlertModal(true);
                        } else {
                            handleSearch();
                            setShowSearchModal(false);
                        }
                    }}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </Pressable>
                <Pressable style={styles.closeButton} onPress={() => setShowSearchModal(false)}>
                    <Text style={styles.textStyle}>닫기</Text>
                </Pressable>
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
            {renderUserPicker()}
            {showAlertModal && renderAlert()}
            {viewSessionExpiration()}
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
        paddingVertical: 10,
        paddingHorizontal: 15,
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
    searchButton: {
        backgroundColor: Colors.primary_blue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        marginTop: 5,
        backgroundColor: Colors.primary_gray,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    searchButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
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
    bottomModal: {
        justifyContent: "flex-end",
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});
