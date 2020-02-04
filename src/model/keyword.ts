const { Model } = require('objection')
import { Post } from './post';

export class Keyword extends Model {

    static get tableName() {
        return 'keyword';
    } 

    static get idColumn() {
        return 'keyword_id';
    }

    static relationMappings = {
        belongsto: {
          relation: Model.HasManyRelation,
          modelClass: Post,
          join: {
            from: 'keyword.post_id',
            to: 'post.postid'
          }
        }
      };

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['keyword_id' , 'keyword' , 'post_id'],
            properties: {
                keyword_id: { type: 'integer'},
                keyword: { type: 'string'},
                post_id: { type: 'integer' }
            }
        }
    }

}