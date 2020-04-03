const { Model } = require('objection')
import { Keyword } from './keyword'
import { PubSub , POST_ADDED , POST_REMOVED } from '../graphql/gql'

export class Post extends Model {

    $parseDatabaseJson(json) {
        json = super.$parseDatabaseJson(json);

        if (json.metadata && typeof json.metadata == 'string') {
            json.metadata = JSON.parse(json.metadata)
        }
        return json;
    }

    $parseJson(json) {
        json = super.$parseJson(json);

        if (Array.isArray(json.keywords)) {
            // we have keywords now let's iterate and fix them
            let finalKeywords = []
            json.keywords.forEach(element => {
                if (typeof element === 'object') {
                    if (element instanceof Keyword) finalKeywords.push(element)    // nothing to do here
                    // but if ☝ is false ... something is messed up so don't push anything
                } else if (typeof element === 'string') {
                    finalKeywords.push(Keyword.fromJson({"keyword" : element}));
                }
            });
            json.keywords = finalKeywords
        }

        return json
    }

    $formatDatabaseJson(json, opt) {
        json = super.$formatDatabaseJson(json,opt);
        json.published_on = new Date(Number.parseInt(json.published_on)).toUTCString()
        json.scraped_on = new Date(Number.parseInt(json.scraped_on)).toUTCString()

        if (typeof json.metadata === 'object') json.metadata = JSON.stringify(json.metadata)

        return json
    }

    static afterInsert(args) {
        PubSub.publish(POST_ADDED, {
            "postAdded": args.inputItems
        })
    }

    static afterDelete(args) {
        PubSub.publish(POST_REMOVED, {
            "postRemoved": args.items
        })
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
                source: { type: 'string'},
                source_link: { type: 'string' },
                keywords: { type: 'array'},
                published_on: { type: 'date'},
                scraped_on: { type: 'date'},
                metadata: { type: 'string|object' }
            }
        }
    }

}
