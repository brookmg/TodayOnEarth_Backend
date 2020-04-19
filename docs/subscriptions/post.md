---
prev: ../mutations/socials
next: ./user
---

# Post Subscriptions

## postAdded
```graphql
    postAdded: [Post]
```
Subscription to listen to new post insertion to the database. Only posts with computed interest of > 0.5 for the current user is published through this subscription. 

## postAdded
```graphql
    postRemoved: [Post]
```
Subscription to listen to removal of posts from our db. This is a rare event, but it can be used for proper removal of removed content from front-end.

## Graphql schema
```graphql
extend type Subscription {
    postAdded: [Post]
    postRemoved: [Post]
}
```
