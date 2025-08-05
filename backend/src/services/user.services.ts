import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

const userRepo = AppDataSource.getRepository(User)


export const getUserByEmail = async (email: string) => {

    return await userRepo.findOneBy({ email: email })
}

export const getUserById = async (id: number) => {

    return await userRepo.findOneBy({ user_id: id })
}


export const createUser = async (userData: Partial<User>) => {

    const newUser = userRepo.create(userData)

    return await userRepo.save(newUser)

}

export const updateUser = async (user_id: number, updatedUser: Partial<User>) => {

    return await userRepo.update(
        { user_id },
        updatedUser
    )
}