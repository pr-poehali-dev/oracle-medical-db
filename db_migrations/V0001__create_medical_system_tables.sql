-- Пациенты
CREATE TABLE IF NOT EXISTS Patients (
    patient_id SERIAL PRIMARY KEY,
    full_name VARCHAR(300) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    passport_info VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Специализации врачей
CREATE TABLE IF NOT EXISTS Specializations (
    specialization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

-- Врачи
CREATE TABLE IF NOT EXISTS Doctors (
    doctor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(300) NOT NULL,
    patronym VARCHAR(100),
    specialization_id INT REFERENCES Specializations(specialization_id),
    phone VARCHAR(20),
    office_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Отделения
CREATE TABLE IF NOT EXISTS Departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(300),
    doctor_id INT REFERENCES Doctors(doctor_id)
);

-- Диагнозы
CREATE TABLE IF NOT EXISTS Diagnoses (
    diagnoses_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    notes VARCHAR(350)
);

-- Заболевания
CREATE TABLE IF NOT EXISTS Diseases (
    diseases_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(300),
    notes VARCHAR(350),
    diagnoses_id INT REFERENCES Diagnoses(diagnoses_id)
);

-- Приёмы
CREATE TABLE IF NOT EXISTS Appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Patients(patient_id),
    doctor_id INT REFERENCES Doctors(doctor_id),
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Медицинские карты
CREATE TABLE IF NOT EXISTS MedicalRecords (
    record_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Patients(patient_id),
    doctor_id INT REFERENCES Doctors(doctor_id),
    appointment_id INT REFERENCES Appointments(appointment_id),
    diagnoses_id INT REFERENCES Diagnoses(diagnoses_id),
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Медикаменты
CREATE TABLE IF NOT EXISTS Medications (
    medication_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    dosage VARCHAR(255)
);

-- Формы медикаментов
CREATE TABLE IF NOT EXISTS Forms (
    form_id SERIAL PRIMARY KEY,
    medication_id INT REFERENCES Medications(medication_id),
    name VARCHAR(255),
    form VARCHAR(255),
    color VARCHAR(255),
    shape VARCHAR(255)
);

-- Рецепты
CREATE TABLE IF NOT EXISTS Prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    record_id INT REFERENCES MedicalRecords(record_id),
    medication_id INT REFERENCES Medications(medication_id),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration_days INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Услуги
CREATE TABLE IF NOT EXISTS Services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2),
    descriptions VARCHAR(350)
);

-- Услуги в приёмах
CREATE TABLE IF NOT EXISTS AppointmentServices (
    appointment_services_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES Appointments(appointment_id),
    service_id INT REFERENCES Services(service_id),
    quantity INT DEFAULT 1
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON Patients(full_name);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON Appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON Appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON Appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON MedicalRecords(patient_id);
