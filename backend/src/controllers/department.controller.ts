import { Request, Response, NextFunction} from "express";
import { createDepartment, deleteDepartmentById, getAllDepartments, getDepartmentByHeadDoctor, getDepartmentById, getDepartmentsAndItsDoctorsService, getDepartmentsWithAppointmentCountService, getDeptByName, getDoctorsByDepartmentId, getDoctorWithDepartment, saveDoctorDepartment, updateDepartment } from "../services/department.services";
import { ApiError } from "../utils/apiError";
import { getDoctorById } from "../services/doctor.services";


export const addDepartmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, consultation_fee, head_doctor } = req.body;

    const deptExisting = await getDeptByName(name);
    if (deptExisting) {
      throw new ApiError("Department already exists", 400);
    }

    let departmentData;
    let updateDoctorDepartment = null;

    if (head_doctor) {
      const headDoctor = await getDoctorById(head_doctor);

      if (!headDoctor) {
        throw new ApiError("Head doctor not found", 404);
      }



      departmentData = await createDepartment({
        name,
        description,
        consultation_fee,
        head_doctor,
      });

      updateDoctorDepartment = await saveDoctorDepartment(
        head_doctor,
        departmentData.department_id
      );
    } else {
      departmentData = await createDepartment({
        name,
        description,
        consultation_fee,
        head_doctor: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Department created successfully",
      data: {
        department: departmentData,
        updateDoctorDepartment,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const fetchAllDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        
        const departmentData = await getAllDepartments();

        if(!departmentData){
            throw new ApiError('Department data not found', 404);
        }

        res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: {
                departments: departmentData
            }
        });

    } catch (error) {
        next(error);
    }

} 

export const removeDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {

     try {

        const department_id  = Number(req.params.departmentId)

        if (isNaN(department_id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const department = await getDepartmentById(department_id);
        if (!department) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await deleteDepartmentById(department_id);

        res.status(200).json({
            success: true,
            message: "Departments deleted successfully",
            
        })
    } catch (error) {
        next(error);
    }
}


export const updateDepartmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const department_id = Number(req.params.departmentId);
    const { name, description, consultation_fee, head_doctor } = req.body;

    if (isNaN(department_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const existingDepartment = await getDepartmentById(department_id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    if (head_doctor) {
      const hodDepartment = await getDepartmentByHeadDoctor(head_doctor);
      if (hodDepartment && hodDepartment.department_id !== department_id) {
        return res.status(400).json({
          success: false,
          message: "This doctor is already HOD of another department",
        });
      }

      const doctor = await getDoctorWithDepartment(head_doctor);
      if (doctor && doctor.department && doctor.department.department_id !== department_id) {
        return res.status(400).json({
          success: false,
          message: "This doctor is already working in another department",
        });
      }
    }

    const departmentData = {
      name,
      description,
      consultation_fee,
      head_doctor,
    };

    const updatedDepartment = await updateDepartment(department_id, departmentData);

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error) {
    next(error);
  }
};


export const getDoctorsByDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const department_id = Number(req.params.departmentId);

        if (isNaN(department_id)) {
            return res.status(400).json({ success: false, message: "Invalid department ID" });
        }

        const doctors = await getDoctorsByDepartmentId(department_id);

        if(!doctors){
            throw new ApiError('Doctors not found', 404);
        }

        res.status(201).json({
            success: true,
            message: 'Doctors fetched successfully',
            doctors
        })

    } catch(error) {
        next(error);
    }
}

export const getDepartmentAndAppointmentCount = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const data = await getDepartmentsWithAppointmentCountService();

        res.status(200).json({
            success: true,
            message: 'Departments with appointment count fetched successfully',
            data
        });

    } catch (error) {
        next(error);
    }
}


export const getDepartmentsAndItsDoctors = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const data = await getDepartmentsAndItsDoctorsService()

        res.status(200).json({
            message:"Department and its Doctors fetched successfully",
            data
        })

    }catch(error){
        next(error)
    }
}