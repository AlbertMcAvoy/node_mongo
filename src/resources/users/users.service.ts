import {IUser, Users} from '~/types/users'
import {AbstractException} from "~/utils/exceptions";

export class UsersService {

    /**
     * Find all Users
     */
    async findAll() {
        return Users.find({}, {'_id': false, '__v': false, 'password': false});
    }

    /**
     * Find a specific user
     * @param id - user's ID
     */
    async findOneById(id: string) {
        return Users.findOne({uuid: id}, {'_id': false, '__v': false, 'password': false});
    }

    async findOneByCredentials(email: string, password: string) {
        return Users.findOne({email: email, password: password});
    }

    /**
     * Update a particular user
     *
     * @param userData - Object corresponding to a user, has not necessary a full user. Not taking ID.
     * @param id - unique ID of user
     */
    async update(userData: Partial<IUser>, id: string) {
        if (userData.uuid || userData.uuid == "") delete userData.uuid;
        let result = await Users.updateOne({uuid: id}, userData);
        if (!result.modifiedCount) throw new AbstractException('The user was not updated, nothing to update', 500);
        return this.findOneById(id);
    }

    /**
     * Create a user
     *
     * @param userData - Object corresponding to a user, has not necessary a full user. Not taking ID.
     */
    async create(userData: IUser) {
        userData.uuid = String(Math.floor(Math.random() * 1000000));
        return (await Users.create(userData)).toJSON();
    }

    /**
     *
     * This method is used to check if a user exists or not.
     *
     * @param email - user's email
     */
    async findOneByEmail(email: string) {
        return Users.findOne({email: email});
    }

    /**
     * Delete a user
     * @param id - Unique ID of user
     */
    async delete(id: number) {
        return Users.findOneAndDelete({uuid: id});
    }
}
