import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import Modal from "react-native-modal";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import useTokenStore from "../store/tokenStore";
import AlertModal from "../components/AlertModal";
import axiosInstance from "../api/axios";

const AnnualLedger = ({ navigation }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStaff, setSelectedStaff] = useState("직원 선택");
    const [stafflist, setStaffList] = useState([]);
    const [restData, setRestData] = useState([]);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showStaffPicker, setShowStaffPicker] = useState(false);

    const years = Array.from({ length: 76 }, (_, i) => 2025 + i);

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
        const getStaffData = async () => {
            const response = await fetch("http://10.0.2.2:8000/staff/active");
            const staff = await response.json();
            setStaffList(staff);
        };

        getStaffData();
    }, []);

    const handleSearch = async () => {
        const url = `/rest/${selectedStaff}/${selectedYear}`;
        const response = await axiosInstance.get(url);
        setRestData(response.data);
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>사용횟수</Text>
            <Text style={styles.headerText}>날짜</Text>
            <Text style={styles.headerText}>사용 시각</Text>
        </View>
    );

    //휴가 횟수 카운트 하기
    const renderItem = ({ item }) => {
        return (
            <View style={styles.tableRow}>
                <Text style={styles.rowText}>{item.count}</Text>
                <Text style={styles.rowText}>{item.date}</Text>
                <Text style={styles.rowText}>{item.time}</Text>
            </View>
        );
    };

    const renderYearPicker = () => (
        <Modal
            isVisible={showYearPicker}
            onBackdropPress={() => setShowYearPicker(false)}
            style={styles.Modal}>
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

    const renderStaffPicker = () => (
        <Modal
            isVisible={showStaffPicker}
            onBackdropPress={() => setShowStaffPicker(false)}
            style={styles.Modal}>
            <View style={styles.pickerModal}>
                <FlatList
                    data={stafflist}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.pickerItem,
                                item === selectedStaff && styles.pickerItemActive,
                            ]}
                            onPress={() => {
                                setSelectedStaff(item.name);
                                setShowStaffPicker(false);
                            }}>
                            <Text style={styles.pickerItemText}>{item.name}</Text>
                        </Pressable>
                    )}
                    bounces={false}
                />
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="연차대장"></AdminHeader>

            <View style={styles.searchContainer}>
                <View style={styles.pickerWrapper}>
                    <Pressable style={styles.pickerButton} onPress={() => setShowYearPicker(true)}>
                        <Text style={styles.pickerText}>{selectedYear}</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                    <Text style={styles.pickerLabel}> 년</Text>
                </View>
                <View style={styles.pickerWrapper}>
                    <Pressable style={styles.pickerButton} onPress={() => setShowStaffPicker(true)}>
                        <Text style={styles.pickerText}>{selectedStaff}</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                </View>
                <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </Pressable>
            </View>

            <FlatList
                data={restData}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                )}
                style={styles.listContainer}
            />

            {renderYearPicker()}
            {renderStaffPicker()}
            {viewSessionExpiration()}
        </View>
    );
};
export default AnnualLedger;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 15,
        backgroundColor: Colors.primary_white,
        margin: 20,
        marginBottom: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    pickerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 5,
    },
    pickerLabel: {
        fontWeight: "bold",
        fontSize: 16,
        color: Colors.text_gray,
    },
    pickerButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primary_gray,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginLeft: 5,
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
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 18,
        color: Colors.text_gray,
        fontWeight: "bold",
    },
    pickerModal: {
        backgroundColor: Colors.primary_white,
        borderRadius: 10,
        maxHeight: "50%",
        width: "80%",
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
    Modal: {
        justifyContent: "center",
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
    },
});
