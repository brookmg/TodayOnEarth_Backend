---
prev: ./user
next: ./post
---
# Socials
This model is used to access different social media accounts. We use this model to post on their social accounts.

Properties you would find in the token model are:

::: details text <Badge text="required" type="warning" />
- An string value that will be place on the post.
:::

::: details facebook
- Boolean to show if the post was successfully posted on facebook
:::

::: details twitter
- Boolean to show if the post was successfully posted on twitter
:::

::: details linkedin
- Boolean to show if the post was successfully posted on linkedin
:::

::: details telegram
- Boolean to show if the post was successfully posted on telegram
:::

::: details errors
- Array which holds errors from each platform that was meant to post content
:::

::: details filename
- The uploaded file's filename
:::

::: details mimetype
- The uploaded file's MIME type 
:::

::: details encoding
- The uploaded file's encoding
:::

## Graphql Schema
The gql schema for this model ( and related ones ) is defined as:
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
```
