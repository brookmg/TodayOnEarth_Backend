---
prev: ./post
next: ./provider
---

# Interest Mutations
These are the mutations defined under the interest gql module.

## addInterest
```graphql
    addInterest(interest: IInterest!) : Boolean
```
add an interest item for the user

## updateInterestList
```graphql
    updateInterestList(interests: [IInterest]!) : Boolean
```
update interest list of the user for already existing interests

## cleanUpdateInterestList
```graphql
    cleanUpdateInterestList(interests: [IInterest]!) : Boolean
```
update interest list of the user after cleaning the previous interest list

## updateInterest
```graphql
    updateInterest(interest: String!, update: UInterest!) : Boolean
```
update a single interest item for the user

## muteInterest
```graphql
    muteInterest(interest: String!) : Boolean
```
update the score for an interest item of a user to -1. Which will prevent any posts with that keyword in it from showing up.

## unMuteOrResetInterest
```graphql
    unMuteOrResetInterest(interest: String!) : Boolean
```
update the score for an interest item of a user to 0.2. Which is the same as resetting the score of that specific interest.

## removeInterest
```graphql
    removeInterest(interest: String!) : Boolean
```
remove an interest from the list made for a user

## Graphql Schema
gql schema for this model goes 
```graphql
type Mutation {
    addInterest(interest: IInterest!) : Boolean
    updateInterestList(interests: [IInterest]!) : Boolean
    cleanUpdateInterestList(interests: [IInterest]!) : Boolean
    updateInterest(interest: String!, update: UInterest!) : Boolean
    muteInterest(interest: String!) : Boolean
    unMuteOrResetInterest(interest: String!) : Boolean
    removeInterest(interest: String!) : Boolean
}
```
