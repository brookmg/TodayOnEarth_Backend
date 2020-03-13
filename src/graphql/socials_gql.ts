import {postTweet} from "../socials/twitter";
import {postOnToLinkedIn} from "../socials/linkedin";
import {createWriteStream, unlink} from "fs";
import {postContentToPage} from "../socials/facebook";

const { gql } = require('apollo-server-express');

export const typeDef = gql`
    type PublishedPost {
        text: String
        telegram: Boolean
        twitter: Boolean
        linkedin: Boolean
        facebook: Boolean
        filename: String
        mimetype: String
        encoding: String
    }
    
    extend type Mutation {
        postOnToSocials(text: String!, upload: Upload, telegram: Boolean, linkedin: Boolean, twitter: Boolean, channel: String, facebook: Boolean, pageUrl: String) : PublishedPost
    }
`;

export const resolvers = {
    Mutation: {
        postOnToSocials: async (_, {text, upload, telegram, linkedin, twitter, channel, facebook, pageUrl}, {user}) => {
            let u = await user.getUser();
            if (!u) throw new Error('You must be logged in.');
            let returnable:any = {};

            if (upload) {
                const { createReadStream , filename, mimetype, encoding} = await upload;
                const stream = createReadStream();

                // Store the file in the filesystem.
                await new Promise((resolve, reject) => {
                    stream.on('error', error => {
                        unlink(`./medias/${filename}`, () => {
                            reject(error);
                        });
                    }).pipe(createWriteStream(`./medias/${filename}`))
                        .on('error', reject)
                        .on('finish', resolve)
                });
                console.log('-----------file written');

                const { sendMessageToChannel } = require("../socials/telegram");
                if (telegram && channel) {
                    let send = await sendMessageToChannel(u.uid, channel, `./medias/${filename}` , text, false);
                    returnable.telegram = !!send?.id;
                } else returnable.telegram = false;

                if (linkedin) {
                    let send : any = await postOnToLinkedIn(u.uid , text, text);
                    returnable.linkedin = !!send?.error
                } else returnable.linkedin = false;

                if (twitter) {
                    let send = await postTweet({ status: text} , [`./medias/${filename}`], u.uid);
                    returnable.twitter = send?.status?.indexOf('error') == -1
                } else returnable.twitter = false;

                if (facebook && pageUrl) {
                    let send = await postContentToPage( u.uid , pageUrl, text , [`${process.env.HOST}/medias/${filename}`]);
                    returnable.facebook = !!send?.id
                } else returnable.facebook = false;

                return { ...returnable , text , filename, mimetype, encoding};
            }

            const { sendMessageToChannel } = require("../socials/telegram");
            if (telegram && channel) {
                let send = await sendMessageToChannel(u.uid, channel, "" , text, false);
                returnable.telegram = !!send?.id;
            }

            if (linkedin) {
                let send : any = await postOnToLinkedIn(u.uid , text, text);
                returnable.linkedin = !!send?.id
            }

            if (twitter) {
                let send = await postTweet({ status: text} ,[] ,u.uid);
                returnable.twitter = send?.status?.indexOf('error') == -1
            }

            if (facebook && pageUrl) {
                let send = await postContentToPage( u.uid , pageUrl, text);
                returnable.facebook = !!send?.id
            } else returnable.facebook = false;

            return { ...returnable , text };
        }
    }
};
