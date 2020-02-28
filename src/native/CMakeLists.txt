cmake_minimum_required(VERSION 3.10)
project(TOE_Backend_Native CXX)

set(CMAKE_CXX_STANDARD 14)
include_directories("C:\\Users\\BrookMG\\Documents\\GitHub\\TOE_Backend\\node_modules\\node-addon-api\\external-napi",
        "C:\\Users\\BrookMG\\Documents\\GitHub\\TOE_Backend\\node_modules\\node-addon-api" ,
        "C:\\Users\\BrookMG\\AppData\\Local\\Programs\\Python\\Python36-32\\include",
        "C:\\TDM-GCC-64\\x86_64-w64-mingw32")

target_link_libraries(Py C:\\Users\\BrookMG\\AppData\\Local\\Programs\\Python\\Python36-32\\libs\\libpython36.a)
add_executable(TOE_Backend_Native trend.cpp includes/main.h includes/json.hpp sample.cpp util.cpp)
target_link_libraries(TOE_Backend_Native Py)