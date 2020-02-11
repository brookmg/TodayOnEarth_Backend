const { Model } = require('objection')

export class Keyword extends Model {

    static get tableName() {
        return 'keyword';
    } 

    static get idColumn() {
        return 'keyword_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['keyword'],
            properties: {
                keyword_id: { type: 'integer'},
                keyword: { type: 'string'},
                post_id: { type: 'integer' }
            }
        }
    }

}