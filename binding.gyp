{
    "targets": [{
        "target_name": "sample",
        "cflags": ['-std=gnu++14','-Wall','-fexceptions'],
        "cflags_cc": ['-std=gnu++14' ],
        "libraries": [
            "-Wl,-rpath,/usr/lib/python3.6/config-3.6m-x86_64-linux-gnu/libpython3.6.so",
         ],
        "sources": [ "./src/native/sample.cpp" , "./src/native/trend.cpp",
                     "./src/native/includes/main.h" , "./src/native/util.cpp" ],
        "include_dirs": ["./node_modules/node-addon-api" ,
                        "/usr/include/python3.6",
                         "C:\\Users\\BrookMG\\AppData\\Local\\Programs\\Python\\Python36-32\\include",
                         "C:\\TDM-GCC-64\\x86_64-w64-mingw32"],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS']
    }]
}
