import {Post} from '../model/post'
import {KnexI} from './db'
import {Keyword} from '../model/keyword';
import {forEach} from '../utils'
import {getProvidersForUser, getProvidersForUsers} from "./provider_table";
import {usersWithPotentiallySimilarInterest} from "./interest_table";
import {Interest} from "../model/interest";

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
        table.text('source' , 'mediumtext');
        table.text('source_link', 'mediumtext').unique();

        table.dateTime('published_on');
        table.dateTime('scraped_on');

        table.text('metadata', 'longtext');
    })

}

export async function insertPost(postData) : Promise<Post> {
    return createPostScheme().then(() => {
        let possibleSource = postData.source_link.split("/")[2];
        postData.source = ((possibleSource: string) => {
            console.log(possibleSource);
            if (possibleSource.indexOf('facebook.com') != -1) return 'facebook';
            else if (possibleSource.indexOf('instagram.com') != -1) return 'instagram';
            else if (possibleSource.indexOf('twitter.com') != -1) return 'twitter';
            else if (possibleSource.indexOf('t.me') != -1) return 'telegram';
            else return 'unknown';
        })(possibleSource);

        return Post.query().insertGraph(postData)
    });
}

export async function getAllPostsGraphed(page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) (await Post.query().withGraphFetched({
        keywords: true
    }).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
        keywords: true
    }).distinct([`post.*`])
}

export async function deletePost(postid: number) : Promise<number> {
    return Post.query().deleteById(postid);
}

export async function getAllPosts(page: number, range: number , uid: number = -1, fruitPunch: boolean = false, fruitLimit: number = 10) : Promise<Post[]> {
    let mainQ = Post.query();
    let mainQB;

    if (uid >= 0) {
        let providerList = [];
        (await getProvidersForUser(uid)).forEach(item => providerList.push([item.provider , item.source]));

        if (fruitPunch) {
            mainQB = Post.query();
            let providerListB = [];
            let uids = (await usersWithPotentiallySimilarInterest(uid , 0.2)).map((item: any) => item.uid);
            (await getProvidersForUsers(uids , 4))
                .forEach(item => providerListB.push([item.provider , item.source]));
            mainQB.whereIn(['provider' , 'source'] , providerListB).limit(fruitLimit)
        }

        mainQ.whereIn(['provider' , 'source'] , providerList);
        if (mainQB) mainQ.unionAll([mainQB] , true)
    }

    if (page >= 0 && range) return (await mainQ.page(page, range)).results;
    else return mainQ;
}

export async function getAllPostsOrdered(page: number, range: number, orderBy: string = '', order: string = '') : Promise<Post[]> {
    let qBuilder = Post.query();
    if (orderBy && order) qBuilder.orderBy(orderBy , order);

    if (page >= 0 && range) return (await qBuilder.page(page, range)).results;
    else return qBuilder;
}

export async function getPostWithKeyword(keyword: String, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().findByIds(
            Keyword.query().where('keyword' , keyword).select('post_id')
        ).withGraphFetched({
            keywords: true
        }).page(page, range)).results;
    else return Post.query().findByIds(
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

export async function getAllPostsFromProvider(provider: string, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).where('provider' , provider).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
        keywords: true
    }).where('provider' , provider).distinct([`post.*`]);
}

export async function getAllPostsFromSource(source: string, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).where('source_link' , 'like' ,  `%${source}%`).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
        keywords: true
    }).where('source_link' , 'like' ,  `%${source}%`).distinct([`post.*`]);
}

export async function getAllPostsWithTitle(title: string, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).where('title' , 'like' ,  `%${title}%`).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
        keywords: true
    }).where('title' , 'like' ,  `%${title}%`).distinct([`post.*`]);
}

export async function getAllPostsWithBody(body: string, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).where('body' , 'like' ,  `%${body}%`).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
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

export async function getPostsCustom(jsonQuery: QueryObject[], page: number, range: number, orderBy: string = '', order: string = '', uid: number = -1): Promise<Post[]> {
    if (jsonQuery.length === 0) return getAllPosts(page, range);  // if the query was []
    let qBuilder = (page >= 0 && range) ? Post.query().withGraphFetched({
        keywords: true
    }, {joinOperation: 'innerJoin'}).distinct('post.*').page(page, range) : Post.query().withGraphFetched({
        keywords: true
    }, {joinOperation: 'innerJoin'}).distinct('post.*');

    if (orderBy && order) qBuilder.orderBy(orderBy , order);

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

    if (uid >= 0) {
        let providerList = [];
        (await getProvidersForUser(uid)).forEach(item => providerList.push([item.provider , item.source]));
        qBuilder.whereIn(['provider' , 'source'] , providerList)
    }

    if (page >= 0 && range) {
        return (await qBuilder).results;
    } else return qBuilder
}

export async function getAllPostsBeforeScrapedDate(time: number, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '<' , new Date(time)).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '<' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsSinceScrapedDate(time: number, page: number, range: number, uid: number = -1) : Promise<Post[]> {
    let mainQ = Post.query();

    if (uid >= 0) {
        let providerList = [];
        (await getProvidersForUser(uid)).forEach(item => providerList.push([item.provider , item.source]));
        mainQ.whereIn(['provider' , 'source'] , providerList)
    }

    if (page >= 0 && range) return (await mainQ.withGraphFetched({
        keywords: true
    }).where('scraped_on' , '>=' , new Date(time)).distinct([`post.*`]).page(page, range)).results;
    else return mainQ.withGraphFetched({
        keywords: true
    }).where('scraped_on' , '>=' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsBetweenScrapedDate(startTime: number, endTime: number, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).whereBetween('scraped_on' , [new Date(startTime * 1000) , new Date(endTime * 1000)]).distinct([`post.*`]).page(page, range)).results;
    else return Post.query().withGraphFetched({
        keywords: true
    }).whereBetween('scraped_on' , [new Date(startTime * 1000) , new Date(endTime * 1000)]).distinct([`post.*`]);
}

export async function getAllPostsOnScrapedDate(time: number, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range) return (await Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '=' , new Date(time * 1000)).distinct([`post.*`])
        .orderBy('scraped_on' , 'ASC')
        .page(page, range)).results;

    return Post.query().withGraphFetched({
        keywords: true
    }).where('scraped_on' , '=' , new Date(time * 1000)).distinct([`post.*`])
        .orderBy('scraped_on' , 'ASC');
}

export async function getAllPostsBeforePublishedDate(time: number) : Promise<Post[]> {
    return Post.query().withGraphFetched({
        keywords: true
    }).where('published_on' , '<' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsSincePublishedDate(time: number, page: number, range: number, uid: number = -1) : Promise<Post[]> {
    let mainQ = Post.query();

    if (uid >= 0) {
        let providerList = [];
        (await getProvidersForUser(uid)).forEach(item => providerList.push([item.provider , item.source]));
        mainQ.whereIn(['provider' , 'source'] , providerList)
    }

    if (page >= 0 && range)
        return (await mainQ.withGraphFetched({
            keywords: true
        }).where('published_on' , '>=' , new Date(time)).distinct([`post.*`]).page(page, range)).results;

    else return mainQ.withGraphFetched({
        keywords: true
    }).where('published_on' , '>=' , new Date(time)).distinct([`post.*`]);
}

export async function getAllPostsBetweenPublishedDate(startTime: number, endTime: number, page: number, range: number) : Promise<Post[]> {
    if (page >= 0 && range)
        return (await Post.query().withGraphFetched({
            keywords: true
        }).whereBetween('published_on' , [new Date(startTime * 1000) , new Date(endTime * 1000)])
            .distinct([`post.*`])
            .orderBy('published_on' , 'ASC')
            .page(page, range)).results;

    else return Post.query().withGraphFetched({
        keywords: true
    }).whereBetween('published_on' , [new Date(startTime * 1000) , new Date(endTime * 1000)]).distinct([`post.*`])
        .orderBy('published_on' , 'ASC');
}

export async function getAllPostsOnPublishedDate(time: number, page: number, range: number, uid: number = -1) : Promise<Post[]> {
    let mainQ = Post.query();

    if (uid >= 0) {
        let providerList = [];
        (await getProvidersForUser(uid)).forEach(item => providerList.push([item.provider , item.source]));
        mainQ.whereIn(['provider' , 'source'] , providerList)
    }

    if (page >= 0 && range)
        return (await mainQ.withGraphFetched({
            keywords: true
        }).where('published_on' , '=' , new Date(time)).distinct([`post.*`]).page(page, range)).results;

    else return mainQ.withGraphFetched({
        keywords: true
    }).where('published_on' , '=' , new Date(time)).distinct([`post.*`]);
}

export async function updatePostById(postid: number , update: Post) : Promise<Post> {
    return Post.query()
        .updateAndFetchById(postid, update);
}
