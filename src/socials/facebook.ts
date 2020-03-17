import request from "request-promise-native";
import {getUser} from "../db/user_table";
import {getTokensForUser} from "../db/token_table";

interface PageDefinition {
    name: string,
    access_token: string,
    id: number
}

async function getPageId(uid: number, pageurl: string) : Promise<number> {
    let facebookId = (<any> await getUser(uid))?.facebook_id;
    if (!facebookId) throw new Error('User doesn\'t have a linked facebook id');

    let fbToken = (<any> await getTokensForUser(uid))[0]?.facebook?.split("|||")[0];
    if (!fbToken) throw new Error('No facebook token was found');

    let options = {
        url: `https://graph.facebook.com/?id=${pageurl}&access_token=${fbToken}&fields=id`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + fbToken[0],
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'x-li-format': 'json',
        },
        json:true,
        strictSSL: true,
        timeout: 10000
    };

    return (await request(options))["id"]
}

async function getAvailableFacebookPages(uid: number) : Promise<PageDefinition[]> {
    let pages: PageDefinition[] = [];
    let facebookId = (<any> await getUser(uid))?.facebook_id;
    if (!facebookId) throw new Error('User doesn\'t have a linked facebook id');

    let fbToken = (<any> await getTokensForUser(uid))[0]?.facebook?.split("|||")[0];
    if (!fbToken) throw new Error('No facebook token was found');

    let options = {
        url: `https://graph.facebook.com/v6.0/${facebookId}/accounts?access_token=${fbToken}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + fbToken[0],
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'x-li-format': 'json',
        },
        strictSSL: true,
        timeout: 10000
    };

    /**
     * {"data":[
     *          {
     *           "access_token":"---",
     *           "category":"Website","category_list":[{"id":"2202","name":"Website"}],
     *           "name":"Today On Earth","id":"101393721454287",
     *           "tasks":["ANALYZE","ADVERTISE","MODERATE","CREATE_CONTENT","MANAGE"]
     *          }
     *        ],
     * "paging":{"cursors":{"before":"MTAxMzkzNzIxNDU0Mjg3","after":"MTAxMzkzNzIxNDU0Mjg3"}}}'
     */
    let returned = JSON.parse(await request(options));
    pages.push({
       name: returned['data'][0]['name'],
       access_token: returned['data'][0]['access_token'],
       id: returned['data'][0]['id']
    });

    return pages;
}

export async function postContentToPage(uid: number, page_url: string, message: string, photo: string[] = []) {
    let photoIds = [];
    let facebookId = (<any> await getUser(uid))?.facebook_id;
    if (!facebookId) throw new Error('User doesn\'t have a linked facebook id');

    let fbToken = (<any> await getTokensForUser(uid))[0]?.facebook?.split("|||")[0];
    if (!fbToken) throw new Error('No facebook token was found');

    let availablePages = (await getAvailableFacebookPages(uid));

    let page_id = Number(await getPageId(uid , page_url));
    if (!availablePages.map(item => Number(item.id)).includes(page_id))
        throw new Error('This app doesn\'t have the privilege to post on page');

    let pageAccessToken = availablePages.filter(item => Number(item.id) === page_id)[0].access_token;

    if (photo) {
        photoIds = await Promise.all(photo.map(async p => {
            let options = {
                url: `https://graph.facebook.com/v6.0/${page_id}/photos`,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + fbToken,
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json',
                    'x-li-format': 'json',
                },
                body: {
                    url: p,
                    published: false,
                    access_token: pageAccessToken
                },
                json:true,
                strictSSL: true,
                timeout: 10000
            };

            let response = await request(options);
            return response['id']
        }));
    }

    let options = {
        url: `https://graph.facebook.com/v6.0/${page_id}/feed`,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + fbToken,
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'x-li-format': 'json',
        },
        body: (photoIds) ? {
            message: message,
            access_token: pageAccessToken,
            attached_media: photoIds.map(id => { return {'media_fbid': id} })
        } : { message: message, access_token: pageAccessToken },
        strictSSL: true,
        json: true,
        timeout: 10000
    };

    return await request(options);

}
