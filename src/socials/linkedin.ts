import request from "request-promise-native";
import {getTokensForUser} from "../db/token_table";
import {getUser} from "../db/user_table";

async function postShare(accessToken: string, ownerId: string, title: string, text: string, shareUrl: string, shareThumbnailUrl: string) {
    let body = {
        "owner": "urn:li:person:" + ownerId,
        "subject": title,
        "text": { "text": text }, // max 1300
        "distribution": {
            "linkedInDistributionTarget": {}
        }
    };

    if (shareUrl) {
        body["content"] = {
            "contentEntities": [{ "entityLocation": shareUrl }],
            "title": title
        };

        if (shareThumbnailUrl) {
            body["content"]["contentEntities"] = [{
                "entityLocation": shareUrl,
                "thumbnails": [{ "resolvedUrl": shareThumbnailUrl }]
            }]
        }
    }

    let options = {
        url: 'https://api.linkedin.com/v2/shares',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
            'x-li-format': 'json',
            'Content-Length': Buffer.byteLength(JSON.stringify(body))
        },
        body: JSON.stringify(body),
        strictSSL: true,
        timeout: 10000
    };

    try {
        return await request(options);
    } catch (e) {
        throw new Error(e);
    }
}

export async function postOnToLinkedIn(uid: number, title: string, text: string, shareUrl: string = '', shareThumbnailUrl: string = '') {
    let [accessToken] = (<any>await getTokensForUser(uid))[0].linkedin.split("|||");
    let linkedInId = (await getUser(uid)).linkedin_id;

    if (!linkedInId) throw new Error('User doesn\'t have a linked LinkedIn account');
    if (!accessToken) throw new Error('Access Token Invalid');

    postShare(accessToken, linkedInId, title, text, shareUrl, shareThumbnailUrl).then(r => {
        console.log(r); // status 201 signal successful posting
    }).catch(e => { throw new Error(e.toString()) });

}
