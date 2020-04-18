---
prev: ./post
next: ./socials
---

# Provider Mutations
These are the mutations defined under the provider gql module, used for setting up what the user what's to follow

## addProvider
```graphql
    addProvider(provider: IProvider) : Provider
```
Mutation to add a provider item for a user

## addProvider
```graphql
    addProviderList(providers: [IProvider]) : Boolean
```
Mutation to add a provider item list for a user

## removeProvider
```graphql
    removeProvider(provider: IProvider) : Boolean
```
Mutation to remove a provider item from providers list of a user

## updateProvider
```graphql
    updateProvider(provider: String! , source: String!, update: IProvider) : Provider
```
Mutation to update a single provider item from providers list of a user

## cleanUpdateProviderList
```graphql
    cleanUpdateProviderList(providers: [IProvider]!) : Boolean
```
Mutation to clean update a provider item list for a user after deleting all previously defined providers

## Graphql Schema
gql schema for this model goes 
```graphql
extend type Mutation {
    addProvider(provider: IProvider) : Provider
    addProviderList(providers: [IProvider]) : Boolean
    removeProvider(provider: IProvider) : Boolean
    updateProvider(provider: String! , source: String!, update: IProvider) : Provider
    cleanUpdateProviderList(providers: [IProvider]!) : Boolean
}
```
