package main

import (
	"bufio"
	"fmt"
	"os"
)

func leerLineasALaberinto() [][]rune {
	file, err := os.Open("input.txt")
	if err != nil {
		fmt.Println("Error al abrir el archivo:", err)
		return nil
	}
	defer file.Close()

	var laberinto [][]rune
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		linea := scanner.Text()
		laberinto = append(laberinto, []rune(linea))
	}

	return laberinto
}

func parteUno() {
	laberinto := leerLineasALaberinto()
	visitados := make(map[[2]int]bool)
	var actual [2]int

	altura := len(laberinto)
	ancho := len(laberinto[0])

	for fila := 0; fila < altura; fila++ {
		for columna := 0; columna < ancho; columna++ {
			if laberinto[fila][columna] == '^' {
				actual = [2]int{fila, columna}
			}
		}
	}

	direccion := "arriba"
	visitados[actual] = true

	for {
		fila, columna := actual[0], actual[1]
		if direccion == "arriba" {
			if fila-1 < 0 {
				break
			} else if laberinto[fila-1][columna] == '#' {
				direccion = "derecha"
			} else {
				laberinto[fila][columna] = '.'
				actual = [2]int{fila - 1, columna}
				laberinto[fila-1][columna] = '^'
				visitados[actual] = true
			}
		} else if direccion == "abajo" {
			if fila+1 >= altura {
				break
			} else if laberinto[fila+1][columna] == '#' {
				direccion = "izquierda"
			} else {
				laberinto[fila][columna] = '.'
				actual = [2]int{fila + 1, columna}
				laberinto[fila+1][columna] = '^'
				visitados[actual] = true
			}
		} else if direccion == "derecha" {
			if columna+1 >= ancho {
				break
			} else if laberinto[fila][columna+1] == '#' {
				direccion = "abajo"
			} else {
				laberinto[fila][columna] = '.'
				actual = [2]int{fila, columna + 1}
				laberinto[fila][columna+1] = '^'
				visitados[actual] = true
			}
		} else if direccion == "izquierda" {
			if columna-1 < 0 {
				break
			} else if laberinto[fila][columna-1] == '#' {
				direccion = "arriba"
			} else {
				laberinto[fila][columna] = '.'
				actual = [2]int{fila, columna - 1}
				laberinto[fila][columna-1] = '^'
				visitados[actual] = true
			}
		}
	}

	respuesta := len(visitados)
	fmt.Printf("Parte 1: %d\n", respuesta)
}

func parteDos() {
	laberinto := leerLineasALaberinto()
	respuesta := 0
	var inicio [2]int

	altura := len(laberinto)
	ancho := len(laberinto[0])

	for fila := 0; fila < altura; fila++ {
		for columna := 0; columna < ancho; columna++ {
			if laberinto[fila][columna] == '^' {
				inicio = [2]int{fila, columna}
			}
		}
	}

	for fila := 0; fila < altura; fila++ {
		for columna := 0; columna < ancho; columna++ {
			if laberinto[fila][columna] != '.' {
				continue
			}

			laberinto[fila][columna] = '#'

			actual := inicio
			direccion := "arriba"
			visitados := make(map[[2]int]string)
			visitados[actual] = direccion

			for {
				r, c := actual[0], actual[1]
				if direccion == "arriba" {
					if r-1 < 0 {
						break
					} else if laberinto[r-1][c] == '#' {
						direccion = "derecha"
					} else {
						laberinto[r][c] = '.'
						actual = [2]int{r - 1, c}
						laberinto[r-1][c] = '^'
						if _, ok := visitados[actual]; ok && visitados[actual] == direccion {
							respuesta++
							break
						} else {
							visitados[actual] = direccion
						}
					}
				} else if direccion == "abajo" {
					if r+1 >= altura {
						break
					} else if laberinto[r+1][c] == '#' {
						direccion = "izquierda"
					} else {
						laberinto[r][c] = '.'
						actual = [2]int{r + 1, c}
						laberinto[r+1][c] = '^'
						if _, ok := visitados[actual]; ok && visitados[actual] == direccion {
							respuesta++
							break
						} else {
							visitados[actual] = direccion
						}
					}
				} else if direccion == "derecha" {
					if c+1 >= ancho {
						break
					} else if laberinto[r][c+1] == '#' {
						direccion = "abajo"
					} else {
						laberinto[r][c] = '.'
						actual = [2]int{r, c + 1}
						laberinto[r][c+1] = '^'
						if _, ok := visitados[actual]; ok && visitados[actual] == direccion {
							respuesta++
							break
						} else {
							visitados[actual] = direccion
						}
					}
				} else if direccion == "izquierda" {
					if c-1 < 0 {
						break
					} else if laberinto[r][c-1] == '#' {
						direccion = "arriba"
					} else {
						laberinto[r][c] = '.'
						actual = [2]int{r, c - 1}
						laberinto[r][c-1] = '^'
						if _, ok := visitados[actual]; ok && visitados[actual] == direccion {
							respuesta++
							break
						} else {
							visitados[actual] = direccion
						}
					}
				}
			}

			laberinto[actual[0]][actual[1]] = '.'
			laberinto[inicio[0]][inicio[1]] = '^'
			laberinto[fila][columna] = '.'
		}
	}

	fmt.Printf("Parte 2: %d\n", respuesta)
}

func main() {
	parteUno()
	parteDos()
}
