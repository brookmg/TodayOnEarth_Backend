import request from "request-promise-native";
import {getTokensForUser} from "../db/token_table";
import {getUser} from "../db/user_table";
import {createReadStream} from "fs";

async function getUploadUrlAndAsset(accessToken: string, ownerId: string) : Promise<{ uploadUrl: string, asset: string }> {
    /**
     * {
            value: {
                uploadMechanism: {
                    'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
                        headers: { 'media-type-family': 'STILLIMAGE' },
                        uploadUrl: 'https://api.linkedin.com/mediaUpload/C4D22AQE0y_eJsOhVLg/feedshare-uploadedImage/0?ca=vector_feedshare&cn=uploads&m=AQIAJiT0VvigQgAAAXDfOyVz7xdbpkZmtqXuf-SL97NGtPtsAHT_O_TTMA&app=18839633&sync=0&v=beta&ut=0HddeZO3AmW981'
                    }
                },
                mediaArtifact: 'urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C4D22AQE0y_eJsOhVLg,urn:li:digitalmediaMediaArtifactClass:feedshare-uploadedImage)',
                    asset: 'urn:li:digitalmediaAsset:C4D22AQE0y_eJsOhVLg'
            }
        }
     */

    let uploadOption = {
        url: 'https://api.linkedin.com/v2/assets?action=registerUpload',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
            'x-li-format': 'json',
        },
        json: true,
        body: {
            "registerUploadRequest": {
                "owner": "urn:li:person:" + ownerId,
                "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                "serviceRelationships": [{
                    "identifier": "urn:li:userGeneratedContent",
                    "relationshipType": "OWNER"
                }]
            }
        }
    };

    let requestResponse = (await request(uploadOption));
    return {
        uploadUrl: requestResponse?.value?.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl,
        asset: requestResponse?.value?.asset
    };

}

async function postShare(accessToken: string, ownerId: string, title: string, text: string, shareUrl: string, shareThumbnailUrl: string, photos: string[] = []) {
    let body = {
        "owner": "urn:li:person:" + ownerId,
        "subject": title,
        "text": { "text": text }, // max 1300
        "distribution": {
            "linkedInDistributionTarget": {}
        }
    };

    let entity = '';

    if (photos) {
        let { uploadUrl , asset } = await getUploadUrlAndAsset(accessToken, ownerId);
        entity = asset;

        for (const photo of photos) {
            let imageUpload = {
                uri: uploadUrl,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'cache-control': 'no-cache',
                    'conent-type':'image/jpg',
                    'X-Restli-Protocol-Version': '2.0.0',
                    'x-li-format': 'json',
                },
                body: createReadStream(photo)
            };

            let photoRequest = await request(imageUpload);
        }

        //todo: upload the file in binary form using request ??? HOW?
    }

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

    if (entity) body["content"] = {
        "contentEntities": [{
            "entity": entity
        }],
        "description": text,
        "title": title,
        "shareMediaCategory": "IMAGE"
    };

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

export async function postOnToLinkedIn(uid: number, title: string, text: string, shareUrl: string = '', shareThumbnailUrl: string = '', photos: string[] = []) {
    let [accessToken] = (<any>await getTokensForUser(uid))[0]?.linkedin?.split("|||");
    let linkedInId = (await getUser(uid)).linkedin_id;

    if (!linkedInId) throw new Error('User doesn\'t have a linked LinkedIn account');
    if (!accessToken) throw new Error('Access Token Invalid');

    return postShare(accessToken, linkedInId, title, text, shareUrl, shareThumbnailUrl, photos)
        .catch(e => { throw new Error(e.toString()) });

}
