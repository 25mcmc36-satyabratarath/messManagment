const queries = {

  // =========================================
  // AUTH / STUDENT
  // =========================================

  getStudentByEmail: `
    SELECT * FROM student WHERE email = ?;
  `,

  getStudentById: `
    SELECT * FROM student WHERE student_id = ?;
  `,

  createStudent: `
    INSERT INTO student (hostel_id, name, email, room_no)
    VALUES (?, ?, ?, ?);
  `,

  updateStudent: `
    UPDATE student 
    SET name = ?, room_no = ?, hostel_id = ?
    WHERE student_id = ?;
  `,

  deleteStudent: `
    DELETE FROM student WHERE student_id = ?;
  `,

  getAllStudents: `
    SELECT s.*, h.hostel_name
    FROM student s
    LEFT JOIN hostel h ON s.hostel_id = h.hostel_id;
  `,

  // =========================================
  // STAFF (UPDATED SECTION)
  // =========================================

  addNewStudent: `
  INSERT INTO student (name, email, hostel_id)
  VALUES (?, ?, ?)
` , 

  getStaffByEmail: `
    SELECT * FROM staff WHERE email = ?;
  `,

  getStaffById: `
    SELECT * FROM staff WHERE staff_id = ?;
  `,

  getAllStaff: `
    SELECT * FROM staff;
  `,

  deleteStaff: `
    DELETE FROM staff WHERE staff_id = ?;
  `,

  getActiveMessCardsByHostel: `
    SELECT mc.card_id, mc.student_id, mc.status, mc.open_date, mc.close_date,
           s.name AS student_name, s.email AS student_email, s.room_no
    FROM mess_card mc
    JOIN student s ON mc.student_id = s.student_id
    WHERE mc.status = 'ACTIVE' AND s.hostel_id = ?;
  `,

  getMessSummaryByHostel: `
   SELECT
  COUNT(DISTINCT s.student_id) AS total_students,
  COUNT(CASE WHEN mc.close_date IS NULL THEN 1 END) AS active_cards,
  COUNT(CASE WHEN mc.close_date IS NOT NULL THEN 1 END) AS closed_cards,
  COUNT(mc.card_id) AS total_cards
FROM student s
LEFT JOIN mess_card mc ON s.student_id = mc.student_id
WHERE s.hostel_id = ?;
  `,

  updateMessEmailConfig: `
    UPDATE mess_email_config
    SET email = ?, smtp_host = ?, smtp_port = ?, password = ?, is_active = ?
    WHERE config_id = ?;
  `,

  getMessEmailConfigById: `
    SELECT * FROM mess_email_config WHERE config_id = ?;
  `,

  updateStaff: `
    UPDATE staff
    SET name = ?, email = ?, role = ?, hostel_id = ?
    WHERE staff_id = ?;
  `,

  // =========================================
  // HOSTEL
  // =========================================

  getAllHostels: `
    SELECT * FROM hostel;
  `,

  createHostel: `
    INSERT INTO hostel (hostel_name, location)
    VALUES (?, ?);
  `,

  // =========================================
  // MESS CARD
  // =========================================

  getMessCardByStudent: `
    SELECT * FROM mess_card WHERE student_id = ?;
  `,

  createMessCard: `
    INSERT INTO mess_card (student_id, status, open_date)
    VALUES (?, 'ACTIVE', CURDATE());
  `,

  closeMessCard: `
    UPDATE mess_card
    SET status = 'CLOSED', close_date = CURDATE()
    WHERE student_id = ? AND status = 'ACTIVE';
  `,
  messCardIntervals: `
  SELECT 
      student_id,
      GREATEST(open_date, ?) AS open_date,
      LEAST(close_date, ?) AS close_date,
      GREATEST(
          0,
          DATEDIFF(
              LEAST(close_date, ?),
              GREATEST(open_date, ?)
          ) + 1
      ) AS days
  FROM (
      SELECT 
          student_id,
          open_date,
          IFNULL(close_date, CURRENT_DATE) AS close_date
      FROM mess_card

      UNION ALL

      SELECT 
          student_id,
          open_date,
          close_date
      FROM mess_card_history
  ) AS intervals
  WHERE student_id = ?
  AND open_date <= ?
  AND close_date >= ?;
  `,

  messCardSummary: `
  SELECT 
      IFNULL(SUM(days),0) AS total_active_days,
      COUNT(*) AS total_open_intervals
  FROM (
      SELECT 
          GREATEST(
              0,
              DATEDIFF(
                  LEAST(close_date, ?),
                  GREATEST(open_date, ?)
              ) + 1
          ) AS days
      FROM (
          SELECT 
              student_id,
              open_date,
              IFNULL(close_date, CURRENT_DATE) AS close_date
          FROM mess_card

          UNION ALL

          SELECT 
              student_id,
              open_date,
              close_date
          FROM mess_card_history
      ) AS intervals
      WHERE student_id = ?
      AND open_date <= ?
      AND close_date >= ?
  ) t;
  `,

  // =========================================
  // HISTORY
  // =========================================

  addMessHistory: `
    INSERT INTO mess_card_history (student_id, open_date, close_date, days)
    VALUES (?, ?, ?, ?);
  `,

  // =========================================
  // DAILY EXPENSE
  // =========================================

  addDailyExpense: `
    INSERT INTO daily_expense (hostel_id, date, normal_expense)
    VALUES (?, ?, ?);
  `,

  getDailyExpense: `
    SELECT * FROM daily_expense WHERE hostel_id = ?;
  `,

  // =========================================
  // SPECIAL MEAL
  // =========================================

  createSpecialMeal: `
    INSERT INTO special_meal (hostel_id, date, meal_name, total_cost, total_plates)
    VALUES (?, ?, ?, ?, ?);
  `,

  joinSpecialMeal: `
    INSERT INTO special_meal_student (special_id, student_id, plates_taken)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE plates_taken = plates_taken + 1;
  `,

  getSpecialMeals: `
    SELECT * FROM special_meal WHERE hostel_id = ?;
  `,

  // =========================================
  // SUBSCRIPTION
  // =========================================

  addSubscription: `
    INSERT INTO subscription (student_id, item_name, cost, start_date, end_date)
    VALUES (?, ?, ?, ?, ?);
  `,

  getSubscriptions: `
    SELECT * FROM subscription WHERE student_id = ?;
  `,

  getStudentMonthlyBill: `
    SELECT * FROM bill WHERE student_id = ? AND month = ? AND year = ?;
  `,

  getStudentYearlyBill: `
    SELECT year,
      SUM(total_amount) AS total_amount,
      COUNT(*) AS bill_count
    FROM bill
    WHERE student_id = ? AND year = ?
    GROUP BY year;
  `,

  getStudentFeedback: `
    SELECT * FROM feedback WHERE student_id = ? ORDER BY date DESC;
  `,

  getSpecialMealHistoryByStudent: `
    SELECT sms.special_id,
      sm.date,
      sm.meal_name,
      sm.total_cost,
      sm.total_plates,
      sms.plates_taken
    FROM special_meal_student sms
    JOIN special_meal sm ON sms.special_id = sm.special_id
    WHERE sms.student_id = ?
    ORDER BY sm.date DESC;
  `,

  getActiveMessCardByStudent: `
    SELECT * FROM mess_card WHERE student_id = ? AND status = 'ACTIVE';
  `,

  // =========================================
  // BILLING
  // =========================================

  createBill: `
    INSERT INTO bill (student_id, month, year, normal_amount, special_amount, subscription_amount, total_amount, payment_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING');
  `,

  getStudentBills: `
    SELECT * FROM bill WHERE student_id = ?;
  `,

  updatePaymentStatus: `
    UPDATE bill SET payment_status = 'PAID' WHERE bill_id = ?;
  `,

  // =========================================
  // PAYMENT
  // =========================================

  addPayment: `
    INSERT INTO payment (bill_id, amount, payment_date, status)
    VALUES (?, ?, CURDATE(), 'SUCCESS');
  `,

  // =========================================
  // FEEDBACK
  // =========================================

  addFeedback: `
    INSERT INTO feedback (student_id, date, food_rating, hygiene_rating, comments)
    VALUES (?, CURDATE(), ?, ?, ?);
  `,

  // =========================================
  // OTP
  // =========================================

  saveOTP: `
    INSERT INTO otp (email, otp_code, expires_at)
    VALUES (?, ?, ?);
  `,

  verifyOTP: `
    SELECT * FROM otp 
    WHERE email = ? AND otp_code = ? AND expires_at > NOW();
  `,

  // =========================================
  // ANALYTICS
  // =========================================

  cardAnalysis: `
    SELECT status, COUNT(*) AS count
    FROM mess_card
    GROUP BY status;
  `,

  financialSummary: `
    SELECT 
      SUM(normal_amount) AS total_normal,
      SUM(special_amount) AS total_special,
      SUM(subscription_amount) AS total_subscription,
      SUM(total_amount) AS total_revenue
    FROM bill
    WHERE month=? AND year=?;
  `,

  overallFeedback: `
    SELECT 
      AVG(food_rating) AS avg_food,
      AVG(hygiene_rating) AS avg_hygiene
    FROM feedback;
  `,

  // =========================================
  // DAILY EXPENSE
  // =========================================

  addExpense: `
    INSERT INTO daily_expense (hostel_id, date, normal_expense) VALUES (?, ?, ?)
  `,

  getExpensesByHostel: `
    SELECT * FROM daily_expense WHERE hostel_id = ? ORDER BY date DESC
  `
};

export default queries;