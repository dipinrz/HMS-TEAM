import { AppDataSource } from "../config/data-source";
import { Department } from "../entities/department.entity";

const deptRepo = AppDataSource.getRepository(Department);

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

    return await deptRepo.find();
}

export const updateDepartment = async (department_id: number, data: Partial<Department>) => {
    
    await deptRepo.update({ department_id }, data);

    return await deptRepo.findOneBy({ department_id});
}

export const deleteDepartmentById = async (id: number) => {

    return await deptRepo.delete({ department_id: id });
};

