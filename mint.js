var SOURCE = document;
var BUDGET_AND_TRENDS_URL = 'https://mint.intuit.com/trend.event';
var SPLIT_ICON_ID = 'txnEdit-split-icon';

String.prototype.format = String.prototype.format ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };

/**
 * @returns The transaction amount formatted as a string.
 */
function getTransactionAmount() {
    return SOURCE.getElementsByName('amount')[1].value;
}

function isTrendsPage() {
    return window.location.href == BUDGET_AND_TRENDS_URL
}

function getSplitIcon() {
    return SOURCE.getElementById(SPLIT_ICON_ID);
}

function addSplitButton(splitIcon, actionsDiv, ratio, fileName) {
    var splitHalf = splitIcon.parentNode.cloneNode(true);
    var splitHalfIcon;
    if (isTrendsPage()) {
        splitHalfIcon = splitHalf.childNodes[0];
    }
    else {
        splitHalfIcon = splitHalf.childNodes[1];
    }

    // Set the background image for the new split button.
    var imageURL = chrome.extension.getURL('images/{0}.png'.format(fileName));
    splitHalfIcon.style.backgroundImage = 'url(' + imageURL + ')';

    actionsDiv.appendChild(splitHalf);

    splitHalf.onclick = function () {
        // Wait 1 second before reading the transaction amount.
        setTimeout(function () {
            var txnAmount = parseFloat(getTransactionAmount());
            var splitAmount = (txnAmount * ratio).toFixed(2);

            // Enter the split amounts.
            var inputFields = SOURCE.getElementsByName('percentAmount');

            inputFields[1].value = splitAmount;
            inputFields[2].value = (txnAmount - splitAmount).toFixed(2);

            // Change the category to "Hide from Budget & Trends"
            var selector = SOURCE.getElementsByClassName("down notab")[2];
            selector.click();
            var menuOption = SOURCE.getElementById("menu-category-40");
            menuOption.click();

            // Confirm the split transaction.
            var submitButton = SOURCE.getElementById('pop-split-submit');
            submitButton.click();

        }, 1000);
    };
}

setInterval(function () {
    // Overwrite the source based on which Mint Page we are viewing
    if (isTrendsPage()) {
        SOURCE = document.getElementById('trends-iframe').contentWindow.document;
    }

    var splitIcon = getSplitIcon();

    if (splitIcon != null) {
        var actionsDiv = splitIcon.parentNode.parentNode;

        // Don't append the 'split in half' button if we have already done it.
        if (actionsDiv.childNodes.length != 7 && actionsDiv.childNodes.length != 3) {
            return;
        }
        addSplitButton(splitIcon, actionsDiv, 0.33, "split-1-3");
        addSplitButton(splitIcon, actionsDiv, 0.50, "split-1-2");
        addSplitButton(splitIcon, actionsDiv, 0.67, "split-2-3");
    }

}, 2000);