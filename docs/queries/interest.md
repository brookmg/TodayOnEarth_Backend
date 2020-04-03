---
prev: ./post
next: ./provider
---

# Interest Queries
These are the queries defined under the interest gql module.

### getInterestsOfUser
```graphql
    getInterestsOfUser: [Interest]
```
used to get user's interest list

## Graphql Schema
gql schema for this model goes 
```graphql
extend type Query {
    getInterestsOfUser: [Interest]
}
```
