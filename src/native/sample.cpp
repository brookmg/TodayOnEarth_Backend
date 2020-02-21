#include <iostream>
#include <string>
#include <napi.h>

using namespace Napi;
using namespace std;

string exampleFunction(string input) {
    // primitive types and methods @abeltesfaye will be working on
    return "example of " +  input;
}

String methodExample(const CallbackInfo& info) {
    Env env = info.Env();
    String inputFromJs = info[0].As<String>();  // passing data from the js side
    return String::New(env, exampleFunction(inputFromJs.Utf8Value()));
}

Object Init(Env env, Object exports) {
    // setting up the exports for this module
    exports.Set(
        String::New(env, "methodExample"),
        Function::New(env, methodExample)
    );

    return exports;
}

NODE_API_MODULE(greet, Init);