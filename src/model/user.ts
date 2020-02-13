const { Model } = require('objection')

export class User extends Model {

    static get tableName() {
        return 'user'
    }

    static get idColumn() {
        return 'uid'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email', 'first_name' , 'last_name', 'password_hash', 'username'],
            properties: {
                uid: { type: 'integer'},
                first_name: { type: 'string', minLength: 3},
                middle_name: { type: 'string' },
                last_name: { type: 'string', minLength: 2},
                email: { type: 'email', format: 'email' },
                role: { type: 'integer'},    //not used right now but in the future to have admin | pro | normal users
                phone_number: { type: 'string'},
                username: { type: 'string' },
                last_login_time: { type: 'date' },
                country: { type: 'string'},  // ISO3 or ISO2 of the country
                last_location: { type: 'string'}, // long,lat <- in that form
                password_hash: { type: 'string'},   //bcrypt all the way
            }
        }
    }


}