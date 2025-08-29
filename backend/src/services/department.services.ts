import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { Department } from "../entities/department.entity";
import { Doctor } from "../entities/doctor.entity";
import { ApiError } from "../utils/apiError";

const deptRepo = AppDataSource.getRepository(Department);
const doctorRepo = AppDataSource.getRepository(Doctor);
const appointmentRepo = AppDataSource.getRepository(Appointment);

export const createDepartment = async (department: Partial<Department>) => {
  console.log("=====", department);

  const newDepartment = deptRepo.create(department);

  return await deptRepo.save(newDepartment);
};

export const getDeptByName = async (name: string) => {
  return await deptRepo.findOneBy({ name: name });
};

export const getDepartmentById = async (id: number) => {
  return await deptRepo.findOneBy({ department_id: id });
};

export const getDepartmentByDoctorId = async (id: number) => {
  const doctor = await doctorRepo.findOne({
    where: { doctor_id: id },
    relations: ["department"],
  });

  return doctor.department;
};

export const getAllDepartments = async () => {
  return await deptRepo.find({
    relations: ["head_doctor", "head_doctor.user"],
  });
};

export const updateDepartment = async (
  department_id: number,
  data: Partial<Department>
) => {
  await deptRepo.update({ department_id }, data);

  return await deptRepo.findOneBy({ department_id });
};

export const deleteDepartmentById = async (id: number) => {
  return await deptRepo.delete({ department_id: id });
};

export const getDoctorsByDepartmentId = async (id: number) => {
  return await doctorRepo.find({
    where: {
      department: { department_id: id },
    },
    relations: ["user"],
  });
};

export const getDepartmentsWithAppointmentCountService = async () => {
  const departments = await deptRepo.find();

  let totalAppointments = 0;

  const result = await Promise.all(
    departments.map(async (dept) => {
      const count = await appointmentRepo.count({
        where: { department: { department_id: dept.department_id } },
      });

      totalAppointments += count;

      return {
        department_id: dept.department_id,
        department_name: dept.name,
        appointment_count: count,
      };
    })
  );

  return {
    total_appointments: totalAppointments,
    departments: result,
  };
};

export const getDepartmentsAndItsDoctorsService = async () => {
  const department = await deptRepo.find({
    relations: ["doctors", "doctors.user"],
  });

  if (!department) {
    throw new ApiError("Departments and doctors not found", 404);
  }

  const formatted = department.map((dept) => ({
    department_id: dept.department_id,
    department_name: dept.name,
    doctors: dept.doctors.map((doc) => ({
      name: `${doc.user.first_name} ${doc.user.last_name}`,
      specialization: doc.specialization,
      years_of_experience: doc.years_of_experience,
    })),
  }));

  return formatted;
};

export const saveDoctorDepartment = async (
  id: number,
  department_name: string
) => {
  const doctor = await doctorRepo.findOne({ where: { doctor_id: id } });
  const Department = await deptRepo.findOne({
    where: { name: department_name },
  });

  if (!doctor) throw new Error("Doctor not found");

  doctor.department = Department;
  return await doctorRepo.save(doctor);
};
