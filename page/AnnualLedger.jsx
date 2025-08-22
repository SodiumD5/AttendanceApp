import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList, TextInput } from "react-native";
import Modal from "react-native-modal";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import useTokenStore from "../store/tokenStore";
import AlertModal from "../components/AlertModal";
import axiosInstance from "../api/axios";
import PickerModal from "../components/PickerModal";

const AnnualLedger = ({ navigation }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedStaff, setSelectedStaff] = useState("직원 선택");
    const [stafflist, setStaffList] = useState([]);
    const [restData, setRestData] = useState([]);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showStaffPicker, setShowStaffPicker] = useState(false);
    const [restCount, setRestCount] = useState(0);
    const [totalRestCount, setTotalRestCount] = useState(15);
    const [totalRestEdit, setTotalRestEdit] = useState(false);

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
        //연차 내역 가져오기
        var url = `/rest/${selectedStaff}/${selectedYear}`;
        const rest_records = await axiosInstance.get(url);
        const response_data = rest_records.data;

        setRestData(response_data["info"]);
        setRestCount(response_data["count"]);

        //총 연차 일수 가져오기 (없으면 생성)
        var url = "/rest/limit";
        const postData = {
            name: selectedStaff,
            year: selectedYear,
        };
        const rest_limit = await axiosInstance.post(url, postData);
        setTotalRestEdit(true);
        setTotalRestCount(rest_limit.data);
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

    //전체 휴가 횟수 바꾸기
    const onChangeLimit = async (text) => {
        setTotalRestCount(text);
        const url = "/modification/rest";
        const data = {
            name: selectedStaff,
            year: selectedYear,
            limit: parseInt(text),
        };
        await axiosInstance.put(url, data);
    };

    // 연도 선택 모달
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
    // 직원 선택 모달
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

    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="연차대장"></AdminHeader>

            <View style={styles.headerContainer}>
                <View style={styles.serachContainer}>
                    <View style={styles.pickerWrapper}>
                        <Pressable
                            style={styles.pickerButton}
                            onPress={() => setShowYearPicker(true)}>
                            <Text style={styles.pickerText}>{selectedYear}</Text>
                            <Text style={styles.arrowIcon}>▼</Text>
                        </Pressable>
                        <Text style={styles.pickerLabel}> 년</Text>
                    </View>
                    <View style={styles.pickerWrapper}>
                        <Pressable
                            style={styles.pickerButton}
                            onPress={() => setShowStaffPicker(true)}>
                            <Text style={styles.pickerText}>{selectedStaff}</Text>
                            <Text style={styles.arrowIcon}>▼</Text>
                        </Pressable>
                    </View>
                    <Pressable style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>검색</Text>
                    </Pressable>
                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>총 연차 일수</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                style={styles.summaryValue}
                                keyboardType="numeric"
                                onChangeText={onChangeLimit}
                                value={`${totalRestCount}`}
                                editable={totalRestEdit}
                            />
                            <Text style={styles.summaryValue}>회</Text>
                        </View>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>사용 연차</Text>
                        <Text style={styles.summaryValue}>{restCount}회</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>잔여 연차</Text>
                        <Text style={styles.summaryValue}>{`${totalRestCount - restCount}회`}</Text>
                    </View>
                </View>
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
    headerContainer: {
        padding: 15,
        backgroundColor: Colors.primary_white,
        margin: 20,
        marginBottom: 0,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    serachContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
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
    Modal: {
        justifyContent: "center",
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 20,
    },
    summaryItem: {
        alignItems: "center",
    },
    summaryLabel: {
        fontSize: 14,
        color: Colors.text_gray,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.text_gray,
        padding: 0,
        margin: 0,
        lineHeight: 20,
    },
});
