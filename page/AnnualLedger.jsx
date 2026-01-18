import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList, TextInput } from "react-native";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import PickerModal from "../components/PickerModal";
import { supabase } from "../lib/supabase";

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

    useEffect(() => {
        const getStaffList = async () => {
            try {
                const { data, error } = await supabase.rpc("get_active_employee_list");
                if (error) throw error;
                setStaffList(data);
            } catch (e) {
                console.log("failed to get employee list : ", e);
            }
        };
        getStaffList();
    }, []);

    const handleSearch = async () => {
        //연차 내역 가져오기
        const { data: restData, error } = await supabase.rpc("get_employee_rest", {
            p_name: selectedStaff,
            p_year: selectedYear,
        });

        if (error) {
            console.log(error.message);
            return;
        }

        setRestData(restData.rest_details);
        setRestCount(restData.total_rest);
        setTotalRestCount(restData.annual_limit);

        setTotalRestEdit(true);
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>사용횟수</Text>
            <Text style={styles.headerText}>날짜</Text>
            <Text style={styles.headerText}>구분</Text>
        </View>
    );

    //휴가 횟수 카운트 하기
    const renderItem = ({ item }) => {
        return (
            <View style={styles.tableRow}>
                <Text style={styles.rowText}>{item.count}</Text>
                <Text style={styles.rowText}>{item.date}</Text>
                <Text style={styles.rowText}>{item.category === "full" ? "연차" : "반차"}</Text>
            </View>
        );
    };

    //전체 휴가 횟수 바꾸기
    const onChangeLimit = async (limitText) => {
        if (!limitText) {
            setTotalRestCount("");
            return;
        }
        setTotalRestCount(Number(limitText));

        const { error } = await supabase.rpc("update_employee_rest_limit", {
            p_name: selectedStaff,
            p_year: selectedYear,
            p_limit: Number(limitText),
        });

        if (error) console.log(error.message);
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

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>총 연차 일수</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                keyboardType="numeric"
                                style={styles.summaryValue}
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
                ListEmptyComponent={() => <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>}
                style={styles.listContainer}
            />

            {renderYearPicker()}
            {renderStaffPicker()}
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
        fontSize: 13,
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
        paddingLeft: 1, //상하좌우 조금이라도 패딩이 있으면 된다고????? 얼탱
        margin: 0,
        lineHeight: 20,
    },
});
