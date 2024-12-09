import numpy as np

with open("input.txt", 'r') as archivo:
    mapa_antenas = np.array([list(linea.strip()) for linea in archivo.readlines()])
filas, columnas = mapa_antenas.shape
antenas = []
tipos_antenas = {}
antinodos = set()

antenas_pos = np.where(mapa_antenas != '.')
for i, j in zip(antenas_pos[0], antenas_pos[1]):
    antena = mapa_antenas[i, j]
    if antena not in tipos_antenas:
        tipos_antenas[antena] = []
    tipos_antenas[antena].append((i, j))

def calcular_antinode(pr1, pr2):
    x1, y1 = pr1
    x2, y2 = pr2
    newx = x2 + (x2 - x1)
    newy = y2 + (y2 - y1)
    antinodos.add((x2, y2))
    while 0 <= newx < filas and 0 <= newy < columnas:
        antinodos.add((newx, newy))
        newx += (x2 - x1)
        newy += (y2 - y1)

for tipo, posiciones in tipos_antenas.items():
    for i in range(len(posiciones)):
        for j in range(i+1, len(posiciones)):
            pos1 = posiciones[i]
            pos2 = posiciones[j]
            vector_dist = (pos2[0] - pos1[0], pos2[1] - pos1[1])
            antinodo1 = (pos1[0] - vector_dist[0], pos1[1] - vector_dist[1])
            antinodo2 = (pos2[0] + vector_dist[0], pos2[1] + vector_dist[1])
            if (0 <= antinodo1[0] < filas and 0 <= antinodo1[1] < columnas):
                antinodos.add(antinodo1)
            if (0 <= antinodo2[0] < filas and 0 <= antinodo2[1] < columnas):
                antinodos.add(antinodo2)



print("Antinodos entre antenas #1:", len(antinodos))

for tipo, posiciones in tipos_antenas.items():
    for i in range(len(posiciones)):
        for j in range(i + 1, len(posiciones)):
            pos1 = posiciones[i]
            pos2 = posiciones[j]
            calcular_antinode(pos1, pos2)
            calcular_antinode(pos2, pos1)

def detectar_antenas_alineadas():
    antinodos_locales = set()
    for fila in range(filas):
        antenas_en_fila = [j for j in range(columnas) if mapa_antenas[fila, j] != '.']
        if len(antenas_en_fila) > 1:
            for j in antenas_en_fila:
                antinodos_locales.add((fila, j))
    for columna in range(columnas):
        antenas_en_columna = [i for i in range(filas) if mapa_antenas[i, columna] != '.']
        if len(antenas_en_columna) > 1:
            for i in antenas_en_columna:
                antinodos_locales.add((i, columna))

    return antinodos_locales

antinodos.update(detectar_antenas_alineadas())
print("Antinodos únicos #2:", len(antinodos))
