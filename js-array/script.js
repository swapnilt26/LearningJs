'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Swapnil Thomas Tyagi',
  movements: [200, -200, 340, -300, -20, 50, 400, 46000],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const balanceDate = document.querySelector('.balance__date');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const allAccountTranscations = [
  ...account1.movements,
  ...account2.movements,
  ...account3.movements,
  ...account4.movements,
];

const cleanHTML = function (element) {
  element.innerText = '';
};
function cleanLoginInputFields() {
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
}
function cleanTransferInputFields() {
  inputTransferTo.value = inputTransferAmount.value = '';
}
function cleanCloseAccountInputFields() {
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
}

let currentAccount;
const getDateValue = function (dateValue, locale) {
  const date =
    !dateValue && locale
      ? new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: 'numeric',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(dateValue)
      : new Intl.DateTimeFormat(locale).format(new Date(dateValue));
  return date;

  // return !dateValue
  //   ? `${date.getDate()}/${
  //       date.getMonth() + 1
  //     }/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
  //   : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Display Transcation Rows
const addTranscationRows = function (movs) {
  cleanHTML(containerMovements);
  const transactionCounts = new Map([
    ['deposit', 0],
    ['withdrawal', 0],
  ]);

  movs.forEach((element, i) => {
    const type = element > 0 ? 'deposit' : 'withdrawal';
    transactionCounts.set(type, transactionCounts.get(type) + 1);

    const formatCurrency = new Intl.NumberFormat(currentAccount.locale, {
      style: 'currency',
      currency: currentAccount.currency,
    }).format(element);

    const addHTML = `
<div class="movements__row">
        <div class="movements__type movements__type--${type}">${transactionCounts.get(
      type
    )} ${type}</div>
        <div class="movements__date">${getDateValue(
          currentAccount.movementsDates[i],
          currentAccount.locale
        )}</div>
        <div class="movements__value">${formatCurrency}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', addHTML);
  });
};

// Total Balance
function totalSummary(movs) {
  return movs.reduce((totalBalance, element) => totalBalance + element);
}

// Total Deposit Balance
function totalInSummary(movs) {
  return movs
    .filter(e => e > 0)
    .reduce((transcationTotal, element) => transcationTotal + element, 0);
}

// Total Withdrawl Balance
function totalOutSummary(movs) {
  return Math.abs(
    movs
      .filter(e => e < 0)
      .reduce((transcationTotal, element) => transcationTotal + element, 0)
  );
}

function authentication(currentAccount, password) {
  if (!password || currentAccount.pin !== Number(password)) {
    console.log(`Incorrect Password ${password}`);
    cleanLoginInputFields();
    containerApp.style.opacity = 0;
    return;
  }

  if (currentAccount.pin === Number(password)) {
    containerApp.style.opacity = 1;

    addTranscationRows(currentAccount.movements);

    balanceDate.innerHTML = `As of ${getDateValue('', currentAccount.locale)}`;
    labelBalance.innerText = `${totalSummary(currentAccount.movements)}€`;
    labelSumIn.innerHTML = `${totalInSummary(currentAccount.movements)}€`;
    labelSumOut.innerHTML = `${totalOutSummary(currentAccount.movements)}€`;
  }
  cleanLoginInputFields();
}

const showUserDashboard = function (account, userName, password) {
  currentAccount = account.find(acc => acc?.userName === userName);

  if (!currentAccount) {
    console.log(`No Account with this Username`);
    cleanLoginInputFields();
    containerApp.style.opacity = 0;
    return;
  }

  authentication(currentAccount, password);
};

// Add UserName
const addUserName = function (accounts) {
  accounts.forEach(account => {
    account.userName = account.owner
      .split(' ')
      .map(e => e.at(0).toLowerCase())
      .join('');
  });
};
addUserName(accounts);

btnLogin.addEventListener('click', event => {
  event.preventDefault();

  showUserDashboard(accounts, inputLoginUsername.value, inputLoginPin.value);
});

btnTransfer.addEventListener('click', event => {
  event.preventDefault();

  let accountToTransfer = inputTransferTo.value;
  const amountToTransfer = Number(inputTransferAmount.value);

  cleanTransferInputFields();

  currentAccount.movements.push(-amountToTransfer);

  accountToTransfer = accounts.find(acc => acc?.userName === accountToTransfer);

  if (!accountToTransfer) {
    console.log(`No Account with this Username ${accountToTransfer}`);
    return;
  }

  accountToTransfer?.movements.push(amountToTransfer);

  addTranscationRows(currentAccount.movements);
  labelBalance.innerText = `${totalSummary(currentAccount.movements)}€`;
  labelSumIn.innerHTML = `${totalInSummary(currentAccount.movements)}€`;
  labelSumOut.innerHTML = `${totalOutSummary(currentAccount.movements)}€`;
});

btnClose.addEventListener('click', event => {
  event.preventDefault();

  if (
    !inputCloseUsername.value ||
    currentAccount.userName !== inputCloseUsername.value
  ) {
    console.log(`Active user is Not the Entered Username`);
    cleanLoginInputFields();
    containerApp.style.opacity = 0;
    return;
  }

  if (
    !inputClosePin.value ||
    currentAccount.pin !== Number(inputClosePin.value)
  ) {
    console.log(`Incorrect Password ${inputClosePin.value}`);
    cleanLoginInputFields();
    containerApp.style.opacity = 0;
    return;
  }
  accounts.splice(
    accounts.findIndex(acc => acc.userName === inputCloseUsername.value),
    1
  );
  containerApp.style.opacity = 0;
  cleanCloseAccountInputFields();
});

let sortFlag = false;

btnSort.addEventListener('click', () => {
  sortFlag = !sortFlag;
  currentAccount.movements.sort((a, b) => (sortFlag ? a - b : b - a));
  authentication(currentAccount, currentAccount.pin.toString());
});
