---
prev: ./post
next: ../contribution/tech
---

# User Subscriptions
Subscriptions that can be used for admin console for the future

## userAdded
```graphql
    userAdded: [User]
```
Subscription for listening to new users being added to the db

## userAdded
```graphql
   userRemoved: [User]
```
Subscription for listening to users being removed from the db

## Graphql schema
```graphql
type Subscription {
    userAdded: [User]
    userRemoved: [User]
}
```
