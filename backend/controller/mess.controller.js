import queries from "../db/user.query.js";
import { pool } from "../index.js";

export async function getMonthlyBill(req, res) {
  try {
    const student_id = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "month and year are required" });
    }

    const [rows] = await pool.query(queries.getStudentMonthlyBill, [student_id, month, year]);
    return res.status(200).json({ success: true, bills: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addFeedback(req, res) {
  try {
    const student_id = req.user.id;
    const { food_rating, hygiene_rating, comments } = req.body;

    if (food_rating == null || hygiene_rating == null) {
      return res.status(400).json({ error: "food_rating and hygiene_rating are required" });
    }

    await pool.query(queries.addFeedback, [student_id, food_rating, hygiene_rating, comments || ""]);
    return res.status(201).json({ success: true, message: "Feedback submitted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getFeedback(req, res) {
  try {
    const student_id = req.user.id;
    const [rows] = await pool.query(queries.getStudentFeedback, [student_id]);
    return res.status(200).json({ success: true, feedback: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSpecialMealHistory(req, res) {
  try {
    const student_id = req.user.id;
    const [rows] = await pool.query(queries.getSpecialMealHistoryByStudent, [student_id]);
    return res.status(200).json({ success: true, history: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function joinSpecialMeal(req, res) {
  try {
    const student_id = req.user.id;
    const { special_id } = req.body;

    if (!special_id) {
      return res.status(400).json({ error: "special_id is required" });
    }

    await pool.query(queries.joinSpecialMeal, [special_id, student_id]);
    return res.status(200).json({ success: true, message: "Joined special meal" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addSubscription(req, res) {
  try {
    const student_id = req.user.id;
    const { item_name, cost, start_date, end_date } = req.body;

    if (!item_name || cost == null || !start_date || !end_date) {
      return res.status(400).json({ error: "item_name, cost, start_date, and end_date are required" });
    }

    await pool.query(queries.addSubscription, [student_id, item_name, cost, start_date, end_date]);
    return res.status(201).json({ success: true, message: "Subscription added" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function openMessCard(req, res) {
  try {
    const student_id = req.user.id;
    const [activeRows] = await pool.query(queries.getActiveMessCardByStudent, [student_id]);

    if (activeRows.length > 0) {
      return res.status(400).json({ error: "An active mess card already exists" });
    }

    const [result] = await pool.query(queries.createMessCard, [student_id]);
    return res.status(201).json({ success: true, message: "Mess card opened", card_id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function closeMessCard(req, res) {
  try {
    const student_id = req.user.id;
    const [result] = await pool.query(queries.closeMessCard, [student_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No active mess card found to close" });
    }

    return res.status(200).json({ success: true, message: "Mess card closed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
