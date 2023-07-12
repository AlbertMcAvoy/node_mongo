import {IUser, Users} from '~~/types/Users'

export class UsersService {

    /**
     * Find all Users
     */
    async findAll() {
        try {
            return await Users.find();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Find a specific user
     * @param id - user's ID
     */
    async findOne(id: string) {
        try {
            return await Users.findOne({uuid: id});
        } catch (error) {
            console.log(error);
        }
    }

    async findOneByCredentials(email: string, password: string) {
        try {
            return await Users.findOne({email: email, password: password});
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Update a particular user
     *
     * @param userData - Object corresponding to a user, has not necessary a full user. Not taking ID.
     * @param id - unique ID of user
     */
    async update(userData: Partial<IUser>, id: string) {
        try {
            return await Users.updateOne({uuid: id}, userData);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Create a user
     *
     * @param userData - Object corresponding to a user, has not necessary a full user. Not taking ID.
     */
    async create(userData: IUser) {
        try {
            return await Users.create(userData);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Delete a user
     */
    async delete(id: number) {
        try {
            return await Users.findOneAndDelete({uuid: id});
        } catch (error) {
            console.log(error);
        }
    }
}
