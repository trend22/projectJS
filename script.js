'use strict'
//---------------------блок объявления переменных------------------------------
const appData = {
    //блок определения свойств объекта
    title: '',
    screens: [],
    screenPrice: 0,
    adaptive: true,
    services: {},
    allServicePrices: 0,
    fullPrice: 0,
    servicePercentPrice: 0,
    rollback: 20,

    //метод запуска приложения
    start: function () {
        appData.asking();
        //считаем стоимости
        appData.getPrices();
        //получаем полную стоимость без вычита отката
        appData.getFullPrice();
        //итоговая стоимость минус сумма отката
        appData.getServicePercentPrices();
        //получение нового title
        appData.getTitle();
        //вывод в консоль
        appData.logger();
    },

    //метод запроса первоначальных данных
    asking: function () {
        //запрос наименования проекта и его проверка на string
        do {
            appData.title = prompt('Как называется Ваш проект?');
        } while(!appData.isString(appData.title));
        
         //цикл for используется для получения информации о типах экранов
        for (let i = 0; i < 2; i++) {
            let name;
            let answerPrice = 0;
            //запрос наименований экранов и их проверка на string
            do {
            name = prompt('Какие типы экранов нужно разработать?');
            } while(!appData.isString(name));
            //запрос на стоимость разработок экранов и проверка на number
            do {
                answerPrice = prompt('Сколько будет стоить данная работа?');
            } while (!appData.isNumber(answerPrice))
            answerPrice = Number(answerPrice);
            //наполнение массива данных об экранах
            this.screens.push({id: 1, name: name, price: answerPrice});
        }

        //цикл for используется для получения информации о дополнительных сервисах
        for (let i = 0; i < 2; i++) {
            let answerPrice = 0;
            let name;
            //запрос наименования доуслуги и его проверка на string
            do {
                name = prompt('Какой дополнительный тип услуги №1 нужен?');
            } while(!appData.isString(name));
            //запрос на стоимость допуслуг и проверка на number
            do {
                answerPrice = prompt('Сколько это будет стоить?');
            }
            while (!appData.isNumber(answerPrice))
            answerPrice = Number(answerPrice);
            //наполнение объекта данными о допуслугах
             appData.services[name + i] = answerPrice;
            
        }

        appData.adaptive = confirm('Нужен ли адаптив на сайте?');
    },

    //getPrices - метод отвечающий за расчёты цен
    getPrices: function () {
        // for( let screen of appData.screens) {
        //     appData.screenPrice += screen.price; 
        // }

        appData.screenPrice = appData.screens.reduce(function (sum, item) {
            return sum + item.price;
        }, 0)
         
        for(let key in appData.services) {
            appData.allServicePrices += appData.services[key];
        }
    },

    //метод проверки на number
    isNumber: function (num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    },

    //метод проверки на string
    isString: function(str) {
        return (typeof str === 'string' && isNaN(Number(str)))
    },

    //метод вычисления полной стоимости проекта
    getFullPrice: function () {
        appData.fullPrice =  appData.screenPrice + appData.allServicePrices;
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

        appData.title =  appData.title;
    },

    //метод получения конечной стоимости проекта за вычетом отката
    getServicePercentPrices: function () {
        appData.servicePercentPrice =  Math.ceil(appData.fullPrice - (appData.fullPrice * (appData.rollback / 100)));
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
        console.log(appData.fullPrice);
        console.log(appData.servicePercentPrice);
        console.log(appData.services);
        }
}

//------------запуск приложения-------------------
appData.start();

