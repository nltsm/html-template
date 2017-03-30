## Необходимые инструменты
    node.js:         https://nodejs.org/en/
    глобально gulp:  npm install --global gulp

## Установка проекта
    npm i
    Запустить: gulp
    
## Структура файлов
- app/ - папка с проектом, содержимое загружать на сервер
- less/ - стили less
  - base/ - базовые стили для сайта
  - blocks/ - БЭМ-блоки
  - lib/ - библиотеки
- scripts/ - скрипты
  - jModules - модули проекта
  - jPlugins - jquery плагины, которые необходимо записать в файл app/js/app.js
  - major
    - app.js - объект app (начало файла)
    - script.js - инициализация модулей (конец файла)
    
### Создание модуля javascript (scripts/jModules)
```javascript
app.addModule('Form', function() {
    var private = 'Hello';
    
    this.public = 'World';
    this.init = function() {
        console.log(private + " " + this.public);
    }
});
```

Наследование модулей
```javascript
app.addModule('Contact', function() {
    this.init = function() {
        console.log(Form.public);
    }
});
```

### Добавление методов и свойств в объект app
Новые методы и свойства добавлять в файле scripts/major/app.js

```javascript
app.methods.doSth = function() {
  // code
}
app.props.foo = 'bar'
