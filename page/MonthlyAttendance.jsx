import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, FlatList, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import Colors from "../components/Colors";
import AdminHeader from "../layout/AdminHeader";
import AlertModal from "../components/AlertModal";
import RectangleButton from "../components/RectangleButton";
import PickerModal from "../components/PickerModal";
import BottomDownload from "../components/BottomDownload";
import { supabase } from "../lib/supabase";
import MakeHtml from "../components/MakeHtml";

const MonthlyAttendance = ({ navigation }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedStaff, setSelectedStaff] = useState("직원 선택");
    const [stafflist, setStaffList] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    const [activeModal, setActiveModal] = useState(null);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showInvalidModify, setShowInvalidModify] = useState(false);
    const [titleMessage, setTitleMessage] = useState("검색조건을 설정해주세요");

    const [selectedDay, setSelectedDay] = useState();
    const [selectedWorkTime, setSelectedWorkTime] = useState();
    const [selectedLeaveTime, setSelectedLeaveTime] = useState();
    const [selectedRest, setSelectedRest] = useState();

    const [generatedHtml, setGeneratedHtml] = useState("");

    const years = Array.from({ length: 76 }, (_, i) => 2025 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

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
        setTitleMessage(`${selectedYear}년 ${selectedMonth}월 ${selectedStaff} 출근부`);
        const { data, error } = await supabase.rpc("get_employee_monthly_attendance", {
            p_name: selectedStaff,
            p_year: selectedYear,
            p_month: selectedMonth,
        });
        if (error) console.log(`failed to load monthly attendance : ${error.message}`);
        setSearchResult(data || []);
    };

    const restText = (rest) => {
        const mapping = { half: "반차", full: "연차", X: "출근" };
        return mapping[rest];
    };

    const toggleModifyModal = (item = null) => {
        if (item) {
            const convertTo24 = (timeStr) => {
                if (!timeStr || timeStr === "X") return timeStr;
                if (!timeStr.includes("오전") && !timeStr.includes("오후")) return timeStr;

                const [ampm, time] = timeStr.split(" ");
                let [hour, minute] = time.split(":").map(Number);

                if (ampm === "오후" && hour < 12) hour += 12;
                if (ampm === "오전" && hour === 12) hour = 0;

                return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
            };

            setSelectedDay(item.date);
            setSelectedWorkTime(convertTo24(item.work_time));
            setSelectedLeaveTime(convertTo24(item.leave_time));
            setSelectedRest(restText(item.rest));
            setActiveModal("modify");
        } else {
            setActiveModal(null);
        }
    };

    const compareTime = () => {
        if (!selectedWorkTime || !selectedLeaveTime || selectedWorkTime === "X" || selectedLeaveTime === "X")
            return false;
        const toMin = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };
        return toMin(selectedWorkTime) <= toMin(selectedLeaveTime);
    };

    const EnterModifyButton = async () => {
        const day_int = selectedDay.toString().split("일")[0];
        // prettier-ignore
        const YYYYMMDD = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day_int).padStart(2,"0")}`;
        if (selectedRest === "연차") var useRest = "full";
        else if (selectedRest === "반차") var useRest = "half";
        else var useRest = "X";

        if (compareTime()) {
            const { error } = await supabase.rpc("modify_attendance_and_rest", {
                p_name: selectedStaff,
                p_date: YYYYMMDD,
                p_work_time: selectedRest === "연차" ? null : selectedWorkTime,
                p_leave_time: selectedRest === "연차" ? null : selectedLeaveTime,
                p_use_rest: useRest,
            });

            if (error) console.log(`modify attendance and rest failed : ${error.message}`);
            else {
                await handleSearch();
                setActiveModal(null);
            }
        } else {
            setShowInvalidModify(true);
        }
    };

    const formatTimeForDisplay = (timeData) => {
        if (!timeData || timeData === "X") return "X";

        var hour = 0;
        if (timeData.includes("오전")) {
            timeData = timeData.slice(3);
        } else if (timeData.includes("오후")) {
            timeData = timeData.slice(3);
            hour += 12;
        }

        const [hourStr, minute] = timeData.split(":");
        hour += parseInt(hourStr);

        const ampm = hour < 12 ? "오전" : "오후";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedHour = displayHour.toString().padStart(2, "0");

        return `${ampm} ${formattedHour}시 ${minute}분`;
    };

    const handleTimeConfirm = (date, setter) => {
        const timeStr = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
        setter(timeStr);
        setActiveModal("modify");
    };

    const openWebview = async () => {
        const attendanceHtml = await MakeHtml({ selectedYear, selectedMonth, mode: "web" });
        setGeneratedHtml(attendanceHtml);
        setActiveModal("webview");
    };

    const downloadPdf = async () => {
        const attendanceHtml = await MakeHtml({ selectedYear, selectedMonth, mode: "pdf" });

        const { uri } = await Print.printToFileAsync({ html: attendanceHtml });

        const fileName = `${selectedYear}년 ${selectedMonth}월 출근부.pdf`;
        const newUri = FileSystem.cacheDirectory + fileName;

        await FileSystem.moveAsync({
            from: uri,
            to: newUri,
        });

        await shareAsync(newUri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
        });
    };

    const isLeave = selectedRest === "연차";

    return (
        <View style={styles.container}>
            <AdminHeader nav={navigation} menuName="월간 출근부" />

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{titleMessage}</Text>
            </View>

            <Pressable style={styles.openSearchButton} onPress={() => setActiveModal("search")}>
                <Text style={styles.openSearchButtonText}>검색 조건 설정</Text>
            </Pressable>

            <FlatList
                data={searchResult}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                ListHeaderComponent={() => (
                    <View style={styles.tableHeader}>
                        {["날짜", "출근 시각", "퇴근 시각", "휴가"].map((t) => (
                            <Text key={t} style={styles.headerText}>
                                {t}
                            </Text>
                        ))}
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleModifyModal(item)}>
                        <View style={styles.tableRow}>
                            <Text style={styles.rowText}>{item.date}</Text>
                            <Text style={styles.rowText}>{item.work_time || "X"}</Text>
                            <Text style={styles.rowText}>{item.leave_time || "X"}</Text>
                            <Text style={styles.rowText}>{restText(item.rest)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyHeader}>검색 결과가 없습니다.</Text>
                        <Text style={styles.emptyText}>선택한 날짜와 직원을 다시 확인해주세요.</Text>
                    </View>
                )}
                style={styles.listContainer}
            />

            <BottomDownload webview={openWebview} download={downloadPdf} isVisible={searchResult.length > 0} />

            {/* 검색 모달 */}
            <Modal
                isVisible={activeModal === "search"}
                onBackdropPress={() => setActiveModal(null)}
                style={styles.searchModal}
            >
                <View style={styles.modalView}>
                    <View style={styles.filterRow}>
                        <Pressable style={styles.pickerButton} onPress={() => setActiveModal("year")}>
                            <Text style={styles.pickerText}>{selectedYear} 년 ▼</Text>
                        </Pressable>
                        <Pressable style={styles.pickerButton} onPress={() => setActiveModal("month")}>
                            <Text style={styles.pickerText}>{selectedMonth} 월 ▼</Text>
                        </Pressable>
                    </View>
                    <View style={styles.filterRow}>
                        <Pressable
                            style={[styles.pickerButton, { marginHorizontal: 0 }]}
                            onPress={() => setActiveModal("staff")}
                        >
                            <Text style={styles.pickerText}>{selectedStaff} ▼</Text>
                        </Pressable>
                    </View>
                    <RectangleButton
                        message="검색"
                        onPress={() => {
                            if (selectedStaff === "직원 선택") {
                                setActiveModal(null);
                                setShowAlertModal(true);
                            } else {
                                handleSearch();
                                setActiveModal(null);
                            }
                        }}
                        buttonColor="blue"
                        buttontype="modal"
                    />
                    <RectangleButton
                        message="취소"
                        onPress={() => setActiveModal(null)}
                        buttonColor="white"
                        buttontype="modal"
                    />
                </View>
            </Modal>

            {/* 수정 모달 */}
            <Modal isVisible={activeModal === "modify"} onBackdropPress={() => setActiveModal(null)}>
                <View style={styles.ModifyModalContainer}>
                    <Text style={styles.ModifyModalTitle}>{selectedDay} 수정</Text>
                    {[
                        {
                            label: "출근 시각 : ",
                            val: isLeave ? "X" : formatTimeForDisplay(selectedWorkTime),
                            action: () => setActiveModal("workTime"),
                            dis: isLeave,
                        },
                        {
                            label: "퇴근 시각 : ",
                            val: isLeave ? "X" : formatTimeForDisplay(selectedLeaveTime),
                            action: () => setActiveModal("leaveTime"),
                            dis: isLeave,
                        },
                        { label: "휴가 : ", val: selectedRest, action: () => setActiveModal("rest"), dis: false },
                    ].map((row, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.ModifyModalTimeContainer}
                            onPress={row.action}
                            disabled={row.dis}
                        >
                            <Text style={row.dis ? styles.ModifyModalTimeTextDisabled : styles.ModifyModalTimeText}>
                                {row.label}
                            </Text>
                            <Text style={row.dis ? styles.ModifyModalTimeTextDisabled : styles.ModifyModalTimeText}>
                                {row.val}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <RectangleButton message="변경하기" onPress={EnterModifyButton} buttontype="modal" />
                    <RectangleButton
                        message="취소"
                        onPress={() => setActiveModal(null)}
                        buttonColor="white"
                        buttontype="modal"
                    />
                </View>
            </Modal>

            {/* 웹뷰 모달 추가 */}
            <Modal
                isVisible={activeModal === "webview"}
                onBackdropPress={() => setActiveModal(null)}
                style={{ margin: 0 }} // 전체 화면으로 띄우기 위함
            >
                <View
                    style={{
                        height: 50,
                        justifyContent: "center",
                        paddingHorizontal: 15,
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                    }}
                >
                    <TouchableOpacity onPress={() => setActiveModal(null)}>
                        <Text style={{ color: "red", fontSize: 16 }}>닫기</Text>
                    </TouchableOpacity>
                </View>
                <WebView source={{ html: generatedHtml }} />
            </Modal>

            {/* Picker 및 Alert 모달들 */}
            <PickerModal
                data={years}
                select={selectedYear}
                setSelect={setSelectedYear}
                isVisible={activeModal === "year"}
                setIsVisible={() => setActiveModal("search")}
                keyExtractor={(i) => i.toString()}
                renderText={(i) => i.toString()}
            />
            <PickerModal
                data={months}
                select={selectedMonth}
                setSelect={setSelectedMonth}
                isVisible={activeModal === "month"}
                setIsVisible={() => setActiveModal("search")}
                keyExtractor={(i) => i.toString()}
                renderText={(i) => i.toString()}
            />
            <PickerModal
                data={stafflist}
                select={selectedStaff}
                setSelect={setSelectedStaff}
                isVisible={activeModal === "staff"}
                setIsVisible={() => setActiveModal("search")}
                keyExtractor={(i) => i.id.toString()}
                renderText={(i) => i.name}
            />
            <PickerModal
                data={["출근", "반차", "연차"]}
                select={selectedRest}
                setSelect={setSelectedRest}
                isVisible={activeModal === "rest"}
                setIsVisible={() => setActiveModal("modify")}
                keyExtractor={(i) => i}
                renderText={(i) => i}
            />

            <DateTimePickerModal
                isVisible={activeModal === "workTime"}
                mode="time"
                onConfirm={(d) => handleTimeConfirm(d, setSelectedWorkTime)}
                onCancel={() => setActiveModal("modify")}
            />
            <DateTimePickerModal
                isVisible={activeModal === "leaveTime"}
                mode="time"
                onConfirm={(d) => handleTimeConfirm(d, setSelectedLeaveTime)}
                onCancel={() => setActiveModal("modify")}
            />

            <AlertModal
                isVisible={showAlertModal}
                setIsVisible={setShowAlertModal}
                title="직원을 선택해주세요"
                bgColor={Colors.primary_red}
            />
            <AlertModal
                isVisible={showInvalidModify}
                setIsVisible={setShowInvalidModify}
                title="올바른 시간을 입력하세요."
                meg="출근 시간이 퇴근 시간보다 빨라야 합니다."
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    titleContainer: { marginTop: 10 },
    titleText: { textAlign: "center", fontSize: 20, fontWeight: "bold" },
    filterRow: { flexDirection: "row", justifyContent: "space-around", width: "100%", marginBottom: 10 },
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
    pickerText: { fontSize: 16, color: Colors.text_gray, marginRight: 5 },
    listContainer: { flex: 1, width: "100%", padding: 10 },
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
    headerText: { fontWeight: "bold", flex: 1, textAlign: "center", fontSize: 16, color: Colors.text_gray },
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
    rowText: { flex: 1, textAlign: "center", fontSize: 16, color: Colors.text_gray },
    emptyContainer: { alignItems: "center", marginTop: 50 },
    emptyHeader: { fontSize: 18, fontWeight: "bold", color: Colors.text_gray, marginBottom: 10 },
    emptyText: { fontSize: 16, color: Colors.text_gray },
    searchModal: { justifyContent: "center", alignItems: "center", margin: 0 },
    modalView: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        width: "80%",
        alignItems: "center",
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
    openSearchButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    ModifyModalContainer: {
        backgroundColor: "white",
        padding: 20,
        paddingHorizontal: 30,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    ModifyModalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    ModifyModalTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    ModifyModalTimeText: { fontSize: 16 },
    ModifyModalTimeTextDisabled: { fontSize: 16, color: Colors.inactive_text },
});

export default MonthlyAttendance;
