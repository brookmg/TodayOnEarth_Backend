import { Model } from 'objection'

export class Login extends Model {

    static get tableName() {
        return 'login';
    }

    static get idColumn() {
        return 'login_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['token' , 'uid' , 'type', 'access_time'],
            properties: {
                login_id: { type: 'integer'},
                token: { type: 'string'},
                uid: { type: 'integer' },
                type: { type: 'integer'}, // 0 = NORMAL | 1 = PASSWORD RESET
                access_time: { type: 'datetime'},
                request_detail: { type: 'string'}, // Location , UserAgent and other details
            }
        }
    }

}
