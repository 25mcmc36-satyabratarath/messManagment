//  Final Query (Mess card + Expense merged)


const getStudentYearlyMess = async (studentId, year) => {
  const query = `
    WITH monthly_expense AS (
        SELECT 
            MONTH(t.open_date) AS m,
            SUM(
                t.days * (m2.per_student_expense / DAY(LAST_DAY(t.open_date)))
            ) AS expense
        FROM
        (
            SELECT 
                student_id,
                open_date,
                close_date,
                DATEDIFF(close_date, open_date) + 1 AS days
            FROM mess_card_history
            WHERE student_id = ?
        ) t

        JOIN
        (
            SELECT 
                MONTH(date) AS mth,
                YEAR(date) AS yr,
                SUM(normal_expense) / COUNT(*) AS per_student_expense
            FROM daily_expense d
            JOIN student s ON d.hostel_id = s.hostel_id
            WHERE s.student_id = ?
              AND YEAR(date) = ?
            GROUP BY YEAR(date), MONTH(date)
        ) m2

        ON MONTH(t.open_date) = m2.mth
        AND YEAR(t.open_date) = m2.yr

        GROUP BY MONTH(t.open_date)
    )

    SELECT 
        ? AS student_id,
        ? AS year,
        month_name,
        COALESCE(me.expense, 0) AS expense

    FROM
    (
        SELECT 1 AS m, 'January' AS month_name UNION
        SELECT 2, 'February' UNION
        SELECT 3, 'March' UNION
        SELECT 4, 'April' UNION
        SELECT 5, 'May' UNION
        SELECT 6, 'June' UNION
        SELECT 7, 'July' UNION
        SELECT 8, 'August' UNION
        SELECT 9, 'September' UNION
        SELECT 10, 'October' UNION
        SELECT 11, 'November' UNION
        SELECT 12, 'December'
    ) months

    LEFT JOIN monthly_expense me ON months.m = me.m

    UNION ALL

    SELECT 
        ?, 
        ?, 
        'TOTAL',
        SUM(COALESCE(expense,0))
    FROM monthly_expense;
  `;

  const [rows] = await pool.query(query, [
    studentId,          // for mess_card_history
    studentId, year,    // for daily_expense join
    studentId, year,    // for months select
    studentId, year     // for total
  ]);

  return rows;
};




//  Monthly Expense (Jan–Dec + TOTAL)

const getStudentYearlyMess = async (studentId, year) => {
  const query = `
    WITH monthly_expense AS (
        SELECT 
            MONTH(t.open_date) AS m,
            SUM(
                t.days * (m2.per_student_expense / DAY(LAST_DAY(t.open_date)))
            ) AS expense
        FROM
        (
            SELECT 
                student_id,
                open_date,
                close_date,
                DATEDIFF(close_date, open_date) + 1 AS days
            FROM mess_card_history
            WHERE student_id = ?
        ) t

        JOIN student s1 ON s1.student_id = t.student_id

        JOIN
        (
            SELECT 
                MONTH(date) AS mth,
                YEAR(date) AS yr,
                hostel_id,
                SUM(normal_expense) / COUNT(*) AS per_student_expense
            FROM daily_expense
            WHERE YEAR(date) = ?
            GROUP BY YEAR(date), MONTH(date), hostel_id
        ) m2
        ON MONTH(t.open_date) = m2.mth
        AND YEAR(t.open_date) = m2.yr
        AND m2.hostel_id = s1.hostel_id

        GROUP BY MONTH(t.open_date)
    )

    SELECT 
        ? AS student_id,
        ? AS year,
        month_name,
        COALESCE(me.expense, 0) AS expense
    FROM
    (
        SELECT 1 AS m, 'January' AS month_name UNION
        SELECT 2, 'February' UNION
        SELECT 3, 'March' UNION
        SELECT 4, 'April' UNION
        SELECT 5, 'May' UNION
        SELECT 6, 'June' UNION
        SELECT 7, 'July' UNION
        SELECT 8, 'August' UNION
        SELECT 9, 'September' UNION
        SELECT 10, 'October' UNION
        SELECT 11, 'November' UNION
        SELECT 12, 'December'
    ) months

    LEFT JOIN monthly_expense me ON months.m = me.m

    UNION ALL

    SELECT 
        ?, 
        ?, 
        'TOTAL',
        SUM(COALESCE(expense,0))
    FROM monthly_expense;
  `;

  const [rows] = await pool.query(query, [
    studentId,   // mess_card_history
    year,        // daily_expense
    studentId, year,
    studentId, year
  ]);

  return rows;
};




//  Get mess card status for a specific date

const getMessCardStatusByDate = async (date) => {
  const query = `
    SELECT 
        COUNT(*) AS total_cards,

        -- OPEN on given date
        SUM(
            CASE 
                WHEN open_date <= ? 
                 AND (close_date IS NULL OR close_date >= ?)
                THEN 1 ELSE 0 
            END
        ) AS open_cards,

        -- CLOSED before that date
        SUM(
            CASE 
                WHEN close_date IS NOT NULL 
                 AND close_date < ?
                THEN 1 ELSE 0 
            END
        ) AS closed_cards

    FROM mess_card;
  `;

  const [rows] = await pool.query(query, [date, date, date]);
  return rows[0];
};

export {
  getMessCardStatusByDate,
  getStudentYearlyMess,
  
};
