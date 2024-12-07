#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

uint64_t concat(uint64_t x, int y) {
  static char buffer[100];
  static uint64_t result;

  sprintf(buffer, "%lu", x);
  sprintf(buffer + strlen(buffer), "%d", y);

  sscanf(buffer, "%lud", &result);

  return result;
}

uint64_t solve_line_helper(uint64_t target, uint64_t result, int current,
                           int operands[], int noperands) {
  if (result == target && current >= noperands)
    return result;

  if (result > target || current >= noperands)
    return 0;

  int y = operands[current];

  if (solve_line_helper(target, result * y, current + 1, operands, noperands) ==
      target)
    return target;

  if (solve_line_helper(target, result + y, current + 1, operands, noperands) ==
      target)
    return target;

  if (solve_line_helper(target, concat(result, y), current + 1, operands,
                        noperands) == target) {
    return target;
  }

  return 0;
}

uint64_t solve_line(const char *line) {
  uint64_t test_value;
  sscanf(line, "%lud:", &test_value);

  int operands[100] = {};
  int noperands = 0;

  char *ptr = strchr(line, ' ');

  for (; ptr != NULL;) {
    int c = sscanf(ptr, " %d", &operands[noperands]);
    if (c != 1) {
      break;
    }

    noperands++;

    ptr = strchr(ptr + 1, ' ');
  }

  if (noperands < 1)
    return 0;

  uint64_t result =
      solve_line_helper(test_value, operands[0], 1, operands, noperands);
  assert(result == 0 || result == test_value);

  return result;
}

uint64_t solve(FILE *fp) {
  char line[1000] = {};
  uint64_t total = 0;

  while (fgets(line, sizeof(line), fp) != NULL) {
    if (*line != '\0') {
      *strchr(line, '\n') = '\0';
      total += solve_line(line);
      memset(line, 0, sizeof(line));
    }
  }

  return total;
}

int main() {
  char *filename = "input.txt";
  FILE *fp = fopen(filename, "r");

  uint64_t part1 = solve(fp);
  printf("Part one: %lud\n", part1);
}
