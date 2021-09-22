let form = document.querySelector('.calc');
let input = document.querySelector('.calc__input');
let output = document.querySelector('.calc__output');
let inputSelect = document.querySelector('.calc__input-select');
let outputSelect = document.querySelector('.calc__output-select');
let selectFile = document.querySelector('#selectFiles')
let btnImport = document.querySelector('#import');
// здесь будет хранится обьект после загрузки JSON файла
let constants = null;

// функция которая конвертирует 
function convertation(cbGetInfo, data) {
    let inputUnit = cbGetInfo.distance.unit;
    let outputUnit = cbGetInfo.convert_to;
    let coefficient = null;

    // с помошью цикла находим коеффициент на который нужно умножить
    for (key in data[inputUnit]) {
        if (key === outputUnit) {
            coefficient = data[inputUnit][key]
        };
    };

    let newObj = {
        'unit': outputUnit,
        'value': cbGetInfo.distance.value * coefficient
    };

    output.value = `${newObj.value} ${newObj.unit}`;
    return newObj;
};

// получаем данные из инпута и селектов в обьект
function infoInObj(inputUnit, value, outputUnit) {
    return {
        'distance': {
            'unit': inputUnit,
            'value': value
        },
        'convert_to': outputUnit
    };
};

// обработчик событий на кнопку Конвертировать
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value && constants) {
        convertation(infoInObj(inputSelect.value, +input.value, outputSelect.value), constants)
    } else if (!constants) {
        alert("Нужно загрузить файл db.json")
    } else if (!input.value) {
        alert("Нужно ввести число")
    }
});

// функция для рендера мер измирения который подгружены из файла
function render(obj, selectInput, selectOutput) {
    for (let key in obj) {
        switch (key) {
            case 'm':
                selectInput.innerHTML += `<option value=${key}>Метры (${key})</option>`;
                break;
            case 'cm':
                selectInput.innerHTML += `<option value=${key}>Сантиметры (${key})</option>`;
                break;
            case 'in':
                selectInput.innerHTML += `<option value=${key}>Дюймы (${key})</option>`;
                break;
            case 'ft':
                selectInput.innerHTML += `<option value=${key}>Футы (${key})</option>`;
                break;
            default:
                selectInput.innerHTML += `<option value=${key}>(${key})</option>`;
        }
    }

    for (let key in obj) {
        switch (key) {
            case 'm':
                selectOutput.innerHTML += `<option value=${key}>Метры (${key})</option>`;
                break;
            case 'cm':
                selectOutput.innerHTML += `<option value=${key}>Сантиметры (${key})</option>`;
                break;
            case 'in':
                selectOutput.innerHTML += `<option value=${key}>Дюймы (${key})</option>`;
                break;
            case 'ft':
                selectOutput.innerHTML += `<option value=${key}>Футы (${key})</option>`;
                break;
            default:
                selectOutput.innerHTML += `<option value=${key}>(${key})</option>`;
        }
    }
}

// с помошью этой функции загружаю файл и запускаю рендер для отображения мер измирения
function getJSON() {
    let files = selectFile.files;
    if (files.length <= 0) {
        return false;
    }
    let fr = new FileReader();
    fr.onload = function (e) {
        console.log(e);
        let result = JSON.parse(e.target.result);
        constants = result;

        render(constants, inputSelect, outputSelect)
        btnImport.innerText = "Загруженно";
        btnImport.classList.add('downoloaded');
    }
    fr.readAsText(files.item(0));
}



btnImport.addEventListener('click', getJSON)