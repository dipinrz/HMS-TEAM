import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/user.entity";
import { Patient } from "../entities/patient.entity";
import { Doctor } from "../entities/doctor.entity";
import { Department } from "../entities/department.entity";
import { Appointment } from "../entities/appointment.entity";
import { MedicalReport } from "../entities/medicalReport.entity";
import { Prescription } from "../entities/prescription.entity";
import { Medication } from "../entities/medication.entity";
import { Medicine } from "../entities/medicine.entity";
import { Bill } from "../entities/bill.entity";
import { BillItem } from "../entities/billItem.entity";
import { Payment } from "../entities/payment.entity";
import { Notification } from "../entities/notification.entity";

dotenv.config();

// export const AppDataSource = new DataSource({
//     type: "postgres",
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || "5432"),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     synchronize: true,
//     logging: false,

//     entities: [User, Patient, Doctor, Department, Appointment, MedicalReport, Prescription, Medication, Medicine, Bill, BillItem, Payment,Notification],
// });




// import { DataSource } from "typeorm";
// import dotenv from "dotenv";

// import { User } from "../entities/user.entity";
// import { Patient } from "../entities/patient.entity";
// import { Doctor } from "../entities/doctor.entity";
// import { Department } from "../entities/department.entity";
// import { Appointment } from "../entities/appointment.entity";
// import { MedicalReport } from "../entities/medicalReport.entity";
// import { Prescription } from "../entities/prescription.entity";
// import { Medication } from "../entities/medication.entity";
// import { Medicine } from "../entities/medicine.entity";
// import { Bill } from "../entities/bill.entity";
// import { BillItem } from "../entities/billItem.entity";
// import { Payment } from "../entities/payment.entity";

// dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    entities: [User, Patient, Doctor, Department, Appointment, MedicalReport, Prescription, Medication, Medicine, Bill, BillItem, Payment, Notification],
});
