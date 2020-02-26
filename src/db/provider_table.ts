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
    return createProviderScheme().then(() => Provider.query().insert(providerData));
}

export async function deleteProvider(id : number) : Promise<number> {
    return createProviderScheme().then(() => Provider.query().deleteById(id));
}

export async function getProviderById(id : number) : Promise<Provider> {
    return createProviderScheme().then(() => Provider.query().findById(id));
}

export async function updateProviderById(id : number , update : Provider) : Promise<Provider> {
    return createProviderScheme().then(() => Provider.query()
        .updateAndFetchById(id, update));
}

export async function getProvidersForUser(uid : number) : Promise<Provider[]> {
    return createProviderScheme().then(() => Provider.query().where('uid' , uid));
}
