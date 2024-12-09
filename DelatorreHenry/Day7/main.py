from copy import deepcopy

part1 = ["+", "*"]
part2 = ["+", "*", "||"]

def genCombinatiosOfN(n, arr, results, i):
    if i == n:
        results.append(deepcopy(arr))
        return
    for op in part2:
        arr[i] = op
        genCombinatiosOfN(n, arr, results, i + 1)

def evaluar_ecuacion(numeros, operadores):
    total = numeros[0]
    for i, op in enumerate(operadores):
        if op == '+':
            total += numeros[i + 1]
        elif op == '*':
            total *= numeros[i + 1]
        elif op == '||':
            total = int(str(total) + str(numeros[i + 1]))
    return total

if __name__ == "__main__":
    with open("input.txt", "r") as file:
        input_data = file.readlines()
    equations = [[int(a), b.strip().split(' ')] for a, b in [e.split(":") for e in input_data]]
    accepted = []
    max_number_operators = max(len(eq[1]) - 1 for eq in equations)
    operators_combinations = []
    for i in range(1, max_number_operators + 1):
        combinations = [None] * i
        genCombinatiosOfN(i, combinations, operators_combinations, 0)
    count_equations = len(equations)
    for index, eq in enumerate(equations):
        result = eq[0]
        numbers = list(map(int, eq[1]))
        valid_operations = [ops for ops in operators_combinations if len(ops) == len(numbers) - 1]
        for ops in valid_operations:
            if evaluar_ecuacion(numbers, ops) == result:
                eq.append(ops)
                accepted.append(eq)
                break  
        print(f"\rEquation {index + 1} of {count_equations}", end="")
    print("\nResult: ", sum(eq[0] for eq in accepted))
