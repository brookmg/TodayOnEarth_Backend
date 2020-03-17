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
        errors: PostError
        linkedin: Boolean
        facebook: Boolean
        filename: String
        mimetype: String
        encoding: String
    }
    
    type PostError {
        facebook: String
        twitter: String
        linkedin: String
        telegram: String
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
            let errors: any = {};

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

                const { sendMessageToChannel } = require("../socials/telegram");
                if (telegram && channel) {
                    let send = await sendMessageToChannel(u.uid, channel, `./medias/${filename}` , text, false)
                        .catch(err => errors.telegram = err.toString());
                    returnable.telegram = !!send?.id || !errors.telegram;
                } else returnable.telegram = false;

                if (linkedin) {
                    let send : any = await postOnToLinkedIn(u.uid , text, text, '', '', [`./medias/${filename}`])
                        .catch(err => errors.linkedin = err.toString());
                    returnable.linkedin = !!send?.error || !errors.linkedin;
                } else returnable.linkedin = false;

                if (twitter) {
                    let send = await postTweet({ status: text} , [`./medias/${filename}`], u.uid)
                        .catch(err => errors.twitter = err.toString());
                    returnable.twitter = send?.status?.indexOf('error') == -1 || !errors.twitter;
                } else returnable.twitter = false;

                if (facebook && pageUrl) {
                    let send = await postContentToPage( u.uid , pageUrl, text , [`${process.env.HOST}/medias/${filename}`])
                        .catch(err => errors.facebook = err.toString());
                    returnable.facebook = !!send?.id || !errors.facebook;
                } else returnable.facebook = false;

                return { ...returnable , errors, text , filename, mimetype, encoding};
            }

            const { sendMessageToChannel } = require("../socials/telegram");
            if (telegram && channel) {
                let send = await sendMessageToChannel(u.uid, channel, "" , text, false)
                    .catch(err => errors.telegram = err.toString());
                returnable.telegram = !!send?.id
            }

            if (linkedin) {
                let send : any = await postOnToLinkedIn(u.uid , text, text)
                    .catch(err => errors.linkedin = err.toString());
                returnable.linkedin = !!send?.error || !errors.linkedin;
            }

            if (twitter) {
                let send = await postTweet({ status: text} ,[] ,u.uid)
                    .catch(err => errors.twitter = err.toString());
                returnable.twitter = send?.status?.indexOf('error') == -1 || !errors.twitter;
            }

            if (facebook && pageUrl) {
                let send = await postContentToPage( u.uid , pageUrl, text)
                    .catch(err => errors.facebook = err.toString());
                returnable.facebook = !!send?.id || !errors.facebook;
            } else returnable.facebook = false;

            return { ...returnable , errors, text };
        }
    }
};
