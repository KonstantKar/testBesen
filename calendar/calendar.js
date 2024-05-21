window.jsPDF = window.jspdf.jsPDF;

const dayInput = document.querySelector('.datepicker');
const monthInput = document.querySelector('.monthpicker');
const pauseInput = document.querySelector('.pauseInput');
const closeBtns = document.querySelectorAll('.close');
const dateError = document.querySelector('.dateError');
const monthError = document.querySelector('.monthError');
const applyBtn = document.querySelector('.calendarApply');
const printBtn = document.querySelector('.printApply');
const calendar = document.querySelector('.calendar-description');
const hiddenText = document.getElementById('hiddenText');
const toggleButton = document.getElementById('toggleButton');

// Проверка даты и месяца
const validateDateAndMonth = () => {
  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const isDayValid = !isNaN(day) && day >= 1 && day <= 31;
  const isMonthValid = !isNaN(month) && month >= 1 && month <= 12;

  if (!isDayValid) {
    dateError.style.display = 'block';
    dateError.style.left = `${dayInput.offsetLeft}px`;
  } else {
    dateError.style.display = 'none';
  }

  if (!isMonthValid) {
    monthError.style.display = 'block';
    monthError.style.left = `${monthInput.offsetLeft}px`;
  } else {
    monthError.style.display = 'none';
  }

  applyBtn.disabled = !(isDayValid && isMonthValid);

  return isDayValid && isMonthValid;
};

applyBtn.addEventListener('click', () => {
  const pause = parseInt(pauseInput.value.split('')[0]);
  const length = parseInt(document.querySelector('[name=length]:checked').value);

  const yellowLength = 25 - length;

  const dateElements = document.querySelectorAll('.date');
  dateError.style.display = 'none';
  monthError.style.display = 'none';

  dateElements.forEach((element) => {
    if (!element.querySelector('.date_header')) {
      element.classList.remove('dateStart', 'yellow', 'red', 'grey');
      element.innerText = ''; // Очистить текст ячейки, если это не верхняя ячейка
    }
  });

  if (!dayInput.value || !monthInput.value) {
    validateDateAndMonth();
    return;
  }

  const day = dayInput.value;
  const month = monthInput.value;
  const selectedDate = document.querySelector(`.date[data-date='${day}_${month}']`);
  selectedDate?.classList?.add('dateStart');
  const index = Array.from(dateElements).indexOf(selectedDate);

  setYellow(index);

  function setYellow(ind) {
    let i = 0;
    while (i < yellowLength) {
      dateElements[ind + i]?.classList?.add('yellow');
      dateElements[ind + i].innerText = 'Э';
      dateElements[ind + i].style.color = '#FFFAFA';
      i++;
    }

    if (ind + i < 400) {
      setRed(ind + yellowLength);
    }
  }

  function setRed(ind) {
    let i = 0;
    while (i < length) {
      dateElements[ind + i]?.classList?.add('red');
      dateElements[ind + i].innerText = 'Э/У'
      dateElements[ind + i].style.color = '#FFFAFA';
      i++;
    }

    setGrey(ind + length);
  }

  function setGrey(ind) {
    let i = 0;
    while (i < pause) {
      dateElements[ind + i]?.classList?.add('grey');
      i++;
    }

    setYellow(ind + pause);
  }
});

dayInput.addEventListener('input', function () {
  const inputValue = this.value.replace(/\D/g, '');
  const day = inputValue.slice(0, 2);
  const formattedValue = `${day || '__'}`;
  this.value = formattedValue;
  validateDateAndMonth();
});

monthInput.addEventListener('input', function () {
  const inputValue = this.value.replace(/\D/g, '');
  const month = inputValue.slice(0, 2);
  const formattedValue = `${month || '__'}`;
  this.value = formattedValue;
  validateDateAndMonth();
});

dayInput.addEventListener('blur', validateDateAndMonth);
monthInput.addEventListener('blur', validateDateAndMonth);

pauseInput.addEventListener('focus', function () {
  if (this.value === '') {
    this.value = '';
  }
});

pauseInput.addEventListener('input', function () {
  const inputValue = this.value.replace(/\D/g, '');
  const days = inputValue.slice(0, 2);
  const formattedValue = `${days || '_'}`;
  this.value = formattedValue;
});

closeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    dateError.style.display = 'none';
    monthError.style.display = 'none';
  });
});

printBtn.addEventListener('click', () => {
  const elemToPrint = document.querySelector('.condition');
  const doc = new jsPDF();

  doc.html(elemToPrint, {
    callback: (doc) => {
      doc.setFont('Nunito', 'normal');
      doc.setFontSize(10);
      doc.text('Календарь приёма', 10, 10); // Добавление оглавления pdf
      doc.save('doc.pdf');
    },
    margin: [10, 5, 0, 10],
    autoPaging: 'text',
    x: 0,
    y: 0,
    width: 190,
    windowWidth: 1290,
  });
});

const chooseCheckBox = (input) => {
  const radioInput = document.querySelector(`.${input}`);
  radioInput.checked = true;
};

const label_12 = document.querySelector('.calendar__radio-label_12');
const label_14 = document.querySelector('.calendar__radio-label_14');

label_12.addEventListener('click', () => chooseCheckBox('calendar__radio_12'));
label_14.addEventListener('click', () => chooseCheckBox('calendar__radio_14'));

// Открытие скрытого текста
toggleButton.addEventListener('click', () => {
  if (validateDateAndMonth()) {
    if (hiddenText.style.display === 'none' || hiddenText.style.display === '') {
      hiddenText.style.display = 'block';
    }
    calendar.scrollIntoView({ behavior: 'smooth' });
  }
});
