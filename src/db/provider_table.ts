import { Provider } from '../model/provider'
import { KnexI } from './db'

Provider.knex(KnexI);

// --- Create scheme functions ----

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

export async function insertProvider(providerData: Provider) : Promise<Provider> {
    return createProviderScheme().then(async () => {
        if ((await Provider.query().where({
            'uid': providerData.uid,
            'provider': providerData.provider,
            'source': providerData.source
        })).length > 0) throw new Error('Provider record is already present.');
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

export async function getProviders() : Promise<Provider[]> {
    return createProviderScheme().then( () => Provider.query() );
}

export async function getProviderById(id : number) : Promise<Provider> {
    return createProviderScheme().then(() => Provider.query().findById(id));
}

export async function updateProviderById(id : number , update : Provider) : Promise<Provider> {
    return createProviderScheme().then(() => Provider.query()
        .updateAndFetchById(id, update));
}

export async function updateProviderOfUser(update: Provider, provider: string, source: string, uid: number) : Promise<Provider> {
    return createProviderScheme().then(async () => {
        let itemToUpdate = await Provider.query().findOne({ uid , provider, source });
        return itemToUpdate.$query().patchAndFetch(update);
    });
}

export async function addProviderListForUser(providers: Provider[], uid: number , clear: boolean = false) : Promise<boolean> {
    let promises = [];
    if (clear) await Provider.query().delete().where('uid' , uid);

    for (const provider of providers) {
        promises.push(insertProvider(Provider.fromJson({ uid , ...provider, added_on: new Date().toUTCString() })));
    }

    return Promise.all(promises).then(results => { return results.every(item => !!item === true) })
}

export async function getProvidersForUser(uid : number) : Promise<Provider[]> {
    return createProviderScheme().then(() => Provider.query().where('uid' , uid));
}
