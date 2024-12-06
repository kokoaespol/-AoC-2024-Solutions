cmake_minimum_required(VERSION 3.18)

project(aoc2024)

set(CMAKE_BUILD_TYPE Debug)

add_executable(day06 day06.c)
add_compile_options(day06 PRIVATE -G)
