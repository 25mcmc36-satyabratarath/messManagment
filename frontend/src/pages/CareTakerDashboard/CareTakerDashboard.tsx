import { useState, useEffect } from "react";
import "./CareTakerDashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatsCard from "../../components/StatsCard/StatsCard";
import {
  addNewStudent,
  getAllStudents,
  addNewCard,
  addExpense,
  getExpenses
} from "../../api/careTaker";

const CareTakerDashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    email: "",
    student_id: "",
    hostel_id: 1,
    room_no: ""
  });
  const [expenseFormData, setExpenseFormData] = useState({
    description: "",
    normal_expense: 0,
    category: "FOOD",
    date: new Date().toISOString().split("T")[0],
    mess_id: 1
  });

  useEffect(() => {
    fetchCareTakerData();
  }, []);

  const fetchCareTakerData = async () => {
    try {
      setLoading(true);
      const [studentsRes, expensesRes] = await Promise.all([
        getAllStudents(),
        getExpenses()
      ]);

      setStudents(studentsRes.data.students);
      setExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error("Error fetching care taker data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNewStudent(studentFormData);
      setStudentFormData({
        name: "",
        email: "",
        student_id: "",
        hostel_id: 1,
        room_no: ""
      });
      setShowAddStudent(false);
      fetchCareTakerData();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExpense(expenseFormData);
      setExpenseFormData({
        description: "",
        normal_expense: 0,
        category: "FOOD",
        date: new Date().toISOString().split("T")[0],
        mess_id: 1
      });
      setShowAddExpense(false);
      fetchCareTakerData();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  if (loading) {
    return <div className="caretaker-dashboard">Loading...</div>;
  }

console.log(students , expenses);

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.normal_expense || 0), 0);

  return (
    <div className="caretaker-dashboard">
      <Sidebar />

      <div className="content">
        <h1>Care Taker Dashboard</h1>
        <p style={{ color: "#666" }}>Manage students and hostel expenses</p>

        {/* STATS SECTION */}
       <div className="stats-container">
            <StatsCard title="Total Students" value={String(students.length)} />
            <StatsCard title="Total Expenses" value={`$${totalExpenses.toFixed(2)}`} />
            <StatsCard title="Active Cards" value={String(students.filter((s: any) => s.active_card).length)} />
        </div>

        {/* STUDENT MANAGEMENT */}
        <div className="card">
          <div className="card-header">
            <h3>Student Management</h3>
            <button
              className="btn-primary"
              onClick={() => setShowAddStudent(!showAddStudent)}
            >
              {showAddStudent ? "Cancel" : "+ Add Student"}
            </button>
          </div>

          {showAddStudent && (
            <form className="add-student-form" onSubmit={handleAddStudent}>
              <input
                type="text"
                placeholder="Student Name"
                value={studentFormData.name}
                onChange={(e) =>
                  setStudentFormData({ ...studentFormData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={studentFormData.email}
                onChange={(e) =>
                  setStudentFormData({ ...studentFormData, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Student ID"
                value={studentFormData.student_id}
                onChange={(e) =>
                  setStudentFormData({ ...studentFormData, student_id: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Room Number"
                value={studentFormData.room_no}
                onChange={(e) =>
                  setStudentFormData({ ...studentFormData, room_no: e.target.value })
                }
              />
              <button type="submit" className="btn-primary">
                Add Student
              </button>
            </form>
          )}

          <div className="students-list">
            {students.length === 0 ? (
              <p>No students added yet.</p>
            ) : (
              students.map((student: any) => (
                <div key={student.id} className="student-item">
                  <div>
                    <strong>{student.name}</strong>
                    <p>ID: {student.student_id}</p>
                    <p>{student.email}</p>
                    {student.room_no && (
                      <p className="room-info">Room: {student.room_no}</p>
                    )}
                  </div>
                  <span className={`badge ${student.active_card ? "badge-success" : "badge-warning"}`}>
                    {student.active_card ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* EXPENSE MANAGEMENT */}
        <div className="card">
          <div className="card-header">
            <h3>Expense Management</h3>
            <button
              className="btn-primary"
              onClick={() => setShowAddExpense(!showAddExpense)}
            >
              {showAddExpense ? "Cancel" : "+ Add Expense"}
            </button>
          </div>

          {showAddExpense && (
            <form className="add-expense-form" onSubmit={handleAddExpense}>
              <input
                type="text"
                placeholder="Description"
                value={expenseFormData.description}
                onChange={(e) =>
                  setExpenseFormData({ ...expenseFormData, description: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Amount"
                step="0.01"
                value={expenseFormData.amount}
                onChange={(e) =>
                  setExpenseFormData({ ...expenseFormData, amount: parseFloat(e.target.value) })
                }
                required
              />
              <select
                value={expenseFormData.category}
                onChange={(e) =>
                  setExpenseFormData({ ...expenseFormData, category: e.target.value })
                }
              >
                <option value="FOOD">Food</option>
                <option value="SUPPLIES">Supplies</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="UTILITIES">Utilities</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="date"
                value={expenseFormData.date}
                onChange={(e) =>
                  setExpenseFormData({ ...expenseFormData, date: e.target.value })
                }
                required
              />
              <button type="submit" className="btn-primary">
                Add Expense
              </button>
            </form>
          )}

          <div className="expenses-list">
            {expenses.length === 0 ? (
              <p>No expenses recorded yet.</p>
            ) : (
              expenses.map((expense: any) => (
                <div key={expense.id} className="expense-item">
                  <div>
                    <strong>{expense.description}</strong>
                    <p>Date: { new Date(expense.date).toISOString().split('T')[0]}</p>
                    <p>Category: {expense.category}</p>
                  </div>
                  <div className="amount">
                    <strong>${Number(expense.normal_expense || 0).toFixed(2)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareTakerDashboard;
