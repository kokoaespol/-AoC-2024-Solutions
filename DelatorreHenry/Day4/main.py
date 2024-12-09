"""
--- Day 4: Ceres Search ---
"Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:


..X...
.SAMX.
.A..A.
XMAS.S
.X....
The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX
Take a look at the little Elf's word search. How many times does XMAS appear?
"""

import numpy as np
import re
with open("input.txt","r") as file:
    cadenas = file.read().strip().split()
    matriz = np.array([list(line) for line in cadenas])
    direcciones = [(0, 1),(0, -1),(1, 0),(-1, 0),(1, 1),(-1, -1),(1, -1),(-1, 1)]
    palabra = "XMAS"
    palabra_len = len(palabra)
    def buscar_xmas_numpy(matriz):
        n_rows, n_cols = matriz.shape
        contador = 0 
        for fila in range(n_rows):
            for col in range(n_cols):
                for dr, dc in direcciones:
                    if all(
                        0 <= fila + dr * k < n_rows and
                        0 <= col + dc * k < n_cols and
                        matriz[fila + dr * k, col + dc * k] == palabra[k] for k in range(palabra_len)
                    ):
                        contador += 1 
        return contador
    
    cont = buscar_xmas_numpy(matriz)
    print(cont)
    """--- Part Two ---
    The Elf looks quizzically at you. Did you misunderstand the assignment?

    Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

    M.S
    .A.
    M.S
    Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

    Here's the same example from before, but this time all of the X-MASes have been kept instead:

    .M.S......
    ..A..MSMS.
    .M.S.MAA..
    ..A.ASMSM.
    .M.S.M....
    ..........
    S.S.S.S.S.
    .A.A.A.A..
    M.M.M.M.M.
    ..........
    In this example, an X-MAS appears 9 times.

    Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?"""    
    def verificar_mas_sam(matriz):
        n_rows, n_cols = matriz.shape
        contador = 0
        direcciones_esquinas = [
            (-1, -1), (-1, 1), (1, -1), (1, 1)  
        ]
        for fila in range(1, n_rows - 1):  
            for col in range(1, n_cols - 1): 
                if matriz[fila, col] == "A":
                    letras_esquinas = [
                        matriz[fila + dr, col + dc] for dr, dc in direcciones_esquinas
                    ]
                    if sorted(letras_esquinas) == ["M", "M", "S", "S"]:
                        word1 = matriz[fila - 1, col + 1] + "A" + matriz[fila + 1, col - 1]
                        word2 = matriz[fila - 1, col - 1] + "A" + matriz[fila + 1, col + 1]
                        if word2 in ["SAM","MAS"] and word1 in ["SAM","MAS"]:
                            contador+=1
        return contador
    
    cont2 = verificar_mas_sam(matriz)
    print(cont2)





