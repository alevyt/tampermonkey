// ==UserScript==
// @name         Rozetka currency switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  usd/uah currency switcher for rozetka
// @author       Andrii Levytskyi
// @match        https://rozetka.com.ua/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    let exchangeRateURL = 'https://api.exchangerate.host/latest?base=USD&symbols=UAH';

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

    let currencyExchangeRate = 0
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            currencyExchangeRate = JSON.parse(xmlHttp.responseText).rates.UAH;
    }
    xmlHttp.open("GET", exchangeRateURL, true); // true for asynchronous 
    xmlHttp.send(null);

    let changePrice = function(element){
        // console.log(element.innerText);
        let num = element.innerText.replace( /^\D+/g, '') * (currency == 'UAH' ? currencyExchangeRate : 1/currencyExchangeRate);
        element.innerText = num;    
    }

    let clickHandler = function (ev) {
        currency = currency == 'UAH'? 'USD' : 'UAH';
        currencySymbol = currency == 'UAH'? '₴' : '$';
        this.innerHTML = currency;

        let pricetags = document.querySelectorAll('.goods-tile__price-value, .product-prices__big, .promo-label__round-price');
        let currencyTags = document.querySelectorAll('.goods-tile__price-currency');

        pricetags.forEach(changePrice);
        currencyTags.forEach((element) => {
            element.innterText = currencySymbol;
        })
        
    }

    currencyButton.addEventListener('click', clickHandler);


    document.body.appendChild(currencyButton);

})();
