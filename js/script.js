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
let adaptives = document.querySelectorAll('.other-items')
let cms = document.querySelector('.cms input[type=checkbox]')
//выбор списка, чтобы разблокирвоать кнопку Рассчитать
const options = document.querySelectorAll('option')
//выбор флажка cms
let cmsVariants = document.querySelector('.hidden-cms-variants')
//выбор option 'другое' в cms hidden variants
const optionCmsOther = document.querySelector('.hidden-cms-variants select')
//выбор скрытого  Input для получения value из Option Другое 
let inputHiddenCMSOther = document.querySelector('.hidden-cms-variants .main-controls__input')
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
  cmsPercent: 0,
  isErrorInputDataScreen: false,

  //запуск приложения
  init: function () {
    this.addTitle()
    startButton.addEventListener('click', this.start.bind(appData))
    buttonsPlus.addEventListener('click', this.addScreenBlock)
    //запуск функций для управления input[type=range]
    inputRange.addEventListener('input', this.getRollback)
    resetButton.addEventListener('click', this.reset.bind(appData))
    cms.addEventListener('click', this.addCmsVariants)
    //добавление блока options cms other
    optionCmsOther.addEventListener('click', this.addCmsInput)
  },
  //получение title
  addTitle: function () {
    document.title = title.innerText
  },
  //метод запуска приложения
  start: function () {
    this.isDataScreenEnter()
    if (!this.isErrorInputDataScreen) {
      this.addScreens()
      this.addServices()
      this.addCmsPercent()
      this.getPrices()
      this.showResult()
      this.fixInfo()
    }
    this.isErrorInputDataScreen = false
    // appData.logger();
  },
  // метод сбрасывающий зафиксированную информацию кпонкой Сброс
  reset: function () {
    this.resetScreens()
    this.resetAdaptive()
    this.resetShowResult()
    this.resetCms()
    //смена кнопки Сброс на Рассчитать
    resetButton.style.display = 'none'
    startButton.style.display = ''
  },
  //метод для считывания типов экранов и их количества и записи в свойство screens объекта appData
  addScreens: function () {
    //переопределение массива screen
    screens = document.querySelectorAll('.screen')
    screens.forEach((screen, id) => {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].innerText

      this.screens.push({
        id: id,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      })
    })
  },
  //метод добавляющий процент cms в объект
  addCmsPercent: function () {
    switch (true) {
      case optionCmsOther.selectedIndex === 1:
        this.cmsPercent = 50;
        break;
      case optionCmsOther.selectedIndex === 2:
        let optionCmsOtherInput = document.querySelector('#cms-other-input')
        this.cmsPercent = Number(optionCmsOtherInput.value);
        break;
      default:
        this.cmsPercent = 0;
        break;
    }
  },
  //метод для создания нового блока для считывания информации о screen
  addScreenBlock: function () {
    screens = document.querySelectorAll('.screen')
    const cloneScreen = screens[0].cloneNode(true)
    screens[screens.length - 1].after(cloneScreen)
  },
  //метод для определения дополнительных сервисов в процентах
  addServices: function () {
    otherItemsPercent.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')
      //проверка на то,что флажок checkbox выбран
      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value
      }
    })

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')
      //проверка на то,что флажок checkbox выбран
      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value
      }
    })
  },
  //метод для получения всех рассчётов  
  getPrices: function () {
    this.screenPrice = this.screens.reduce((sum, item) => {
      return sum + item.price
    }, 0)

    for (let key in this.servicesNumber) {
      this.servicePriceNumber += this.servicesNumber[key]
    }

    for (let key in this.servicesPercent) {
      this.servicePricePercent +=
        this.screenPrice * (this.servicesPercent[key] / 100)
    }

    this.fullPrice =
      this.screenPrice + this.servicePriceNumber + this.servicePricePercent
    //добавление к рассчёту опции cms
    this.fullPrice = this.fullPrice + (this.fullPrice * this.cmsPercent / 100)

    this.getServiceWithRollback()

    //подсчёт общего количества экранов
    this.screenCounts = this.screens.reduce((sum, item) => {
      return sum + item.count
    }, 0)
  },

  showResult: function () {
    inputTotal.value = this.screenPrice
    inputService.value = this.servicePricePercent + this.servicePriceNumber
    inputFullPrice.value = this.fullPrice
    inputWithRollback.value = this.serviceWithRollback
    inputCountScreens.value = this.screenCounts
  },
  //установка свойства disabled в true кнопки Рассчитать
  isDataScreenEnter: function () {
    screens = document.querySelectorAll('.screen')
    screens.forEach((screen) => {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].innerText

      if (
        selectName.trim() === '' ||
        +input.value === 0 ||
        selectName === 'Тип экранов'
      ) {
        this.isErrorInputDataScreen = true
      }
    })
  },

  //метод нахождения rollback
  getRollback: function (event) {
    inputRangeValue.value = event.target.value
    inputRangeValue.textContent = event.target.value + '%'
    appData.rollback = inputRangeValue.value
    appData.getServiceWithRollback()
  },

  getServiceWithRollback: function () {
    this.serviceWithRollback = Math.ceil(
      this.fullPrice - this.fullPrice * (this.rollback / 100)
    )
    this.showResult()
  },

  //метод для блокировки вводных inputs и selects
  fixInfo: function () {
    screens = document.querySelectorAll('.screen')
    screens.forEach((screen) => {
      let select = screen.querySelector('select')
      let input = screen.querySelector('input')
      select.disabled = true
      input.disabled = true
    })
    //здесь блокируются галочки label
    adaptives = document.querySelectorAll('.other-items')
    adaptives.forEach((adaptive) => {
      let input = adaptive.querySelector('input')
      input.disabled = true
    })
    //смена кнопки Рассчитать на Сброс
    startButton.style.display = 'none'
    resetButton.style.display = ''
    //блокировка кнопки добавлений Screens
    buttonsPlus.disabled = true
  },

  //метод удаляющий screens
  resetScreens: function () {
    screens = document.querySelectorAll('.screen')
    screens.forEach((screen, index) => {
      if (index !== 0) {
        screen.remove()
      } else {
        let select = screen.querySelector('select')
        let input = screen.querySelector('input')
        select.disabled = false
        input.disabled = false
        select.innerHTML =
          '<select name="views-select">' +
          '<option value="" selected>Тип экранов</option>' +
          '<option value="500">Простых 500руб * n</option>' +
          '<option value="700">Сложных 700руб * n</option>' +
          '<option value="800">Интерактивных 800руб * n</option>' +
          '<option value="100">Форм 100руб * n</option>' +
          '<option value="300">Слайдеров 300руб * n</option>' +
          '<option value="200">Модальные окна 200руб * n</option>' +
          '<option value="100">Анимация в блоках 100руб * n</option>' +
          '</select>'
        input.value = ''
        input.innerHTML =
          '<input type="text" placeholder="Количество экранов">' + '</input>'
      }
      buttonsPlus.disabled = false
    })

    this.screens.splice(0, this.screens.length)
  },
  //обнуляем checkboxs адаптива
  resetAdaptive: function () {
    adaptives = document.querySelectorAll('.other-items')
    adaptives.forEach((adaptive) => {
      let input = adaptive.querySelector('input')
      let check = adaptive.querySelector('input[type=checkbox]')
      input.disabled = false
      check.checked = false
    })
  },
  //обнуляем все свойства объекта appData, а также прежние результаты расчёта
  resetShowResult: function () {
    //обнуляем результаты
    inputTotal.value = 0
    inputService.value = 0
    inputFullPrice.value = 0
    inputWithRollback.value = 0
    inputCountScreens.value = 0
    //обнуляем свойства объекта
    this.screenPrice = 0
    this.screenCounts = 0
    this.adaptive = true
    this.servicePricePercent = 0
    this.servicePriceNumber = 0
    this.fullPrice = 0
    this.servicesPercent = {}
    this.servicesNumber = {}
    this.serviceWithRollback = 0
    this.cmsPercent = 0
    this.isErrorInputDataScreen = false
    //обнулим и откат вместе с полосой input range
    this.rollback = 0
    inputRange.value = 0
    inputRangeValue.innerHTML = '<span class="range-value">' + '</span>'
    inputRangeValue.textContent = '0%'
  },

  //метод добавления/удаления CMS вариантов на экран
  addCmsVariants: function () {
    if (cms.checked) {
      cmsVariants.style.display = 'flex'
    } else {
      cmsVariants.style.display = 'none'
    }
  },
  //метод раскрывает скрытое поле input для введения процента стоимости cms
  addCmsInput: function () {
    switch (true) {
      case optionCmsOther.selectedIndex === 0:
        inputHiddenCMSOther.style.display = 'none'
        break;
      case optionCmsOther.selectedIndex === 1:
        inputHiddenCMSOther.style.display = 'none'
        break;
      case optionCmsOther.selectedIndex === 2:
        inputHiddenCMSOther.style.display = 'flex'
        break;
    }
  },
  //метод сбрасывающий настройки cms
  resetCms: function () {
    let optionCmsOtherInput = document.querySelector('#cms-other-input')
    optionCmsOther.innerHTML = '<select name="views-select" id="cms-select">' +
      '<option value="" selected>Тип CMS</option>' +
      '<option value="50">WordPress</option>' +
      '<option value="other">Другое</option>' +
      '</select>'
    optionCmsOtherInput.value = ''
    cms.checked = false
    inputHiddenCMSOther.style.display = 'none'
    cmsVariants.style.display = 'none'
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