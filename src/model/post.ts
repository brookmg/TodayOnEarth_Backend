const { Model } = require('objection')

export class Post extends Model {

    static get tableName() {
        return 'post';
    } 

    static get idColumn() {
        return 'postid';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['provider' , 'source_link' , 'published_on' , 'scraped_on'],
            properties: {
                postid: { type: 'interger' },
                title: { type: 'string' },
                body: { type: 'string' },
                provider: { type: 'string' },
                source_link: { type: 'string' }, 
                published_on: { type: 'date'},
                scraped_on: { type: 'date'},
                metadata: { type: 'string' }
            }
        }
    }

}