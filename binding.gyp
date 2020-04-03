{
    "targets": [{
        "target_name": "sample",
        "cflags": ['-std=gnu++14','-Wall','-fexceptions'],
        "cflags_cc": ['-std=gnu++14', '-fexceptions' ],
        "libraries": [
            "-Wl,-rpath,/usr/lib/python3.6/config-3.6m-x86_64-linux-gnu/libpython3.6.so",
            "-Wl,-rpath,./src/native/includes/libpython3.6.so",
         ],
        "sources": [ "./src/native/sample.cpp" , "./src/native/trend.cpp",
                     "./src/native/includes/main.h" , "./src/native/util.cpp" ],
        "include_dirs": ["./node_modules/node-addon-api" ,
                         "./src/native/includes/python",
                         "./src/native/includes/x86_64-linux-gnu/python3.6m",
                        "/usr/include/python3.6"],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS']
    }]
}
