package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"io/ioutil"
)

func main() {
	filePath := "./input.txt"
	_, err := os.Stat(filePath)
	if err != nil {
		fmt.Println("Archivo no encontrado en la ruta:", filePath)
		return
	}

	contenido, err := ioutil.ReadFile(filePath)
	if err != nil {
		fmt.Println("Error al leer el archivo:", err)
		return
	}

	system_f := strings.TrimSpace(string(contenido))
	
	var bloques []string
	fileId := 0
	for i := 0; i < len(system_f); i += 2 {
		size, err := strconv.Atoi(string(system_f[i]))
		if err != nil {
			fmt.Println("Error al convertir el tamaño:", err)
			return
		}

		if i+1 < len(system_f) {
			space, err := strconv.Atoi(string(system_f[i+1]))
			if err != nil {
				fmt.Println("Error al convertir el espacio:", err)
				return
			}

			if size > 0 {
				for j := 0; j < size; j++ {
					bloques = append(bloques, strconv.Itoa(fileId))
				}
			}

			if space > 0 {
				for j := 0; j < space; j++ {
					bloques = append(bloques, ".")
				}
			}

			fileId++
		} else if size > 0 {
			for j := 0; j < size; j++ {
				bloques = append(bloques, strconv.Itoa(fileId))
			}
		}
	}

	bloquesMod := make([]string, len(bloques))
	copy(bloquesMod, bloques)
	for i := 0; i < len(bloquesMod); i++ {
		if bloquesMod[i] == "." {
			for j := len(bloquesMod) - 1; j > i; j-- {
				if bloquesMod[j] != "." {
					bloquesMod[i] = bloquesMod[j]
					bloquesMod[j] = "."
					break
				}
			}
		}
	}

	checksumOriginal := 0
	for index, block := range bloquesMod {
		if block != "." {
			fileId, err := strconv.Atoi(block)
			if err == nil {
				checksumOriginal += index * fileId
			}
		}
	}

	fmt.Printf("El checksum original es: %d\n", checksumOriginal)

	bloquesMod2 := make([]string, len(bloques))
	copy(bloquesMod2, bloques)
	for i := len(bloquesMod2) - 1; i >= 0; i-- {
		if bloquesMod2[i] != "." {
			currentBlock := bloquesMod2[i]
			count := 1
			for j := i - 1; j >= 0; j-- {
				if bloquesMod2[j] == currentBlock {
					count++
				} else {
					break
				}
			}
			spacesNeeded := count
			firstFreeSpace := -1
			consecutiveSpaces := 0
			canMove := false
			for j := 0; j < i-count+1; j++ {
				if bloquesMod2[j] == "." {
					if firstFreeSpace == -1 {
						firstFreeSpace = j
					}
					consecutiveSpaces++
					if consecutiveSpaces == spacesNeeded {
						canMove = true
						break
					}
				} else {
					firstFreeSpace = -1
					consecutiveSpaces = 0
				}
			}
			if canMove {
				for k := 0; k < count; k++ {
					bloquesMod2[firstFreeSpace+k] = currentBlock
					bloquesMod2[i-k] = "."
				}
			}
			i -= (count - 1)
		}
	}

	checksumCompactado := 0
	for index, block := range bloquesMod2 {
		if block != "." {
			fileId, err := strconv.Atoi(block)
			if err == nil {
				checksumCompactado += index * fileId
			}
		}
	}
	fmt.Printf("El checksum después de compactar es: %d\n", checksumCompactado)
}
