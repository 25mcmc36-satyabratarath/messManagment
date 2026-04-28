import queries from "../db/db.mess_secretary.js";
import { pool } from "../index.js";

export async function getActiveCards(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "Query parameter 'date' is required" });
    }

    const [rows] = await pool.query(queries.getActiveCardsByDate, [date, date]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getNetCard(req, res) {
  try {
    const [rows] = await pool.query(queries.getNetCard);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getRation(req, res) {
  try {
    const [rows] = await pool.query(queries.getRationSummary);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addRationConsumption(req, res) {
  try {
    const { hostel_id, date, normal_expense } = req.body;
    if (!hostel_id || !date || normal_expense == null) {
      return res.status(400).json({ success: false, message: "hostel_id, date, and normal_expense are required" });
    }

    await pool.query(queries.insertRationConsumption, [hostel_id, date, normal_expense]);
    return res.status(201).json({ success: true, message: "Ration consumption added" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSpecialMealSummary(req, res) {
  try {
    const [rows] = await pool.query(queries.getSpecialMealSummary);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createSpecialMeal(req, res) {
  try {
    const { hostel_id, date, meal_name, total_cost, total_plates } = req.body;
    if (!hostel_id || !date || !meal_name || total_cost == null || total_plates == null) {
      return res.status(400).json({ success: false, message: "hostel_id, date, meal_name, total_cost, and total_plates are required" });
    }

    await pool.query(queries.insertSpecialMeal, [hostel_id, date, meal_name, total_cost, total_plates]);
    return res.status(201).json({ success: true, message: "Special meal created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSpecialMeals(req, res) {
  try {
    const [rows] = await pool.query(queries.getSpecialMeals);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addSpecialMealStudent(req, res) {
  try {
    const specialId = parseInt(req.params.id, 10);
    const { student_id, plates_taken } = req.body;
    if (!specialId || !student_id || plates_taken == null) {
      return res.status(400).json({ success: false, message: "special_id, student_id, and plates_taken are required" });
    }

    await pool.query(queries.insertSpecialMealStudent, [specialId, student_id, plates_taken]);
    return res.status(201).json({ success: true, message: "Student added to special meal" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addWeeklyExpense(req, res) {
  try {
    const { hostel_id, date, normal_expense } = req.body;
    if (!hostel_id || !date || normal_expense == null) {
      return res.status(400).json({ success: false, message: "hostel_id, date, and normal_expense are required" });
    }

    await pool.query(queries.insertWeeklyExpense, [hostel_id, date, normal_expense]);
    return res.status(201).json({ success: true, message: "Weekly expense added" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getWeeklyExpense(req, res) {
  try {
    const [rows] = await pool.query(queries.getWeeklyExpense);
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
