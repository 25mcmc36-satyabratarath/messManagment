import axiosInstance from "./axiosInstance";

// ===== Student Management =====
export const addNewStudent = (data: {
  name: string;
  email: string;
  student_id: string;
  hostel_id: number;
  room_no?: string;
}) => axiosInstance.post("/careTaker/add-new-student", data);

export const getAllStudents = () =>
  axiosInstance.get("/careTaker/get-all-student-details");


export const addNewCard = (data: {
  student_id: number;
  mess_id: number;
  start_date: string;
  end_date?: string;
}) => axiosInstance.post("/careTaker/add-new-card", data);

// ===== Expense Management =====
export const addExpense = (data: {
  description: string;
  normal_expense: number;
  category: string;
  date: string;
  mess_id: number;
}) => axiosInstance.post("/careTaker/add-expense", data);

export const getExpenses = (filters?: {
  mess_id?: number;
  category?: string;
  start_date?: string;
  end_date?: string;
}) => {
  return axiosInstance.get("/careTaker/get-expense", {
    params: filters
  });
};
