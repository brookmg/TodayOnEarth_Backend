---
prev: ./post
next: ./provider
---
# Interest
This model is used to store interests of a user with their predicted score value.

Properties you would find in the token model are:

::: details interest <Badge text="required" type="warning" />
- Contains interest keyword
:::

::: details score <Badge text="required" type="warning" />
- Contains the score for the interest
- This is a float in the domain (-1,1), where -1 means maximum dislike and 1 means maximum like.
:::

::: details uid <Badge text="required" type="warning" />
- An integer value that uniquely identifies the user in which the interest belong to.
:::

## Graphql Schema
The gql schema for this model is defined as:
```graphql
type Interest {
    interest: String,
    score: Float,
    uid: Int
}
```
