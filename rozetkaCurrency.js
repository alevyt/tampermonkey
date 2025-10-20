// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-10-20
// @description  try to take over the world!
// @author       You
// @match        https://hard.rozetka.com.ua/ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rozetka.com.ua
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const currencyButton = document.createElement('button');
    currencyButton.id = 'currencyButton';
    let currency = 'UAH';
    let currencySymbol = '₴';

    // adding hover style
    let hoverCSS = '#currencyButton:hover {opacity:1;}';
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = hoverCSS;
    } else {
        style.appendChild(document.createTextNode(hoverCSS));
    }
    // **********

    async function getUsdExchangeRate() {
        try {
            fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5')
  .then(response => console.log('345',response)) // convert to JS object
  //.then(data => console.log(data))    // use the data
  .catch(error => console.error('Error:', error)); // handle errors
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            return null;
        }
    }



    document.getElementsByTagName('head')[0].appendChild(style);
    currencyButton.innerHTML = currency;

    currencyButton.style = `
        position: fixed;
        font-weight: bold;
        right: 0;
        top: 0;
        boder-radius: 4px;
        opacity: 0.5;
        z-index: 100;
        padding: 5px 10px;
    `;

    let currencyExchangeRate = 41.95; //setting 41.95 as default value (21.10.2025)

    let changePrice = function(element){
        console.log(element.innerText);
        const rawText = element.innerText || '';
        const numericValue = parseFloat(rawText.replace(/[^\d.]/g, '')) || 0;
        const roundedValue = Math.round(numericValue);
        let num = roundedValue * (currency == 'UAH' ? currencyExchangeRate : 1/currencyExchangeRate);
        element.innerText = num;
    }

    let clickHandler = function (ev) {
        currency = currency == 'UAH'? 'USD' : 'UAH';
        currencySymbol = currency == 'UAH'? '₴' : '$';
        this.innerHTML = currency;

        let pricetags = document.querySelectorAll('div.price');
        let currencyTags = document.querySelectorAll('div.price span');
        console.log('123', currencyExchangeRate);

        pricetags.forEach(changePrice);
        currencyTags.forEach((element) => {
            element.innterText = currencySymbol;
        })

    }

    currencyButton.addEventListener('click', clickHandler);


    document.body.appendChild(currencyButton);

})();
