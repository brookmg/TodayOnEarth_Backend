const { Model } = require('objection')

export class Provider extends Model {

    static get tableName() {
        return 'provider';
    }

    static get idColumn() {
        return 'provider_id';
    }

    $formatJson(json) {
        json = super.$formatJson(json);
        json.added_on = new Date(json.added_on).getTime() / 1000;
        return json;
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['provider' , 'source' , 'added_on' , 'frequency'],
            properties: {
                provider_id: { type: 'integer'},
                provider: { type: 'string'},
                source: { type: 'string'}, // twitter , facebook , instagram or telegram
                uid: { type: 'integer' },
                added_on: { type: 'datetime' },
                frequency: { type: 'string'}    // once a day, twice a day, once per minute ...
            }
        }
    }

}
