---
prev: ./user
next: ./post
---
# Token
This model is used to store tokens of a user to access different social media accounts. We use values in here to post and monitor posts in their social accounts.

Properties you would find in the token model are:

::: details uid <Badge text="required" type="warning" />
- An integer value that uniquely identifies the user in which the tokens belong to.
:::

::: details facebook
- Contains the access-token and refresh-token of the facebook account of the user
:::

::: details twitter
- Contains the access-token and refresh-token of the twitter account of the user
:::

::: details instagram <Badge text="unused" type="error" />
- Contains the access-token and refresh-token of the instagram account of the user
- This is not currently used because of different appeals that should be placed to acquire proper permissions.
:::

## JSON Schema
The json schema for this model is defined as:
```js
{
    type: 'object',
    required: ['uid'],
    properties: {
        uid: { type: 'integer'},
        facebook: { type: 'string'},    
        twitter: { type: 'string'}, 
        instagram: { type: 'string'} 
    }
}
```
