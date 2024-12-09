cmake_minimum_required(VERSION 3.18)

project(aoc2024)

set(CMAKE_BUILD_TYPE Debug)

add_executable(day06 day06.c)
target_compile_options(day06 PRIVATE -g)

add_executable(day07 day07.c)
target_compile_options(day07 PRIVATE -g)
target_link_libraries(day07 PRIVATE m)
