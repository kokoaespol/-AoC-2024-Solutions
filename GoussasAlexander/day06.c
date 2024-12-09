#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define W 130
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
    NORTH = 0,
    SOUTH = 1,
    WEST  = 2,
    EAST  = 3,
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

static Cell cells[H][W];
static pthread_mutex_t cells_mutex = PTHREAD_MUTEX_INITIALIZER;

static int visited1[H][W];
static int visited2[H][W];

void parse(const char *input, Guard *guard, Cell cells[H][W]) {
    int x = 0;
    int y = 0;
    int i = 0;

    while (input[i] != '\0') {
        char c = input[i];
        
        if (c == '^') {
            guard->position = (Point){.x = x, .y = y};
            cells[x][y] = FLOOR;
        }

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

int part1(Guard guard, Point *path, Point **last, Point obstacle) {
    int nvisited = 0;
    ZERO_INIT(visited1, H, W);

    static __thread int directions[4][H][W];
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
            *last = &path[path_index];
            return -1;
        }

        *dptr = 1;

        int *vptr = &visited1[guard.position.x][guard.position.y];
        if (*vptr == 0) {
            nvisited += 1;
        }

        *vptr = 1;

        if (p.x == obstacle.x && p.y == obstacle.y) {
            guard.direction = direction_to_right(guard.direction);
            continue;
        }

        switch (cells[p.x][p.y]) {
            case FLOOR:
                path[path_index++] = guard.position;
                guard.position = p;
                break;
            case OBSTACLE:
                guard.direction = direction_to_right(guard.direction);
                break;
        }
    }

    path[path_index++] = guard.position;
    *last = &path[path_index];

    return nvisited + 1;
}

struct t {
    int start;
    int end;
    Point *path;
    Guard guard;
    int count;
};

void* count_cycles(void *data) {
    static Point dummy[10000];
    static Point *dummy_last;

    struct t *t = data;

    int start = t->start;
    int end = t->end;
    Point *path = t->path;
    Guard guard = t->guard;

    for (int i = start; i < end; i++) {
        Point *p = &path[i];

        if (visited2[p->x][p->y] == 1)
            continue;

        if (part1(guard, dummy, &dummy_last, *p) == -1) {
            t->count += 1;
        }

        visited2[p->x][p->y] = 1;
    }

    return NULL;
}

int part2(Guard guard) {
    Point path[10000];
    Point *last;

    ZERO_INIT(visited2, H, W);
    part1(guard, path, &last, (Point){ .x = 131, .y = 131 });

    int n = last - path;

    struct t t1 = { .start = 0, .end = n/4, .path = path, .guard = guard, .count = 0 };
    struct t t2 = { .start = n/4, .end = n/2, .path = path, .guard = guard, .count = 0 };
    struct t t3 = { .start = n/2, .end = n-n/2, .path = path, .guard = guard, .count = 0 };
    struct t t4 = { .start = n-n/2, .end = n, .path = path, .guard = guard, .count = 0 };

    pthread_t tid1, tid2, tid3, tid4;

    pthread_create(&tid1, NULL, count_cycles, (void *)&t1);
    pthread_create(&tid2, NULL, count_cycles, (void *)&t2);
    pthread_create(&tid3, NULL, count_cycles, (void *)&t3);
    pthread_create(&tid4, NULL, count_cycles, (void *)&t4);

    pthread_join(tid1, NULL);
    pthread_join(tid2, NULL);
    pthread_join(tid3, NULL);
    pthread_join(tid4, NULL);

    return t1.count + t2.count + t3.count + t4.count;
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

    parse(buffer, &guard, cells);

    Point path[10000] = {};
    Point* last;
    
    printf("Part one: %d\n", part1(guard, path, &last, (Point){ .x = 131, .y = 131 }));
    printf("Part two: %d\n", part2(guard));

    free(buffer);
}
