const { Model } = require('objection')
import { Keyword } from './keyword'

export class Post extends Model {

    $parseDatabaseJson(json) {
        json = super.$parseDatabaseJson(json);
        console.log(json.metadata)
        if (json.metadata && typeof json.metadata == 'string') {
            console.log(json)
            json.metadata = JSON.parse(json.metadata)
        }
        return json;
    }

    $formatDatabaseJson(json, opt) {
        json = super.$formatDatabaseJson(json,opt);
        json.published_on = new Date(Number.parseInt(json.published_on)).toUTCString()
        json.scraped_on = new Date(Number.parseInt(json.scraped_on)).toUTCString()

        if (typeof json.metadata === 'object') json.metadata = JSON.stringify(json.metadata)

        return json
    }

    static get tableName() {
        return 'post';
    } 

    static get idColumn() {
        return 'postid';
    }

    static relationMappings = {
        keywords: {
          relation: Model.HasManyRelation,
          modelClass: Keyword,
          join: {
            from: 'post.postid',
            to: 'keyword.post_id'
          }
        }
      };

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
                metadata: { type: 'string|object' }
            }
        }
    }

}