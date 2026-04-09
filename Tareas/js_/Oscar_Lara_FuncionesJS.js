// Oscar Lara A01781855

// Función Bubble Sort 
function bubbleSort(arr){
    for (let i = 0; i < arr.length; i++){
        for (let j = arr.length - 1; j > 0; j--)
            if (arr[j] < arr[j-1]) {
                let a = arr[j];
                let b = arr[j-1]
                arr[j] = b;
                arr[j-1] = a;
            }
    }
    return arr
}
let arraydemo = [20, 30, 10, 50, 25, 35, 70];
let arraysort = bubbleSort(arraydemo);
console.log(arraysort);

// Función para poner la primera letra de cada palabra dentro de un string en Mayusc

function capitalize(st){
    return st.split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
    }
    
let stringTest = "hola como estás!"
console.log(capitalize(stringTest))

// Función que borra elementos duplicados de un arreglo y regresa una lsita con los que quedan

function deDuplicate(arr){
    let new_arr = []
    for (let i = 0; i < arr.lenght -1; i++){
        if (arr[i] in new_arr){
        }
        else{
            new_arr.push(arr[i]);
        }
    }
    return new_arr
}

let arrTest = [1, 3, 2, 4, 3, 1, 7, 1, 7];

console.log(deDuplicate(arrTest))

// Función que regresa todos los factores de un número

function factorize(num){
    let factor = 1
    let factores = []
    while (factor < num + 1){
        if (num % factor == 0){
            factores.push(factor);
        }
        factor++
    }
    return factores
}

console.log(factorize(15))

// Función para hacer lenguaje normal a Hackerspeak

function hackerSpeak(st){
    st = st.replaceAll('a', '4').replaceAll('A', '4');
    st = st.replaceAll('e', '3').replaceAll('E', '3');
    st = st.replaceAll('i', '1').replaceAll('I', '1');
    st = st.replaceAll('o', '0').replaceAll('O', '0');
    st = st.replaceAll('s', '5').replaceAll('S', '5');
    st = st.replaceAll('t', '7').replaceAll('T', '7');
    return st;
}

let stringTest4 = "Hola como estas? Me puedes dar tu numero?"
console.log(hackerSpeak(stringTest));

// Máximo común divisor

function MCD(num1, num2){
    if (num2 == 0){
        return num1;
    }
    else {
        return MCD(num2, num1 % num2);
    }
}
let mcd = MCD(36, 16)
console.log(mcd)

// Función que revise si una cadena de texto es un palíndromo o no

function isPalindrome(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversedStr = cleanStr.split("").reverse().join("");
    return cleanStr === reversedStr;
}

// Función tome una lsita de strings y devuelva una lista ordenada de strings

function sortStrings(arr) {
    return [...arr].sort();
}

// Función que toma una lista de numeros y devuelve una lista de estadisticas básicas

function stats(nums) {
    // Promedio
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;

    // Moda
    const freq = {};
    let moda = nums[0];
    let maxFreq = 0;

    nums.forEach(n => {
        freq[n] = (freq[n] || 0) + 1;
        if (freq[n] > maxFreq) {
            maxFreq = freq[n];
            moda = n;
        }
    });

    return [avg, moda];
}

// Función que regresa el string más frecuente en una lista

function popularString(arr) {
    const counts = {};
    return arr.reduce((best, current) => {
        counts[current] = (counts[current] || 0) + 1;
        if (!best || counts[current] > counts[best]) {
            return current;
        }
        return best;
    }, "");
}

// Función que verifica si un número es potencia de 2

function isPowerOf2(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

// Función que ordena de forma descendente

function sortDescending(nums) {
    return [...nums].sort((a, b) => b - a);
}

// función que invierte un array y regresa un nuevo array

function invertArray(arr) {
    let newArr = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        newArr.push(arr[i]);
    }
    return newArr;
}

// Funcion que invierte un array modificando el array original

function invertArrayInplace(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        // Intercambio de valores (Swap) usando una variable temporal
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        // Movemos los punteros hacia el centro
        left++;
        right--;
    }
    // No es estrictamente necesario retornar en "inplace", pero se puede hacer
    return arr;
}

/*
My very first time with JavaScript

Oscar Miguel Lara Elizondo
2026-03-25
*/
"use strict";
console.log("Hello World!")

// Create a few variables
// Constant values (will not change)
const name = "Oscar";
// A variable that cna change
let age = 19;

// Global variables (avoid this)
var id = 23456;

let position = "Student";

console.log(`Hello my name is ${name}`);

// Función que encuentra el shortest string de una lista de strings

function findShortestString(arr) {
    let shortestStr = ""
    for (let i = 0; i < arr.length; i++){
        if (i === 0){
            shortestStr = arr[i];
        }
        else{
            if(arr[i].length < shortestStr.length){
                shortestStr = arr[i]
            }
        }
    }
    return shortestStr
}

let arrayTest = ["Hola", "Como estas?", "Que hora es?", "Si"]

console.log(findShortestString(arrayTest));

/*
 * Functions to find the first non repeating
 *
 * Oscar Lara
 * 2026-03-26
 */

function firstNonRepeating(string){
    let map = new Map();
    for (let i = 0; i < string.length; i++){
        map.set (string[i],1)
            if (map.has(string[i])){
                map.set(string[i],map.get(string[i]+1))
                return
            }
    }
    return
}
export {firstNonRepeating}

console.log(firstNonRepeating("xabcabc"))

function firstNonRepeating2(string) {
    const letters = []; // Aquí guardaremos objetos como {char: 'a', count: 1}

    // 1. Primer paso: Llenar el historial de letras
    for (let i = 0; i < string.length; i++) {
        let found = false;
        let currentChar = string[i];

        // Revisamos si ya tenemos esta letra en nuestro array 'letters'
        for (let item of letters) {
            if (item.char === currentChar) {
                item.count++; // Si ya existe, aumentamos el contador
                found = true;
                break;
            }
        }

        // Si terminamos de buscar y no estaba, la agregamos por primera vez
        if (!found) {
            letters.push({ char: currentChar, count: 1 });
        }
    }

    // 2. Segundo paso: Buscar la primera que tenga conteo de 1
    for (let index in letters) {
        if (letters[index].count === 1) {
            console.log("La primera que no se repite es:", letters[index].char);
            return letters[index].char;
        }
    }

    return "Todas se repiten"; // Por si no encontramos ninguna
}

firstNonRepeating2("abcxabc");


