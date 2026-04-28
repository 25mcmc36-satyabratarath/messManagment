import queries from "../db/user.query.js";
import { pool } from "../index.js";

async function getHostelIdForUser(userId) {
  const [rows] = await pool.query(queries.getStaffById, [userId]);
  if (!rows.length) {
    return null;
  }
  return rows[0].hostel_id;
}

export async function removeStaff(req, res) {
  try {
    const staffId = parseInt(req.params.id, 10);
    if (!staffId) {
      return res.status(400).json({ error: "Invalid staff id" });
    }

    const [result] = await pool.query(queries.deleteStaff, [staffId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json({ message: "Staff removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove staff" });
  }
}

export async function getMessSummary(req, res) {
  try {
    const hostelId = await getHostelIdForUser(req.user.id);
    if (!hostelId) {
      return res.status(404).json({ error: "Warden hostel not found" });
    }

    const [rows] = await pool.query(queries.getMessSummaryByHostel, [hostelId, hostelId, hostelId, hostelId]);
    const summary = rows[0] || {
      total_students: 0,
      active_cards: 0,
      closed_cards: 0,
      total_cards: 0
    };

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch mess summary" });
  }
}

export async function getAllMessActiveCards(req, res) {
  try {
    const hostelId = await getHostelIdForUser(req.user.id);
    if (!hostelId) {
      return res.status(404).json({ error: "Warden hostel not found" });
    }

    const [rows] = await pool.query(queries.getActiveMessCardsByHostel, [hostelId]);
    res.json({ cards: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch active mess cards" });
  }
}

export async function updateEmailConfig(req, res) {
  try {
    const configId = parseInt(req.params.mess_id, 10);
    const { email, smtp_host, smtp_port, password, is_active } = req.body;

    if (!configId || !email) {
      return res.status(400).json({ error: "Config id and email are required" });
    }

    const [existing] = await pool.query(queries.getMessEmailConfigById, [configId]);
    if (!existing.length) {
      return res.status(404).json({ error: "Mess email config not found" });
    }

    const activeFlag = typeof is_active === "boolean" ? is_active : existing[0].is_active;
    const smtpPortValue = smtp_port ? parseInt(smtp_port, 10) : existing[0].smtp_port;
    const passwordValue = password || existing[0].password;
    const smtpHostValue = smtp_host || existing[0].smtp_host;

    await pool.query(queries.updateMessEmailConfig, [
      email,
      smtpHostValue,
      smtpPortValue,
      passwordValue,
      activeFlag,
      configId
    ]);

    res.json({ message: "Mess email configuration updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update mess email config" });
  }
}
