'use strict'

//lesson09. получение данных с DOM элемента
//Получить заголовок "Калькулятор верстки" через метод getElementsByTagName.
// (тэг h1, получить именно элемент, а не коллекцию)
const title = document.getElementsByTagName('h1')[0]
//Получить кнопки "Рассчитать" и "Сброс" через метод getElementsByClassName. (класс handler_btn)
let startButton = document.getElementsByClassName('handler_btn')[0]
const resetButton = document.getElementsByClassName('handler_btn')[1]
//Получить кнопку "+" под выпадающим списком через метод querySelector. (класс screen-btn)
const buttonsPlus = document.querySelector('.screen-btn')
//Получить все элементы с классом other-items в две разные переменные.
//В первую элементы у которых так же присутствует класс percent,
//во вторую элементы у которых так же присутствует класс number через метод querySelectorAll.
const otherItemsPercent = document.querySelectorAll('.other-items.percent')
const otherItemsNumber = document.querySelectorAll('.other-items.number')
//Получить input type=range через его родителя с классом rollback
//одним запросом через метод querySelector.
const inputRange = document.querySelector('.rollback input')
const inputRangeValue = document.querySelector('.rollback .range-value')
//Получить все инпуты с классом total-input справа через метод getElementsByClassName.
// (класс total-input, получить именно элементы, а не коллекции)
const inputTotal = document.getElementsByClassName('total-input')[0]
const inputCountScreens = document.getElementsByClassName('total-input')[1]
const inputService = document.getElementsByClassName('total-input')[2]
const inputFullPrice = document.getElementsByClassName('total-input')[3]
const inputWithRollback = document.getElementsByClassName('total-input')[4]
//Получить все блоки с классом screen в изменяемую переменную ( let )
//через метод querySelectorAll (далее мы будем переопределять ее значение)
let screens = document.querySelectorAll('.screen')
//выбор списка, чтобы разблокирвоать кнопку Рассчитать
const options = document.querySelectorAll('option')
//---------------------блок объявления переменных------------------------------
const appData = {
  //блок определения свойств объекта
  title: '',
  screens: [],
  screenPrice: 0,
  screenCounts: 0,
  adaptive: true,
  servicePricePercent: 0,
  servicePriceNumber: 0,
  fullPrice: 0,
  servicesPercent: {},
  servicesNumber: {},
  serviceWithRollback: 0,
  rollback: 0,

  //запуск приложения
  init: function () {
    appData.addTitle()
    startButton.addEventListener('click', appData.start)
    buttonsPlus.addEventListener('click', appData.addScreenBlock)
    //запуск функций для управления input[type=range]
    inputRange.addEventListener('input', appData.getRollback)
  },
  //получение title
  addTitle: function () {
    document.title = title.innerText
  },
  //метод запуска приложения
  start: function () {
    appData.isDataScreenEnter()
    if (!startButton.disabled) {
      appData.addScreens()
      appData.addServices()
      appData.getPrices()
      appData.showResult()
    }
    appData.setBtnEnabled()
    // appData.logger();
  },
  //метод для считывания типов экранов и их количества и записи в свойство screens объекта appData
  addScreens: function () {
    //переопределение массива screen
    screens = document.querySelectorAll('.screen')
    screens.forEach(function (screen, id) {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].innerText

      appData.screens.push({
        id: id,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      })
    })
  },
  //метод для создания нового блока для считывания информации о screen
  addScreenBlock: function () {
    screens = document.querySelectorAll('.screen')
    const cloneScreen = screens[0].cloneNode(true)
    screens[screens.length - 1].after(cloneScreen)
  },
  //метод для определения дополнительных сервисов в процентах
  addServices: function () {
    otherItemsPercent.forEach(function (item) {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')
      //проверка на то,что флажок checkbox выбран
      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value
      }
    })

    otherItemsNumber.forEach(function (item) {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')
      //проверка на то,что флажок checkbox выбран
      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value
      }
    })
  },

  getPrices: function () {
    appData.screenPrice = appData.screens.reduce(function (sum, item) {
      return sum + item.price
    }, 0)

    for (let key in appData.servicesNumber) {
      appData.servicePriceNumber += appData.servicesNumber[key]
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricePercent += appData.screenPrice * (appData.servicesPercent[key] / 100)
    }

    appData.fullPrice = appData.screenPrice + appData.servicePriceNumber + appData.servicePricePercent

    appData.getServiceWithRollback();

    //подсчёт общего количества экранов
    appData.screenCounts = appData.screens.reduce(function (sum, item) {
      return sum + item.count
    }, 0)
  },

  showResult: function () {
    inputTotal.value = appData.screenPrice
    inputService.value = appData.servicePricePercent + appData.servicePriceNumber
    inputFullPrice.value = appData.fullPrice
    inputWithRollback.value = appData.serviceWithRollback
    inputCountScreens.value = appData.screenCounts

  },
  //установка свойства disabled в true кнопки Рассчитать
  isDataScreenEnter: function () {
    screens = document.querySelectorAll('.screen')
    screens.forEach(function (screen) {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].innerText

      if (selectName === '' || +input.value === 0 || selectName === 'Тип экранов') {
        startButton.disabled = true
      }
    })

  },
  //отмена свойства disabled в false кнопки Рассчитать
  setBtnEnabled: function () {
    startButton.disabled = false
  },

  //метод нахождения rollback
  getRollback: function (event) {
    inputRangeValue.value = event.target.value
    inputRangeValue.textContent = event.target.value + '%'
    appData.rollback = inputRangeValue.value
    appData.getServiceWithRollback();
  },

  getServiceWithRollback: function () {
    appData.serviceWithRollback = Math.ceil(
      appData.fullPrice - appData.fullPrice * (appData.rollback / 100))
    appData.showResult()
  },

}

//------------запуск приложения-------------------
appData.init()
//--------------------------------------------------------------------------------------------
//----------------- возможно понадобится -----------
//метод для определения дополнительных сервисов в числах
//   addServicesNumber: function () {
//     otherItemsNumber.forEach(function (item) {
//       const check = item.querySelector('input[type=checkbox]')
//       const label = item.querySelector('label')
//       const input = item.querySelector('input[type=text]')

//       console.log(check)
//       console.log(label)
//       console.log(input)
//     })
//     console.log(otherItemsPercent)
//   },
//метод запроса первоначальных данных
//   asking: function () {
//запрос наименования проекта и его проверка на string
// do {
//   appData.title = prompt('Как называется Ваш проект?')
// } while (!appData.isString(appData.title))

//цикл for используется для получения информации о типах экранов
// for (let i = 0; i < 2; i++) {
//   let name
//   let answerPrice = 0
//   //запрос наименований экранов и их проверка на string
//   do {
//     name = prompt('Какие типы экранов нужно разработать?')
//   } while (!appData.isString(name))
//   //запрос на стоимость разработок экранов и проверка на number
//   do {
//     answerPrice = prompt('Сколько будет стоить данная работа?')
//   } while (!appData.isNumber(answerPrice))
//   answerPrice = Number(answerPrice)
//   //наполнение массива данных об экранах
//   this.screens.push({ id: 1, name: name, price: answerPrice })
// }

//цикл for используется для получения информации о дополнительных сервисах
//     for (let i = 0; i < 2; i++) {
//       let answerPrice = 0
//       let name
//       //запрос наименования доуслуги и его проверка на string
//       do {
//         name = prompt('Какой дополнительный тип услуги №1 нужен?')
//       } while (!appData.isString(name))
//       //запрос на стоимость допуслуг и проверка на number
//       do {
//         answerPrice = prompt('Сколько это будет стоить?')
//       } while (!appData.isNumber(answerPrice))
//       answerPrice = Number(answerPrice)
//       //наполнение объекта данными о допуслугах
//       appData.services[name + i] = answerPrice
//     }
//   },

//getPrices - метод отвечающий за расчёты цен

// //метод проверки на number
// isNumber: function (num) {
//   return !isNaN(parseFloat(num)) && isFinite(num)
// },

// //метод проверки на string
// isString: function (str) {
//   return typeof str === 'string' && isNaN(Number(str))
// },



//   //метод получения отредактированного названия проекта
//   getTitle: function () {
//     let firstCharBig

//     do {
//       appData.title = appData.title.trim()
//     } while (appData.title.indexOf(' ') === 0)

//     appData.title = appData.title.toLowerCase()
//     //первая буква в строке переводится в большой регистр
//     firstCharBig = appData.title[0].toUpperCase()
//     // методом replace изменяется первая строка title на firstCharBig
//     appData.title = appData.title.replace(appData.title[0], firstCharBig)
//   },



//метод вычисления скидки
// getRollBackMesssage: function (price) {
//   switch (true) {
//     case price >= 30000:
//       return 'Даем скидку в 10%'
//       break
//     case price >= 15000 && price < 30000:
//       return 'Даем скидку в 5%'
//       break
//     case price >= 0 && price < 15000:
//       return 'Скидка не предусмотрена'
//       break
//     case price < 0:
//       return 'Что то пошло не так'
//       break
//   }
// },

// logger: function () {
//   console.log(appData.fullPrice)
//   console.log(appData.servicePercentPrice)
// },