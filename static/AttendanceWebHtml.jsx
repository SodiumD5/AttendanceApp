export const attendanceWebHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=yes"
    />
    <style>
        body {
            margin: 0;
            padding: 12px;
            font-family: sans-serif;
            background: #fff;
        }

        .header-title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 12px;
        }

        .table-container {
            width: 100%;
            overflow-x: auto;
        }

        table {
            border-collapse: collapse;
            min-width: 1600px;
            border: 2px solid #000;
            table-layout: fixed;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
            font-size: 11px;
            height: 48px;
            word-break: break-all;
        }

        th {
            background-color: #f2f2f2;
        }

        .sticky-col {
            position: sticky;
            left: 0;
            background-color: #fff;
            z-index: 5;
            border-right: 2px solid #000;
            width: 90px;
            font-weight: bold;
        }

        th:not(.sticky-col):not(.total-col),
        td:not(.sticky-col):not(.total-col) {
            width: 50px;
        }

        .total-col {
            width: 50px;
            background-color: #fafafa;
            font-weight: bold;
        }

        .saturday {
            background-color: #eef7ff;
        }

        .sunday {
            background-color: #fff0f0;
        }
    </style>
</head>
<body>
    <div class="header-title">{{ title }}</div>

    <div class="table-container">
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
    </div>
</body>
</html>
`;
