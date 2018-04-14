// ==UserScript==
// @name Biwenger Payment Table Script
// @namespace com.bujalance.scripts
// @description Provides information of the payment of each user in the League clasificatiton table
// @match https://biwenger.as.com/*
// @require https://code.jquery.com/jquery-3.3.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.js
// @version 0.1
// ==/UserScript==

const PAYMENT_ENDPOINT = "https://script.google.com/macros/s/AKfycbxWKv2BFwvZLvDqwu2Ug2DGkYdSFjKGQPpZtEQP-yPTkbZnOMA/exec";

var options = {
    fireOnAttributesModification: false,
    onceOnly: false,
    existing: false
};
$(document).arrive("table.standings.table.condensed", options, onTableArrival);

function onTableArrival () {
    console.log("[INFO]: onTableArrival");
    updateHeader($(this));
    updateBody($(this));
}

function updateHeader(table) {
    console.log("[INFO]: updateHeader");
    var headerRow = table.children("thead").children("tr");
    headerRow.append("<th class='text-right' role='columnheader'>Paga</th>");
}

function updateBody(table) {
    console.log("[INFO]: updateBody");
    var bodyRows = table.children("tbody").children("tr");
    console.log("rows length: " + bodyRows.length)
    bodyRows.each(updateBodyRow);
}

function updateBodyRow(index, row) {
    console.log("[INFO]: updateBodyRow " + index);
    var requestParams = {
        username: $(row).find("a").text()
    };
    $.getJSON(PAYMENT_ENDPOINT, requestParams, function(result, status) {
        if (status === 'success' && result.status === 'OK') {
            var roundedPayment = Math.round(result.payment * 100) / 100;
            $(row).append("<td class='text-right'>" + roundedPayment + " €</td>");
        }
        console.log(status + ' : ' + result.username + ' -> ' + result.payment);
    });
}
