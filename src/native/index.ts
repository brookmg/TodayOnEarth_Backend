const greet  = require('bindings')('sample');

export class NativeClass {
    public static sortByCommunityInteraction(posts: string, workingOn: string) { return greet.sortByCommunityInteraction(posts, workingOn) }
    public static sortByRelativeCommunityInteraction(posts: string, workingOn: string) { return greet.sortByRelativeCommunityInteraction(posts, workingOn) }
    public static sortByTrendingKeyword(posts: string, workingOn: string, semantics: boolean) { return greet.sortByTrendingKeyword(posts, workingOn, semantics); }
    public static sortByUserInterest(posts: string, userInterests: string, semantics: boolean) { return greet.sortByUserInterest(posts, userInterests, semantics); }
    public static getKeywordFrequency(posts: string, semantics: boolean) { return greet.getKeywordFrequency(posts, semantics) }
    public static getPostCountAndCommunityInteractionByProvider(posts: string) {
        return greet.getPostCountAndCommunityInteractionByProvider(posts)
    }
}
