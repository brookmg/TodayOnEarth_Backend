const { Model } = require('objection');

export class Interest extends Model {

    static get tableName() {
        return 'interest';
    } 

    static get idColumn() {
        return 'interest_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['interest' , 'score'],
            properties: {
                interest_id: { type: 'integer'},
                interest: { type: 'string'},
                score: { type: 'float'},
                uid: { type: 'integer' }
            }
        }
    }

}