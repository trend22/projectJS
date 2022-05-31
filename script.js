'use strict'
//---------------------блок объявления переменных------------------------------
let title = prompt('Как называется Ваш проект?');
let screens = prompt('Какие типы экранов нужно разработать?');
let screenPrice = +prompt('Сколько будет стоить данная работа?');
let adaptive = confirm('Нужен ли адаптив на сайте?');
let service1 = prompt('Какой дополнительный тип услуги №1 нужен?');
let servicePrice1 = +prompt('Сколько это будет стоить?');
let service2 = prompt('Какой дополнительный тип услуги №2 нужен?');
let servicePrice2 = +prompt('Сколько это будет стоить?');

//объявляем переменную для суммы всех дополнительных услуг
let allServicePrices = 0;

let fullPrice = 0;
let servicePercentPrice = 0;

const rollback = 20;

//---------------------------блок описания функций----------------------

const showTypeOf = function (variable) {
    console.log(variable, typeof variable);
}

//1) Объявить функцию getAllServicePrices. 
//Функция возвращает сумму всех дополнительных услуг. 
//Результат сохраняем в переменную allServicePrices. Тип - function expression
function getAllServicePrice() {
    return servicePrice1 + servicePrice2;
}

// 2) Объявить функцию getFullPrice. 
//Функция возвращает сумму стоимости верстки и 
//стоимости дополнительных услуг (screenPrice + allServicePrices). 
//Результат сохраняем в переменную fullPrice. Тип - function declaration
const getFullPrice = function () {
    return screenPrice + allServicePrices;
}

// 3) Объявить функцию getTitle. 
//Функция возвращает title меняя его таким образом: 
//первый символ с большой буквы, остальные с маленькой". 
//Учесть вариант что строка может начинаться с пустых символов. " КаЛьКулятор Верстки"
const getTitle = function (title) {
    let firstCharBig;

    do {
        title = title.trim();
    } while(title.indexOf(' ') === 0)  

    title = title.toLowerCase();
    //первая буква в строке переводится в большой регистр
    firstCharBig = title[0].toUpperCase();
    // методом replace изменяется первая строка title на firstCharBig
    title = title.replace(title[0], firstCharBig);

    return title;
}

// Объявить функцию getServicePercentPrices. 
//Функция возвращает итоговую стоимость за вычетом процента отката. 
//Результат сохраняем в переменную servicePercentPrice 
//(итоговая стоимость минус сумма отката)
const getServicePercentPrices = function () {
    return Math.ceil(fullPrice - (fullPrice * (rollback/100)));
}

const getRollbackMesssage = function (price) {
    switch (true) {
        case price >= 30000:
            return 'Даем скидку в 10%';
            break;
        case price >= 15000 && price < 30000:
            return 'Даем скидку в 5%';
            break;
        case price >= 0 && price < 15000:
            return 'Скидка не предусмотрена';
            break;
        case price < 0:
            return 'Что то пошло не так';
            break;
    }
}


//------------блок функционала, или функциональный блок-------------------
//получаем сумму всех дополнительных услуг
allServicePrices = getAllServicePrice();
//получаем полную стоимость без вычита отката
fullPrice = getFullPrice();
//итоговая стоимость минус сумма отката
servicePercentPrice = getServicePercentPrices();

//-------------------------блок вывода в консоль, мусорный блок-----------------------------
//наименование проекта title уже получаем после обработки
showTypeOf(getTitle(title));
showTypeOf(fullPrice);
showTypeOf(adaptive);

console.log(screens);

console.log(getRollbackMesssage(fullPrice));
console.log('стоимость за вычетом процента отката посреднику ' + servicePercentPrice + ' рублей/ долларов/гривен/юани');