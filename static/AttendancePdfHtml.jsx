export const attendancePdfHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page {
            size: A4 landscape;
            margin: 5mm;
        }

        html, body {
            width: 100%;
            margin: 0;
            padding: 0;
            background: #fff;
            font-family: 'sans-serif';
            -webkit-print-color-adjust: exact; 
        }

        .header-title {
            font-size: 20px; 
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            border: 1px solid #000;
        }

        th, td {
            border: 1px solid #000;
            padding: 2px 1px;
            text-align: center;
            font-size: 6px; 
            height: 35px;
            overflow: hidden;
            white-space: nowrap;
            word-break: break-all;
        }

        th {
            background-color: #f2f2f2 !important;
        }

        .sticky-col { width: 45px; font-weight: bold; }
        .total-col { width: 25px; font-weight: bold; background-color: #fafafa !important; }
        
        th:not(.sticky-col):not(.total-col), 
        td:not(.sticky-col):not(.total-col) {
            width: auto;
        }

        .saturday { background-color: #eef7ff !important; }
        .sunday { background-color: #fff0f0 !important; }

        .time-text {
            font-size: 5px;
            line-height: 1;
        }
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
