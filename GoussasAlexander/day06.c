#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

#define W 1130
#define H 130

#define ZERO_INIT(a, h, w) \
    for (int i = 0; i < h; i++) \
    for (int j = 0; j < w; j++) \
    a[i][j] = 0;

#define ZERO_INIT2(a, d, h, w)  \
    for (int x = 0; x < d; x++) \
    for (int i = 0; i < h; i++) \
    for (int j = 0; j < w; j++) \
    a[x][i][j] = 0;

typedef enum {
    NORTH,
    SOUTH,
    WEST,
    EAST,
} Direction;

typedef struct {
    int x;
    int y;
} Point;

typedef struct {
    Direction direction;
    Point position;
} Guard;

typedef enum {
    OBSTACLE,
    FLOOR,
} Cell;

typedef struct {
    Guard guard;
    Cell cells[H][W];
} Map;

Point direction_vector(Direction direction) {
    switch (direction) {
        case NORTH: return (Point){-1, 0};
        case SOUTH: return (Point){1, 0};
        case WEST: return  (Point){0, -1};
        case EAST: return  (Point){0, 1};
    }
}

Direction direction_to_right(Direction direction) {
    switch (direction) {
        case NORTH: return EAST;
        case SOUTH: return WEST;
        case WEST: return NORTH;
        case EAST: return SOUTH;
    }
}

void parse(const char *input, Guard *guard, Cell cells[H][W]) {
    int x = 0;
    int y = 0;
    int i = 0;

    while (input[i] != '\0') {
        char c = input[i];
        
        if (c == '^')
            guard->position = (Point){.x = x, .y = y};

        if (c == '#')
            cells[x][y] = OBSTACLE;

        if (c == '.')
            cells[x][y] = FLOOR;

        if (c == '\n') {
            x += 1;
            y = 0;
        }
        else
            y += 1;

        i += 1;
    }
}

int part1(Guard guard, Cell cells[H][W], Point *path, Point **last) {

    int visited[H][W];
    int nvisited = 0;
    ZERO_INIT(visited, H, W);

    int directions[4][H][W];
    ZERO_INIT2(directions, 4, H, W);

    int path_index = 0;

    while (
        guard.position.x > 0 &&
        guard.position.x < H - 1 &&
        guard.position.y > 0 &&
        guard.position.y < W - 1
    ) {
        Point d = direction_vector(guard.direction);
        Point p = {guard.position.x + d.x, guard.position.y + d.y};

        int *dptr = &directions[guard.direction][guard.position.x][guard.position.y];
        if (*dptr != 0) {
            return -1;
        }

        *dptr = 1;

        int *vptr = &visited[guard.position.x][guard.position.y];
        if (*vptr == 0) {
            nvisited += 1;
        }

        *vptr = 1;

        path[path_index++] = p;

        switch (cells[p.x][p.y]) {
            case FLOOR:
                guard.position = p;
                break;
            case OBSTACLE:
                guard.direction = direction_to_right(guard.direction);
                break;
        }
    }

    *last = &path[path_index];

    return nvisited + 1;
}

int part2(Guard guard, Cell cells[H][W]) {
    Point path[10000];
    Point dummy[10000];

    Point *last;
    Point *dummy_last;

    int count = 0;

    part1(guard, cells, path, &last);

    for (Point *p = path+1; p != last; p++) {
        Cell *cell = &cells[p->x][p->y];
        Cell original = *cell;

        *cell = OBSTACLE;

        if (part1(guard, cells, dummy, &dummy_last) == -1) {
            count += 1;
        }

        *cell = original;
    }

    return count;
}

int main() {
    char* filename = "input.txt";
    FILE* fp = fopen(filename, "r");

    fseek(fp, 0, SEEK_END);
    int fsize = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    char *buffer = calloc(fsize + 1, sizeof(char));
    fread(buffer, sizeof(char), fsize, fp);

    Guard guard;
    guard.direction = NORTH;
    Cell cells[H][W];
    parse(buffer, &guard, cells);

    Point path[10000];
    Point* last;
    
    printf("Part one: %d\n", part1(guard, cells, path, &last));
    printf("Part two: %d\n", part2(guard, cells));

    free(buffer);
}
