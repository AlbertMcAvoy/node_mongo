import {IUser, Users} from '~/types/users'
import {AbstractException} from "~/utils/exceptions";

export class UsersService {

    /**
     * Find all Users
     */
    async findAll() {
        try {
            return await Users.find({}, {'_id': false, '__v': false, 'password': false});
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Find a specific user
     * @param id - user's ID
     */
    async findOneById(id: string) {
        try {
            return await Users.findOne({uuid: id}, {'_id': false, '__v': false, 'password': false});
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findOneByCredentials(email: string, password: string) {
        try {
            return await Users.findOne({email: email, password: password});
        } catch (error) {
            console.log(error);
            throw error
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
            if (userData.uuid || userData.uuid == "") delete userData.uuid;
            let result = await Users.updateOne({uuid: id}, userData);
            if (!result.modifiedCount) throw new AbstractException('The user was not updated, nothing to update', 500);
            return this.findOneById(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Create a user
     *
     * @param userData - Object corresponding to a user, has not necessary a full user. Not taking ID.
     */
    async create(userData: IUser) {
        try {
            userData.uuid = String(Math.floor(Math.random() * 1000000));
            return (await Users.create(userData)).toJSON();
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     *
     * This method is used to check if a user exists or not.
     *
     * @param email - user's email
     */
    async findOneByEmail(email: string) {
        try {
            return await Users.findOne({email: email});
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    /**
     * Delete a user
     * @param id - Unique ID of user
     */
    async delete(id: number) {
        try {
            return await Users.findOneAndDelete({uuid: id});
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
