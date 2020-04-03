---
prev: ./interest
next: ../queries/user
---
# Provider
This is a model used for defining the providers of the content the user wants to listen to.

::: details provider_id
- An integer value that uniquely identifies the current provider for the user.
:::

::: details provider
- A String value holding the name of the account owner inside the source. For example `ElonMusk`
:::

::: details source
- A String value holding the name of the source. For example `twitter`
:::

::: details added_on
- A timestamp to show when the provider was added for the user
:::

::: details uid
- The user id in which this provider is assigned to
:::

::: details frequency <Badge text="unused" type="error" />
- A String value that defines how frequent contents from this provider should be scrapped. For example `every min`
:::

## Graphql Schema
```graphql
type Provider {
    provider_id: Int,
    provider: String,
    source: String,
    added_on: Int,
    uid: Int,
    frequency: String
}
```
