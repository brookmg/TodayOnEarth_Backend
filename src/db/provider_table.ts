import { Provider } from '../model/provider'
import { KnexI } from './db'
import {forEach} from "../utils";

Provider.knex(KnexI);

// --- Create scheme functions ----
/**
 * Method used for creating the table, not used anymore as knex migrations are implemented now.
 */
export async function createProviderScheme() : Promise<any> {
    if (await KnexI.schema.hasTable('provider')) return null; // We don't need to create it again

    return KnexI.schema.createTable('provider', table => {
        table.increments('provider_id').primary();
        table.string('provider');
        table.string('source');

        table.integer('uid');
        table.dateTime('added_on');
        table.string('frequency');
    })

}

/**
 * Method to insert a provider into the db
 * @param providerData - the provider data to insert into db
 */
export async function insertProvider(providerData: Provider) : Promise<Provider> {
    return createProviderScheme().then(async () => {
        if ((await Provider.query().where({
            'uid': providerData.uid,
            'provider': providerData.provider.toLowerCase(),
            'source': providerData.source.toLowerCase()
        })).length > 0) throw new Error('Provider record is already present.');
        providerData.provider = providerData.provider.toLowerCase();
        providerData.source = providerData.source.toLowerCase();
        return Provider.query().insert(providerData)
    });
}

export async function deleteProvider(id : number) : Promise<number> {
    return createProviderScheme().then(() => Provider.query().deleteById(id));
}

export async function deleteProviderItem(provider : Provider) : Promise<number> {
    return createProviderScheme().then(() => Provider.query().delete().where({
        'uid': provider.uid,
        'source': provider.source,
        'provider': provider.provider
    }));
}

interface QueryObject {
    provider?: string,
    source?: string,

    _provider?: string,
    _source?: string,

    connector: string
}

const acceptedProperties = [
    'provider' , 'source' ,
    '_provider' , '_source' ,
];
const acceptedConnectors = ['AND' , 'OR', ''];

async function getWhereValues(processFrom: string[]) : Promise<string[]> {
    let returnable = [];
    if (processFrom.length < 2) throw new Error('query builder: something went wrong while building query');

    switch(Number.parseInt(processFrom[0] , 10)) {
        case 0: await returnable.push(['provider' , 'LIKE' , `%${processFrom[1]}%`]); break;
        case 1: await returnable.push(['source' , 'LIKE' , `%${processFrom[1]}%`]); break;

        case 2: await returnable.push(['provider' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;
        case 3: await returnable.push(['source' , 'NOT LIKE' , `%${processFrom[1]}%`]); break;

        default: await returnable.push(['' , '' , '']);
    }

    return returnable;
}

/**
 * Method to give all providers that fulfil a custom query of sort
 * @param filters - array of QueryObject connected with each other
 * @param page - number of the page requested
 * @param range - number of items per page
 * @param orderBy - the column in which the providers should be ordered by
 * @param order - ASC or DESC
 */
export async function getProviders(filters: QueryObject[], page: number, range: number, orderBy: string = '', order: string = '') : Promise<Provider[]> {
    if (filters.length === 0) return getAllProviders(page, range);  // if the query was []
    let qBuilder = (page >= 0 && range) ? Provider.query().page(page, range) : Provider.query();
    if (orderBy && order) qBuilder.orderBy(orderBy , order);

    await forEach(filters, async (operationItem: QueryObject) => {

        let props = Object.keys(operationItem);
        let prevConnector = "";

        if (props.length < 2 || !acceptedProperties.includes(props[0]) || props[1] !== 'connector') {
            throw new Error(`parse error: Malformed properties found in operation: ${operationItem}`)
        }

        if (!acceptedConnectors.includes(operationItem[props[1]])) {
            throw new Error(`parse error: An unknown connector found in operation: ${operationItem[props[1]]}`)
        }

        // check connector field
        let thisIndex = filters.indexOf(operationItem);
        if (thisIndex > 0 && filters[thisIndex-1].connector) {
            prevConnector = filters[thisIndex-1].connector
        }

        let indexOfProp = acceptedProperties.indexOf(props[0]);
        if (operationItem[props[0]] === null || operationItem[props[0]] === undefined
            || operationItem[props[0]] === "") {
            throw new Error(`parse error: Wrong value passed for property ${props[0]}`)
        }

        if (prevConnector === 'AND' || prevConnector === '') {
            // we have an and connector so use `andWhere`
            let whereArgs = (await getWhereValues([indexOfProp , operationItem[props[0]]]))[0];
            qBuilder.andWhere(whereArgs[0] , whereArgs[1] , whereArgs[2]);
        } else if (prevConnector === 'OR') {
            // we have an or connector so use `orWhere`
            let whereArgs = (await getWhereValues([indexOfProp , operationItem[props[0]]]))[0];
            qBuilder.orWhere(whereArgs[0] , whereArgs[1] , whereArgs[2]);
        } else {
            throw new Error(`parse error: Connector value not identified`);
        }

    });

    qBuilder.distinct(['provider.provider' , 'provider.source']);

    if (page >= 0 && range) return (await qBuilder).results;
    else return qBuilder;
}

export async function getAllProviders(page: number = -1, range: number = 0) {
    if (page >= 0 && range) return (await Provider.query().distinct(['provider.provider' , 'provider.source']).page(page, range)).results;
    else return Provider.query().distinct(['provider.provider' , 'provider.source']);
}

export async function getProviderById(id : number) : Promise<Provider> {
    return createProviderScheme().then(() => Provider.query().findById(id));
}

export async function updateProviderById(id : number , update : Provider) : Promise<Provider> {
    return createProviderScheme().then(() => Provider.query()
        .updateAndFetchById(id, update));
}

/**
 * Method to update provider for a specific user
 * @param update - the update that's going to be pushed into the db
 * @param provider - the provider to be updated
 * @param source - the source in which that provider belongs to
 * @param uid - the user id of the user to modify the provider for
 */
export async function updateProviderOfUser(update: Provider, provider: string, source: string, uid: number) : Promise<Provider> {
    return createProviderScheme().then(async () => {
        let itemToUpdate = await Provider.query().findOne({ uid , provider, source });
        update.provider = update.provider.toLowerCase();
        update.source = update.source.toLowerCase();
        return itemToUpdate.$query().patchAndFetch(update);
    });
}

/**
 * Method to add list of providers to a user
 * @param providers - array of provider
 * @param uid - the user id where the providers are added to
 * @param clear - boolean to remove any provider in the user before inserting the new ones
 */
export async function addProviderListForUser(providers: Provider[], uid: number , clear: boolean = false) : Promise<boolean> {
    let promises = [];
    if (clear) await Provider.query().delete().where('uid' , uid);

    for (const provider of providers) {
        provider.provider = provider.provider.toLowerCase();
        provider.source = provider.source.toLowerCase();

        promises.push(insertProvider(Provider.fromJson({ uid , ...provider, added_on: new Date().toUTCString() })));
    }

    return Promise.all(promises).then(results => { return results.every(item => !!item === true) })
}

export async function getProvidersForUser(uid : number) : Promise<Provider[]> {
    return createProviderScheme().then(() => Provider.query().where('uid' , uid));
}

export async function getProvidersForUsers(uid : number[], limit: number = 10) : Promise<Provider[]> {
    return createProviderScheme().then(() => Provider.query().whereIn('uid' , uid).limit(limit));
}
