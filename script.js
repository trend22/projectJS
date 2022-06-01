'use strict'
//---------------------блок объявления переменных------------------------------
let title;
let screens;
let screenPrice;
let adaptive;
let service1;
let service2;

//объявляем переменную для суммы всех дополнительных услуг
let allServicePrices;   
let fullPrice;
let servicePercentPrice;

const rollback = 20;



//---------------------------блок описания функций----------------------

//функция проверки на number
const isNumber = function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

const asking = function () {
    
    title = prompt('Как называется Ваш проект?', 'Калькулятор сайта');
    while(title === '' || title === null){ 
        title = prompt('Как называется Ваш проект?', 'Калькулятор сайта');
    }

    screens = prompt('Какие типы экранов нужно разработать?', 'Простые, сложные');
    
    do {
        screenPrice = prompt('Сколько будет стоить данная работа?');
     } while(!isNumber(screenPrice))
    screenPrice = Number(screenPrice);

    adaptive = confirm('Нужен ли адаптив на сайте?');
}

const showTypeOf = function (variable) {
    console.log(variable, typeof variable);
}

const getAllServicePrice = function () {
   let sum = 0;
   let answerPrice = 0;

   for(let i = 0; i < 2; i++) {
    
    if(i === 0) {
        service1 = prompt('Какой дополнительный тип услуги №1 нужен?', 'простой');
    } else if (i === 1) {
        service2 = prompt('Какой дополнительный тип услуги №2 нужен?', 'сложный');
    }
    
    
    do {
        answerPrice = prompt('Сколько это будет стоить?');
    } while(!isNumber(answerPrice))
    answerPrice = Number(answerPrice);
    sum += answerPrice;
        
   }

     return sum;
}

const getFullPrice = function () {
    return screenPrice + allServicePrices;
}

const getTitle = function () {
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

const getServicePercentPrices = function () {
    return Math.ceil(fullPrice - (fullPrice * (rollback/100)));
}

const getRollBackMesssage = function (price) {
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
asking();
//получаем сумму всех дополнительных услуг
allServicePrices = getAllServicePrice();
//получаем полную стоимость без вычита отката
fullPrice = getFullPrice();
//итоговая стоимость минус сумма отката
servicePercentPrice = getServicePercentPrices();
//получение нового title
title = getTitle();



//-------------------------блок вывода в консоль, мусорный блок-----------------------------
showTypeOf(title);
showTypeOf(screenPrice);
showTypeOf(allServicePrices);
showTypeOf(fullPrice);
showTypeOf(adaptive);

console.log(screens);
console.log('allServicePrices', allServicePrices);
console.log('screenPrice', screenPrice);
console.log('fullPrice', fullPrice);
console.log(getRollBackMesssage(fullPrice));
console.log('стоимость за вычетом процента отката посреднику ' + servicePercentPrice + ' рублей/ долларов/гривен/юани');