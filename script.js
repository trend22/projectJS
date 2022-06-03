'use strict'
//---------------------блок объявления переменных------------------------------
const appData = {

    title: '',
    screens: '',
    screenPrice: 0,
    adaptive: true,
    service1: '',
    service2: '',
    allServicePrices: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    rollback: 20,

    //метод запуска приложения
    start: function () {
        appData.asking();

        //получаем сумму всех дополнительных услуг
        appData.allServicePrices = appData.getAllServicePrice();
        //получаем полную стоимость без вычита отката
        appData.fullPrice = appData.getFullPrice();
        //итоговая стоимость минус сумма отката
        appData.servicePercentPrice = appData.getServicePercentPrices();
        //получение нового title
        appData.title = appData.getTitle();
        //вывод в консоль
        appData.logger();
    },

    //метод запроса первонаальных данных
    asking: function () {

        appData.title = prompt('Как называется Ваш проект?', 'Калькулятор сайта');

        while (appData.title === '' || appData.title === null) {
            appData.title = prompt('Как называется Ваш проект?', 'Калькулятор сайта');
        }

        appData.screens = prompt('Какие типы экранов нужно разработать?', 'Простые, сложные');

        do {
            appData.screenPrice = prompt('Сколько будет стоить данная работа?');
        }
        while (!appData.isNumber(appData.screenPrice))
        appData.screenPrice = Number(appData.screenPrice);

        appData.adaptive = confirm('Нужен ли адаптив на сайте?');
    },

    //метод получения суммы дополнительных сервисов
    getAllServicePrice: function () {
        let sum = 0;
        let answerPrice = 0;

        for (let i = 0; i < 2; i++) {

            if (i === 0) {
                appData.service1 = prompt('Какой дополнительный тип услуги №1 нужен?', 'простой');
            } else if (i === 1) {
                appData.service2 = prompt('Какой дополнительный тип услуги №2 нужен?', 'сложный');
            }


            do {
                answerPrice = prompt('Сколько это будет стоить?');
            }
            while (!appData.isNumber(answerPrice))
            answerPrice = Number(answerPrice);
            sum += answerPrice;

        }

        return sum;
    },

    //метод проверки на число
    isNumber: function (num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    },

    //метод вычисления полной стоимости проекта
    getFullPrice: function () {
        return appData.screenPrice + appData.allServicePrices;
    },

    //метод получения отредактированного названия проекта
    getTitle: function () {
        let firstCharBig;

        do {
            appData.title = appData.title.trim();
        }
        while (appData.title.indexOf(' ') === 0)

        appData.title = appData.title.toLowerCase();
        //первая буква в строке переводится в большой регистр
        firstCharBig = appData.title[0].toUpperCase();
        // методом replace изменяется первая строка title на firstCharBig
        appData.title = appData.title.replace(appData.title[0], firstCharBig);

        return appData.title;
    },

    //метод получения конечной стоимости проекта за вычетом отката
    getServicePercentPrices: function () {
        return Math.ceil(appData.fullPrice - (appData.fullPrice * (appData.rollback / 100)));
    },

    //метод вычисления скидки
    getRollBackMesssage: function (price) {
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
    },

    logger: function () {
        for (let key in appData) {
            console.log('Свойство/метод: ' + key + ' равен ' + appData[key]);
        }

        // console.log(appData.screens);
        // console.log('allServicePrices', appData.allServicePrices);
        // console.log('screenPrice', appData.screenPrice);
        // console.log('fullPrice', appData.fullPrice);
        // console.log(appData.getRollBackMesssage(appData.fullPrice));
        // console.log('стоимость за вычетом процента отката посреднику ' + appData.servicePercentPrice + ' рублей/ долларов/гривен/юани');
    }
}

//------------запуск приложения-------------------
appData.start();