{
    "targets": [{
        "target_name": "sample",
        "cflags!": ["-fno-exceptions"],
        "cflags_cc!": ["-fno-exceptions"],
        "sources": [ "./src/native/sample.cpp"],
        "include_dirs": ["./node_modules/node-addon-api"],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}