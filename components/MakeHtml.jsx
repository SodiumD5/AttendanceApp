import { supabase } from "../lib/supabase.js";
import { attendanceWebHtml } from "../static/AttendanceWebHtml.jsx";
import { attendancePdfHtml } from "../static/AttendancePdfHtml.jsx";

const MakeHtml = async ({ selectedYear, selectedMonth, mode }) => {
    const { data: staffList, error } = await supabase.rpc("get_monthly_status", {
        p_year: selectedYear,
        p_month: selectedMonth,
    });

    if (error) {
        console.error("데이터 로드 실패:", error);
        return "";
    }

    const template = mode === "pdf" ? attendancePdfHtml : attendanceWebHtml;

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

    let headerDays = "";
    let headerWeeks = "";
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth - 1, day);
        const dayOfWeek = date.getDay();
        const className = dayOfWeek === 6 ? "saturday" : dayOfWeek === 0 ? "sunday" : "";
        headerDays += `<th class="${className}">${day}</th>`;
        headerWeeks += `<th class="${className}">${dayLabels[dayOfWeek]}</th>`;
    }

    let tableBody = "";
    staffList.forEach((staff) => {
        tableBody += `<tr><td class="sticky-col">${staff.employee_name}</td>`;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedYear, selectedMonth - 1, day);
            const dayOfWeek = date.getDay();
            const className = dayOfWeek === 6 ? "saturday" : dayOfWeek === 0 ? "sunday" : "";

            const dayData = staff.daily_data[day];
            let cellContent = "";

            if (dayData && dayData.status) {
                if (dayData.status === "연차") {
                    cellContent = "연차";
                } else if (dayData.status === "반차") {
                    cellContent = `반차<br/>${dayData.work || ""}<br/>${dayData.leave || ""}`;
                } else if (dayData.status === "출근") {
                    cellContent = `출근<br/><span class="time-text">${
                        dayData.work || ""
                    }</span><br/><span class="time-text">${dayData.leave || ""}</span>`;
                }
            }

            tableBody += `<td class="${className}">${cellContent}</td>`;
        }

        tableBody += `<td class="total-col">${staff.total_work}</td>`;
        tableBody += `<td class="total-col">${staff.total_rest}</td></tr>`;
    });

    return template
        .replace("{{ title }}", `${selectedYear}년 ${selectedMonth}월 출근부`)
        .replace("{{ headerDays }}", headerDays)
        .replace("{{ headerWeeks }}", headerWeeks)
        .replace("{{ tableBody }}", tableBody);
};

export default MakeHtml;
