import { Post } from '../model/post'
import { KnexI } from './db'
import { Keyword } from '../model/keyword';
import { forEach } from '../utils'

Post.knex(KnexI);
Keyword.knex(KnexI);

// --- Create scheme functions ----

/*
    INSERT INTO post (title, body, provider, source_link, published_on, scraped_on, metadata) 
    VALUES ('Money and time' , 'Anne Marie new music was just released today.' , 'genius' , 
    'https://genius.com/feed/annie-84522' , '2020-02-04 00:00:00', '2020-02-04 00:00:00', 
    '{ \"metadata\" : {}}');
*/

const acceptedProperties = [
    'title' , 'body' , 'provider' , 'source' , 'keyword' , 'published_on' , 'scraped_on', 'metadata',
    '_title' , '_body' , '_provider' , '_source' , '_keyword' , '_published_on' , '_scraped_on'
];
const acceptedConnectors = ['AND' , 'OR', ''];

interface QueryObject {
    title?: string,
    body?: string,
    provider?: string,
    source?: string,
    keyword?: string,
    published_on?: string,
    scraped_on?: string,
    metadata?: string,

    _title?: string,
    _body?: string,
    _provider?: string,
    _source?: string,
    _keyword?: string,
    _published_on?: string,
    _scraped_on?: string,
    
    connector: string
}

export async function createPostScheme() : Promise<any> {
    let exists = await KnexI.schema.hasTable('post');
    if (exists) return; // We don't need to create it again

    return KnexI.schema.createTable('post', table => {
        table.increments('postid').primary();

        table.text('title', 'longtext');
        table.text('body', 'longtext');
        table.text('provider', 'longtext');
        table.text('source_link', 'mediumtext').unique();

        table.dateTime('published_on');
        table.dateTime('scraped_on');

        table.text('metadata', 'longtext');
    })

}

export async function insertPost(postData) : Promise<Post> {
    return createPostScheme().then(() => Post.query().insertGraph(postData));
}

export async function getAllPostsGraphed() : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).distinct([`post.*`])
}

export async function deletePost(postid: number) : Promise<number> {
    return Post.query().deleteById(postid);
}

export async function getAllPosts() : Promise<Post[]> {
    return Post.query();
}

export async function getPostWithKeyword(keyword: String) : Promise<Post[]> {
    return Post.query().findByIds(
        Keyword.query().where('keyword' , keyword).select('post_id')
    ).withGraphFetched({
        keywords: true
    })
}

export async function getPostById(postid: number) : Promise<Post> {
    return Post.query().findById(postid).withGraphFetched({
        keywords: true
    }).distinct([`post.*`]);
}

export async function getAllPostsFromProvider(provider: string) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('provider' , provider).distinct([`post.*`]);
}

export async function getAllPostsFromSource(source: string) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('source_link' , 'like' ,  `%${source}%`).distinct([`post.*`]);
}

export async function getAllPostsWithTitle(title: string) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('title' , 'like' ,  `%${title}%`).distinct([`post.*`]);
}

export async function getAllPostsWithBody(body: string) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('body' , 'like' ,  `%${body}%`).distinct([`post.*`]);
}

async function getWhereValues(processFrom: string[]) : Promise<string[]> {
    let returnable = [];
    console.log(processFrom);
    if (processFrom.length < 2) throw new Error('query builder: something went wrong while building query');

    switch(Number.parseInt(processFrom[0] , 10)) {
        case 0: await returnable.push(['title' , 'LIKE' , `%${processFrom[1]}%`]); break;
        case 1: await returnable.push(['body' , 'LIKE' , `%${processFrom[1]}%`]); break;
        case 2: await returnable.push(['provider' , 'LIKE' , `%${processFrom[1]}%`]); break;
        case 3: await returnable.push(['source_link' , 'LIKE' , `%${processFrom[1]}%`]); break;

        case 4: await returnable.push(['keywords.keyword' , 'LIKE' , `%${processFrom[1]}%`]); break;
        case 5: await returnable.push(['published_on' , '>=' , new Date(Number(processFrom[1])).toUTCString()]); break;
        case 6: await returnable.push(['scraped_on' , '>=' , new Date(Number(processFrom[1])).toUTCString()]); break;
        case 7: await returnable.push(['metadata', '~*' , `${processFrom[1]}`]); break;

        case 8: await returnable.push(['title' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;
        case 9: await returnable.push(['body' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;
        case 10: await returnable.push(['provider' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;
        case 11: await returnable.push(['source_link' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;

        case 12: await returnable.push(['keywords.keyword' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;
        case 13: await returnable.push(['published_on' , '<' , new Date(Number(processFrom[1])).toUTCString()]); break;
        case 14: await returnable.push(['scraped_on' , '<' , new Date(Number(processFrom[1])).toUTCString()]); break;
        default: await returnable.push(['' , '' , '']);
    }

    return returnable;
}

export async function getPostsCustom(jsonQuery: QueryObject[]): Promise<Post[]> {
    if (jsonQuery.length === 0) return getAllPosts();  // if the query was []
    let qBuilder = Post.query().withGraphFetched({
        keywords: true
    }, {joinOperation: 'innerJoin'}).distinct('post.*');

    await forEach(jsonQuery, async (operationItem: QueryObject) => {

        let props = Object.keys(operationItem);
        let prevConnector = "";

        if (props.length < 2 || !acceptedProperties.includes(props[0]) || props[1] !== 'connector') {
            throw new Error(`parse error: Malformed properties found in operation: ${operationItem}`)
        }

        if (!acceptedConnectors.includes(operationItem[props[1]])) {
            throw new Error(`parse error: An unknown connector found in operation: ${operationItem[props[1]]}`)
        }

        // check connector field
        let thisIndex = jsonQuery.indexOf(operationItem);
        if (thisIndex > 0 && jsonQuery[thisIndex-1].connector) {
            prevConnector = jsonQuery[thisIndex-1].connector
        }

        let indexOfProp = acceptedProperties.indexOf(props[0]);
        if (operationItem[props[0]] === null || operationItem[props[0]] === undefined
            || operationItem[props[0]] === "") {
            throw new Error(`parse error: Wrong value passed for property ${props[0]}`)
        }

        if (prevConnector === 'AND' || prevConnector === '') {
            // we have an and connector so use `andWhere`
            let whereArgs = (await getWhereValues([indexOfProp , operationItem[props[0]]]))[0];
            if (whereArgs[0].startsWith('keyword')) qBuilder.joinRelated('keywords');
            qBuilder.andWhere(whereArgs[0] , whereArgs[1] , whereArgs[2]);
        } else if (prevConnector === 'OR') {
            // we have an or connector so use `orWhere`
            let whereArgs = (await getWhereValues([indexOfProp , operationItem[props[0]]]))[0];
            if (whereArgs[0].startsWith('keyword')) qBuilder.joinRelated('keywords');
            qBuilder.orWhere(whereArgs[0] , whereArgs[1] , whereArgs[2]);
        } else {
            throw new Error(`parse error: Connector value not identified`);
        }

    });

    return qBuilder
}

export async function getAllPostsBeforeScrapedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '<' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsSinceScrapedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '>=' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsOnScrapedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '=' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsBeforePublishedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('published_on' , '<' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsSincePublishedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('published_on' , '>=' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsOnPublishedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('published_on' , '=' , new Date(time)).distinct([`post.*`]);
}

export async function updatePostById(postid: number , update: Post) : Promise<Post> {
    return Post.query()
        .updateAndFetchById(postid, update);
}
