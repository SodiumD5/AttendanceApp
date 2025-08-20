import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList, Modal } from "react-native";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import useTokenStore from "../store/tokenStore";

const AnnualLedger = ({ navigation }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [searchResult, setSearchResult] = useState([]);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const years = Array.from({ length: 76 }, (_, i) => 2025 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const { token } = useTokenStore();
    useEffect(() => {
        console.log(token);
        if (!token) {
            navigation.replace("login");
        }
    }, [token]);

    const handleSearch = async () => {
        const postData = { year: selectedYear, month: selectedMonth };
        const url = "http://10.0.2.2:8000/post/restData";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });
        const response_body = await response.json();
        setSearchResult(response_body);
    };

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>이름</Text>
            <Text style={styles.headerText}>반차 사용</Text>
            <Text style={styles.headerText}>연차 사용</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.rowText}>{item.name}</Text>
            <Text style={styles.rowText}>{item.halfRest}</Text>
            <Text style={styles.rowText}>{item.fullRest}</Text>
        </View>
    );

    const renderYearPicker = () => (
        <Modal
            transparent={true}
            animationType="slide"
            visible={showYearPicker}
            onRequestClose={() => setShowYearPicker(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setShowYearPicker(false)}>
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
            </Pressable>
        </Modal>
    );

    const renderMonthPicker = () => (
        <Modal
            transparent={true}
            animationType="slide"
            visible={showMonthPicker}
            onRequestClose={() => setShowMonthPicker(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setShowMonthPicker(false)}>
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
            </Pressable>
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
                    <Pressable style={styles.pickerButton} onPress={() => setShowMonthPicker(true)}>
                        <Text style={styles.pickerText}>{selectedMonth}</Text>
                        <Text style={styles.arrowIcon}>▼</Text>
                    </Pressable>
                    <Text style={styles.pickerLabel}> 월</Text>
                </View>
                <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </Pressable>
            </View>

            <FlatList
                data={searchResult}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                )}
                style={styles.listContainer}
            />

            {renderYearPicker()}
            {renderMonthPicker()}
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
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});
