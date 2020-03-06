const greet  = require('bindings')('sample');

export class NativeClass {
    public static sortByCommunityInteraction(posts: string, workingOn: string) { return greet.sortByCommunityInteraction(posts, workingOn) }
    public static sortByRelativeCommunityInteraction(posts: string, workingOn: string) { return greet.sortByRelativeCommunityInteraction(posts, workingOn) }
    public static sortByTrendingKeyword(posts: string, semantics: boolean) { return greet.sortByTrendingKeyword(posts, semantics); }
    public static sortByUserInterest(posts: string, userInterests: string, semantics: boolean) { return greet.sortByUserInterest(posts, userInterests, semantics); }
    public static getKeywordFrequency(post: string, semantics: boolean) { return greet.getKeywordFrequency(post, semantics) }
    public static getPostCountAndCommunityInteractionByProvider(posts: string) {
        return greet.getPostCountAndCommunityInteractionByProvider(posts)
    }
}
