---
prev: ./provider
next: ../subscriptions/post
---

# Socials Mutations
These are the mutations defined under the socials gql model 

## postOnToSocials
```graphql
    postOnToSocials(
        text: String!, 
        upload: Upload, 
        telegram: Boolean, 
        linkedin: Boolean, 
        twitter: Boolean, 
        channel: String, 
        facebook: Boolean, 
        pageUrl: String
    ): PublishedPost
```
mutation for posting content onto social medias at once
- text: The text content / label of the post to publish on social platforms
- upload: A single image file item <Badge text="optional" type="warning" /> 
- telegram: A boolean flag to determine if we should publish to a telegram channel as well
- linkedin: A boolean flag to determine if we should publish to linkedin as well
- twitter: A boolean flag to determine if we should tweet to twitter as well
- channel: The telegram channel to post onto 
- facebook: A boolean flag to determine if we should publish to facebook as well
- pageUrl: The facebook page to post onto

#### Output 
The above mutation returns another schema which contains the success check boolean for each platform alongside
the error if any actually happened.

## Graphql Schema
gql schema for this model goes 
```graphql
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
    postOnToSocials(
        text: String!, 
        upload: Upload, 
        telegram: Boolean, 
        linkedin: Boolean, 
        twitter: Boolean, 
        channel: String, 
        facebook: Boolean, 
        pageUrl: String
    ): PublishedPost
}
```
