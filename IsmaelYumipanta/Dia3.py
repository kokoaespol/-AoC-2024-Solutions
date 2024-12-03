import requests
import re
def mul(x,y):
    return x*y
#llamada hacia el archivo desafio 
Cookies={"session": "53616c7465645f5f00e8d146fd1626a6addd26845d39788437cb61317a408089c0113cf18fcfcc0f5e4cd8f0003f22f3432aaa00e98b81858484c620eacdfb01"}
Url="https://adventofcode.com/2024/day/3/input"
response=requests.get(Url, cookies=Cookies)
if (response.status_code==200):
    print("Conexion lograda")
else: 
    print("error")
    print(response.status_code)
#patron de busqueda del modulo re, para una busqueda avanzada
patron=r"mul\(\d+,\d+\)"
#Lista que contiene todas las palabras mul(x,y) sinedo x, y numeros de 1-3 digitos
lista_funciones_mul=re.findall(patron,response.text)
suma=0
for elemento in lista_funciones_mul:
    parte1,part2=elemento.split(",")
    numero1=parte1.strip("mul(")
    numero2=part2.strip(")")
    suma=suma+mul(int(numero1),int(numero2))
print("La respuesta es: "+str(suma))
