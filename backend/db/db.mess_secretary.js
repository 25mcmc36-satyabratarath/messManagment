const queries = {
  getActiveCardsByDate: `
    SELECT 
      COUNT(*) AS total_cards,
      SUM(
        CASE 
          WHEN open_date <= ? 
           AND (close_date IS NULL OR close_date >= ?) 
          THEN 1 ELSE 0 
        END
      ) AS active_cards
    FROM mess_card;
  `,

  getNetCard: `
    SELECT 
      COUNT(*) AS total_cards,
      SUM(close_date IS NULL) AS open_cards,
      SUM(close_date IS NOT NULL) AS closed_cards
    FROM mess_card;
  `,

  getRationSummary: `
    SELECT date, SUM(normal_expense) AS total_expense
    FROM daily_expense
    GROUP BY date
    ORDER BY date DESC;
  `,

  insertRationConsumption: `
    INSERT INTO daily_expense (hostel_id, date, normal_expense)
    VALUES (?, ?, ?);
  `,

  getSpecialMealSummary: `
    SELECT special_id, date, meal_name, total_cost, total_plates
    FROM special_meal
    ORDER BY date DESC;
  `,

  insertSpecialMeal: `
    INSERT INTO special_meal (hostel_id, date, meal_name, total_cost, total_plates)
    VALUES (?, ?, ?, ?, ?);
  `,

  getSpecialMeals: `
    SELECT * FROM special_meal ORDER BY date DESC;
  `,

  insertSpecialMealStudent: `
    INSERT INTO special_meal_student (special_id, student_id, plates_taken)
    VALUES (?, ?, ?);
  `,

  insertWeeklyExpense: `
    INSERT INTO daily_expense (hostel_id, date, normal_expense)
    VALUES (?, ?, ?);
  `,

  getWeeklyExpense: `
    SELECT 
      YEAR(date) AS year,
      WEEK(date) AS week,
      SUM(normal_expense) AS total_expense
    FROM daily_expense
    GROUP BY YEAR(date), WEEK(date)
    ORDER BY year DESC, week DESC;
  `
};

export default queries;
