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
  `
};

export default queries;