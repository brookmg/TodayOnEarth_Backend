const { Model } = require('objection')
import { Keyword } from './keyword'

export class Post extends Model {

    $parseJson(json, opt) {
        // one thing objection really lacks is to handle date 
        // datatype converstions so we will do it here
        
        json = super.$parseJson(json, opt);

        json.metadata = JSON.parse(json.metadata)

        return json;
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
                metadata: { type: 'string' }
            }
        }
    }

}