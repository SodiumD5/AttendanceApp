export const attendancePdfHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        /* 가로 모드 설정을 위한 핵심 */
        @page {
            size: A4 landscape;
            margin: 10mm;
        }

        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #fff;
            font-family: sans-serif;
        }

        body {
            box-sizing: border-box;
        }

        .header-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            width: 100%;
        }

        table {
            width: 100%; /* 고정 mm 대신 100% 사용 */
            border-collapse: collapse;
            border: 2px solid #000;
            table-layout: fixed;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px 2px;
            text-align: center;
            font-size: 8px; /* 가로로 길어지므로 폰트 크기 조절 */
            height: 40px;
            word-break: break-all;
        }

        th {
            background-color: #f2f2f2;
        }

        .sticky-col {
            width: 60px; /* 이름 칸 너비 최적화 */
            font-weight: bold;
            border-right: 2px solid #000;
        }

        .total-col {
            width: 35px;
            background-color: #fafafa;
            font-weight: bold;
        }

        .saturday { background-color: #eef7ff; }
        .sunday { background-color: #fff0f0; }
    </style>
</head>
<body>
    <div class="header-title">{{ title }}</div>
    <table>
        <thead>
            <tr>
                <th class="sticky-col" rowspan="2">이름</th>
                {{ headerDays }}
                <th class="total-col" rowspan="2">출근</th>
                <th class="total-col" rowspan="2">연차</th>
            </tr>
            <tr>
                {{ headerWeeks }}
            </tr>
        </thead>
        <tbody>
            {{ tableBody }}
        </tbody>
    </table>
</body>
</html>
`;
