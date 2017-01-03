function getTransactionAmount() {
  console.log(document.getElementsByName('amount'));
  console.log(document.getElementsByName('amount').length);
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

    // Set the background color of the new split button.
    splitHalfIcon.style.backgroundImage = 'none';
    splitHalfIcon.style.backgroundColor = '#acd0af';

    actionsDiv.appendChild(splitHalf);

    splitHalf.onclick = function() {
      // Wait 1 second before reading the transaction amount.
      setTimeout(function() {
          var txnAmount = parseFloat(getTransactionAmount());
          var splitAmount = (txnAmount/2).toFixed(2);

          var inputFields = document.getElementsByName('percentAmount');

          inputFields[1].value = splitAmount;
          inputFields[2].value = (txnAmount - splitAmount).toFixed(2);

          var submitButton = document.getElementById('pop-split-submit');
          submitButton.click();

        }, 1000);
    };
  }

}, 2000);