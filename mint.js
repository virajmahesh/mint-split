/**
 * @returns The transaction amount formatted as a string.
 */
function getTransactionAmount() {
  return document.getElementsByName('amount')[1].value;
}

setInterval(function() {
  var splitIcon = document.getElementById('txnEdit-split-icon');

  if (splitIcon != null) {
    var actionsDiv = splitIcon.parentNode.parentNode;

    // Don't append the 'split in half' button if we have already done it.
    if (actionsDiv.childNodes.length != 7) {
      return;
    }

    var splitHalf = splitIcon.parentNode.cloneNode(true);
    var splitHalfIcon = splitHalf.childNodes[1];

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
          var inputFields = document.getElementsByName('percentAmount');

          inputFields[1].value = splitAmount;
          inputFields[2].value = (txnAmount - splitAmount).toFixed(2);

          // Change the category to "Hide from Budget & Trends"
          var selector = document.getElementsByClassName("down notab")[2];
          selector.click();
          var menuOption = document.getElementById("menu-category-40");
          menuOption.click();

          // Confirm the split transaction.
          var submitButton = document.getElementById('pop-split-submit');
          submitButton.click();

        }, 1000);
    };
  }

}, 2000);