---
prev: ./token
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

::: details keywords <Badge text="unused" type="error" />
- This has been replaced by native modules that compute keywords from post at runtime
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

## JSON Schema
The json schema for this model is defined as:
```js
{
    type: 'object',
    required: ['provider' , 'source_link' , 'published_on' , 'scraped_on'],
    properties: {
        postid: { type: 'interger' },
        title: { type: 'string' },
        body: { type: 'string' },
        provider: { type: 'string' },
        source_link: { type: 'string' }, 
        keywords: { type: 'array'},
        published_on: { type: 'date'},
        scraped_on: { type: 'date'},
        metadata: { type: 'string|object' }
    }
}
```
