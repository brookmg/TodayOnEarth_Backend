import { Model } from 'objection'

export class Token extends Model {

    static get tableName() {
        return 'token'
    }

    static get idColumn() {
        return 'id'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['uid'],
            properties: {
                uid: { type: 'integer'},
                google: { type: 'string'},
                facebook: { type: 'string'},    // 0Auth tokens probably spaced by a | or ,
                twitter: { type: 'string'}, // 0Auth tokens probably spaced by a | or ,
                instagram: { type: 'string'} // 0Auth tokens probably spaced by a | or ,
            }
        }
    }

}
