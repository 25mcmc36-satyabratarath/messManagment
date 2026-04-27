import queries from "../db/user.query.js";
import { pool } from "../index.js";
import { generateOTP, verifyOTP } from "../utils/otp.js";
import { sendOTP } from "../utils/mailer.js";


 const getMessCardView = async (req, res) => {
  try {
    let { month, year } = req.query;
    const student_id = req.user.id;

    if (!month || !year) {
      return res.status(400).json({
        error: "month and year are required (e.g. ?month=02&year=2026)"
      });
    }

    month = month.toString().padStart(2, "0");

    const startDate = `${year}-${month}-01`;

    const [endDateRow] = await pool.query(
      `SELECT LAST_DAY(?) as endDate`,
      [startDate]
    );
    const endDate = endDateRow[0].endDate;

    // 1. Get intervals
    const [intervals] = await pool.query(queries.messCardIntervals, [
      startDate,
      endDate,
      endDate,
      startDate,
      student_id,
      endDate,
      startDate
    ]);

    // 2. Get summary
    const [summary] = await pool.query(queries.messCardSummary, [
      endDate,
      startDate,
      student_id,
      endDate,
      startDate
    ]);

    res.json({
      month,
      year,
      intervals,
      summary: summary[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


const getYearlyBill = async (req, res) => {
  try {
    const student_id = req.user.id; 
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({
        error: "year is required (e.g. ?year=2026)"
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

export  {
  getMessCardView,
  getYearlyBill
};