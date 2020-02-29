#include <utility>
#include "includes/main.h"

using namespace std;

PyObject* mainPythonObject;

string sortByCommunityInteractionInterface(std::string postsJson, string scoreParamJson) {
    json posts = fromString(std::move(postsJson));
    json scoreParam = fromString(std::move(scoreParamJson));
    unordered_set<string> scoreParamSet;
    for(auto& p: scoreParam) scoreParamSet.insert( p.get<string>() );

    sortByCommunityInteraction(posts, scoreParamSet);
    return toString(posts);
}

string sortByRelativeCommunityInteractionInterface(std::string postsJson, string scoreParamJson) {
    json posts = fromString(std::move(postsJson));
    json scoreParam = fromString(std::move(scoreParamJson));
    unordered_set<string> scoreParamSet;
    for(auto& p: scoreParam) scoreParamSet.insert( p.get<string>() );

    //sortByRelativeCommunityInteraction(posts, scoreParamSet);
    return toString(posts);
}

string sortByTrendingKeywordInterface(std::string postsJson, string scoreParamJson, bool checkSematicSimilarity) {
    json posts = fromString(std::move(postsJson));
    json scoreParam = fromString(std::move(scoreParamJson));
    unordered_set<string> scoreParamSet;
    for(auto& p: scoreParam) scoreParamSet.insert( p.get<string>() );
    auto stopWords = getStopWords();

    sortByTrendingKeyword(mainPythonObject , posts, stopWords , checkSematicSimilarity);
    return toString(posts);
}

String sortByTrendingKeywordMain(const CallbackInfo& info) {
    Env env = info.Env();
    return String::New(env , sortByTrendingKeywordInterface( info[0].As<String>().Utf8Value() , info[1].As<String>().Utf8Value() , info[0].As<Boolean>() ));
}

String sortByRelativeCommunityInteractionMain(const CallbackInfo& info) {
    Env env = info.Env();
    return String::New(env , sortByRelativeCommunityInteractionInterface( info[0].As<String>().Utf8Value() , info[1].As<String>().Utf8Value()));
}

String sortByCommunityInteractionInterfaceMain(const CallbackInfo& info) {
    Env env = info.Env();
    return String::New(env , sortByCommunityInteractionInterface( info[0].As<String>().Utf8Value() , info[1].As<String>().Utf8Value()));
}

Object Init(Env env, Object exports) {
    // setting up the exports for this module
    // setting up the python and NLTK remain here so do not initiate
    mainPythonObject = initializePythonInterpreter();

    exports.Set(
        String::New(env, "sortByTrendingKeyword"),
        Function::New(env, sortByTrendingKeywordMain)
    );

    exports.Set(
            String::New(env, "sortByCommunityInteraction"),
            Function::New(env, sortByCommunityInteractionInterfaceMain)
    );

    exports.Set(
            String::New(env, "sortByRelativeCommunityInteraction"),
            Function::New(env, sortByRelativeCommunityInteractionMain)
    );

    return exports;
}

NODE_API_MODULE(greet, Init);
