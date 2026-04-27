 const sqlInit = `
    CREATE DATABASE IF NOT EXISTS mess_management;
    USE mess_management;

    CREATE TABLE IF NOT EXISTS hostel (
        hostel_id INT AUTO_INCREMENT PRIMARY KEY,
        hostel_name VARCHAR(100),
        location VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS student (
        student_id INT AUTO_INCREMENT PRIMARY KEY,
        hostel_id INT,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        room_no VARCHAR(20),
        FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
    );

    CREATE TABLE IF NOT EXISTS staff (
        staff_id INT AUTO_INCREMENT PRIMARY KEY,
        hostel_id INT,
        name VARCHAR(100),
        role VARCHAR(50),
        mail VARCHAR(100) ,
        FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
    );

    CREATE TABLE IF NOT EXISTS mess_card (
        card_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        status VARCHAR(20),
        open_date DATE,
        close_date DATE,
        total_active_days INT,
        FOREIGN KEY (student_id) REFERENCES student(student_id)
    );

    CREATE TABLE IF NOT EXISTS mess_card_history (
        history_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        open_date DATE,
        close_date DATE,
        days INT,
        FOREIGN KEY (student_id) REFERENCES student(student_id)
    );

    CREATE TABLE IF NOT EXISTS daily_expense (
        expense_id INT AUTO_INCREMENT PRIMARY KEY,
        hostel_id INT,
        date DATE,
        normal_expense DECIMAL(10,2),
        FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
    );

    CREATE TABLE IF NOT EXISTS special_meal (
        special_id INT AUTO_INCREMENT PRIMARY KEY,
        hostel_id INT,
        date DATE,
        meal_name VARCHAR(100),
        total_cost DECIMAL(10,2),
        total_plates INT,
        FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
    );

    CREATE TABLE IF NOT EXISTS special_meal_student (
        special_id INT,
        student_id INT,
        plates_taken INT,
        PRIMARY KEY (special_id, student_id),
        FOREIGN KEY (special_id) REFERENCES special_meal(special_id),
        FOREIGN KEY (student_id) REFERENCES student(student_id)
    );

    CREATE TABLE IF NOT EXISTS subscription (
        sub_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        item_name VARCHAR(50),
        cost DECIMAL(10,2),
        start_date DATE,
        end_date DATE,
        FOREIGN KEY (student_id) REFERENCES student(student_id)
    );

    CREATE TABLE IF NOT EXISTS bill (
        bill_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        month INT,
        year INT,
        normal_amount DECIMAL(10,2),
        special_amount DECIMAL(10,2),
        subscription_amount DECIMAL(10,2),
        total_amount DECIMAL(10,2),
        payment_status VARCHAR(20),
        FOREIGN KEY (student_id) REFERENCES student(student_id)
    );

    CREATE TABLE IF NOT EXISTS payment (
        payment_id INT AUTO_INCREMENT PRIMARY KEY,
        bill_id INT,
        amount DECIMAL(10,2),
        payment_date DATE,
        status VARCHAR(20),
        FOREIGN KEY (bill_id) REFERENCES bill(bill_id)
    );

    CREATE TABLE IF NOT EXISTS feedback (
        feedback_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        date DATE,
        food_rating INT,
        hygiene_rating INT,
        comments TEXT,
        FOREIGN KEY (student_id) REFERENCES student(student_id)
    );

    CREATE TABLE IF NOT EXISTS menu (
        menu_id INT AUTO_INCREMENT PRIMARY KEY,
        hostel_id INT,
        date DATE,
        day_of_week VARCHAR(20),
        meal_type VARCHAR(20),
        items TEXT,
        FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
    );



CREATE TABLE IF NOT EXISTS otp (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    otp_code VARCHAR(10),
    expires_at DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS mess_email_config (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT,
    email VARCHAR(100),
    password VARCHAR(255),
    smtp_host VARCHAR(100),
    smtp_port INT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hostel_id) REFERENCES hostel(hostel_id)
);
`;

export default sqlInit;