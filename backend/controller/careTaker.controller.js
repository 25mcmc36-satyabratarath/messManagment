import pool from "../db/db.init.js";
import queries from "../db/user.query.js";
export const addNewStudent = async (req, res) => {
    try {
        const { name, email, hostel_id } = req.body;

        if (!name || !email || !hostel_id) {
            return res.status(400).json({
                error: "All fields required"
            });
        }
        const [result] = await pool.query(queries.addNewStudent, [name, email, hostel_id]);

        res.status(201).json({
            message: "Student added successfully",
            student_id: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to add student"
        });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const [rows] = await pool.query(queries.getAllStudents);
        res.json({
            students: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({  error: "Server Error" });
    }
};

export const addNewCard = async (req, res) => {
    try {
        const { student_id  } = req.body;
        if (!student_id) {
            return res.status(400).json({
                error: "All fields required"
            });
        }

        const [result] = await pool.query(queries.createMessCard, [student_id]);  
        res.status(201).json({
            message: "Mess card created successfully",
            card_id: result.insertId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create mess card" });
    }  
};

export const addExpense = async (req, res) => {
    try {
        const { date, normal_expense } = req.body;

        if (!date || !normal_expense) {
            return res.status(400).json({
                error: "Date and normal_expense required"
            });
        }

        // Get hostel_id from staff
        const [staff] = await pool.query(queries.getStaffById, [req.user.id]);
        if (!staff.length) {
            return res.status(404).json({ error: "Staff not found" });
        }

        const hostel_id = staff[0].hostel_id;

        const [result] = await pool.query(queries.addExpense, [hostel_id, date, normal_expense]);

        res.status(201).json({
            message: "Expense added successfully",
            expense_id: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to add expense"
        });
    }
};

export const getExpenses = async (req, res) => {
    try {
        // Get hostel_id from staff
        const [staff] = await pool.query(queries.getStaffById, [req.user.id]);
        if (!staff.length) {
            return res.status(404).json({ error: "Staff not found" });
        }

        const hostel_id = staff[0].hostel_id;

        const [rows] = await pool.query(queries.getExpensesByHostel, [hostel_id]);
        res.json({
            expenses: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

