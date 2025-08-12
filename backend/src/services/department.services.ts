import { AppDataSource } from "../config/data-source";
import { Department } from "../entities/department.entity";
import { Doctor } from "../entities/doctor.entity";

const deptRepo = AppDataSource.getRepository(Department);
const doctorRepo = AppDataSource.getRepository(Doctor);

export const createDepartment = async (department: Partial<Department>) => {
    
    const newDepartment = deptRepo.create(department);

    return await deptRepo.save(newDepartment);
}

export const getDeptByName =  async (name: string) => {

    return await deptRepo.findOneBy({ name: name });
}

export const getDepartmentById = async (id: number) => {

    return await deptRepo.findOneBy({ department_id: id })
}

export const getAllDepartments =  async () => {

    return await deptRepo.find({relations:['head_doctor','head_doctor.user']});
}

export const updateDepartment = async (department_id: number, data: Partial<Department>) => {
    
    await deptRepo.update({ department_id }, data);

    return await deptRepo.findOneBy({ department_id});
}

export const deleteDepartmentById = async (id: number) => {

    return await deptRepo.delete({ department_id: id });
};

export const getDoctorsByDepartmentId = async (id: number) => {
    return await doctorRepo.find({
        where: {
            department: {department_id: id}
        }
    })
}
