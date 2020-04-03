---
prev: ./socials
next: ./interest
---
# Post
This model is used to store tokens of a user to access different social media accounts. We use values in here to post and monitor posts in their social accounts.

Properties you would find in the token model are:

::: details postid
- An integer value that uniquely identifies the post
:::

::: details title
- The title (header) of the current post. In most social media posts we use this as the actual holder of the content without going into `body` field.
:::

::: details body
- The body of the current post. Could be empty if the post is a social media post as we use the `title` field for that
:::

::: details provider <Badge text="required" type="warning" />
- The owner of the post. It could be a social media account or author of an article
:::

::: details source_link <Badge text="required" type="warning" />
- The link that points to the post. Also, used us to filter duplicate posts as title and body can't be trusted for digest value.
:::

::: details published_on <Badge text="required" type="warning" />
- Timestamp of actual time the post was first published
:::

::: details scraped_on <Badge text="required" type="warning" />
- Timestamp of actual time the post was first scraped from the source
:::

::: details metadata 
- A json string containing more detail around a post. It's different from source to source, and we will see all the possible content it could have.
:::

## Graphql Schema
The gql schema for this model is defined as:
```graphql
type Post {
    postid: Int,
    title: String,
    body: String,
    provider: String,
    source_link: String,
    published_on: Int,
    scraped_on: Int,
    metadata: Metadata
}
```
