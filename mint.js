var SOURCE = document;
var BUDGET_AND_TRENDS_URL = 'https://mint.intuit.com/trend.event';
var SPLIT_ICON_ID = 'txnEdit-split-icon';

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

setInterval(function() {
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

    var splitHalf = splitIcon.parentNode.cloneNode(true);
    var splitHalfIcon;
    if (isTrendsPage()) {
      splitHalfIcon = splitHalf.childNodes[0];
    }
    else {
      splitHalfIcon = splitHalf.childNodes[1];
    }

    // Set the background image for the new split button.
    var imageURL = chrome.extension.getURL('images/split.png');
    splitHalfIcon.style.backgroundImage = 'url(' + imageURL + ')';

    actionsDiv.appendChild(splitHalf);

    splitHalf.onclick = function() {
      // Wait 1 second before reading the transaction amount.
      setTimeout(function() {
          var txnAmount = parseFloat(getTransactionAmount());
          var splitAmount = (txnAmount/2).toFixed(2);

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

}, 2000);