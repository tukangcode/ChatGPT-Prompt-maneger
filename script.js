// ==UserScript==
// @name         Chatgpt Prompt Manager and loader
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Improve version of ChatGPT Notepad With ability to browse and load prompt easily
// @author       TukangCode
// @match        https://chat.openai.com/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      GPL3
// ==/UserScript==

// Use it wisely
(function() {
  'use strict';

  var numWindows = 10; // Number of text windows
  var currentIndex = 0; // Index of the currently displayed text window

  // Create a new div element for the floating window
  var newDiv = document.createElement("div");
  newDiv.style.position = "fixed";
  newDiv.style.top = "20px";
  newDiv.style.right = "20px";
  newDiv.style.width = "393px";
  newDiv.style.height = "297px";
  newDiv.style.zIndex = "1000";
  newDiv.style.backgroundColor = "#333"; // Dark background
  newDiv.style.border = "1px solid white"; // White border
  newDiv.style.color = "white"; // White text
  newDiv.style.padding = "10px";

  // Create the text windows
  var textWindows = [];
  for (var i = 0; i < numWindows; i++) {
    // Create a new div for the text window and its title
    var textContainer = document.createElement("div");
    textContainer.style.display = "none"; // Initially hide the text divs

    var textDiv = document.createElement("div");

    // Create an editable title for the text window
    var titleInput = document.createElement("input");
    titleInput.style.width = "200px"; // Match the width of the textarea
    titleInput.style.backgroundColor = "#333"; // Dark background
    titleInput.style.color = "white"; // White text
    titleInput.style.display = "block";
    titleInput.style.marginLeft = "auto";
    titleInput.style.marginRight = "auto";

    titleInput.value = "Window " + (i + 1); // Initial title text

    // Add an event listener to save the title input value when it changes
    titleInput.addEventListener("input", function(event) {
      var titleValue = event.target.value;
      var windowIndex = textWindows.findIndex(function(window) {
        return window.contains(event.target);
      });
      localStorage.setItem("textWindowTitle_" + windowIndex, titleValue);
    });

    // Retrieve the saved title from localStorage, if any, and populate the title input
    var savedTitle = localStorage.getItem("textWindowTitle_" + i);
    if (savedTitle) {
      titleInput.value = savedTitle;
    }

    textDiv.appendChild(titleInput);

    var newTextarea = document.createElement("textarea");
    newTextarea.style.width = "377px";
    newTextarea.style.height = "140px";
    newTextarea.style.backgroundColor = "#333"; // Dark background
    newTextarea.style.color = "white"; // White text

    // Add an event listener to save the text area content when it changes
    newTextarea.addEventListener("input", function(event) {
      var textareaValue = event.target.value;
      var windowIndex = textWindows.findIndex(function(window) {
        return window.contains(event.target);
      });
      localStorage.setItem("textWindow_" + windowIndex, textareaValue);
    });

    // Retrieve the saved text from localStorage, if any, and populate the textarea
    var savedText = localStorage.getItem("textWindow_" + i);
    if (savedText) {
      newTextarea.value = savedText;
    }

    textDiv.appendChild(newTextarea);

    textContainer.appendChild(textDiv);
    textWindows.push(textContainer);
    newDiv.appendChild(textContainer);
  }
  textWindows[0].style.display = "block"; // Show the first text div

  // Create the dropdown menu
  var windowSelect = document.createElement("select");
  windowSelect.style.backgroundColor = "#333"; // Dark background
  windowSelect.style.color = "white"; // White text
  windowSelect.style.marginTop = "10px"; // Add space below the buttons
  windowSelect.style.float = "right"; // Align right

  // Add options to the dropdown menu based on the window titles
  for (var j = 0; j < textWindows.length; j++) {
    var option = document.createElement("option");
    option.value = j;
    option.text = textWindows[j].querySelector("input").value;
    windowSelect.appendChild(option);
  }

  // Add an event listener to handle the window selection
  windowSelect.addEventListener("change", function(event) {
    var selectedWindowIndex = parseInt(event.target.value);
    textWindows[currentIndex].style.display = "none";
    currentIndex = selectedWindowIndex;
    textWindows[currentIndex].style.display = "block";
  });

  // Append the dropdown menu to the div
  newDiv.appendChild(windowSelect);

  // Create the load button
  var loadButton = document.createElement("button");
  loadButton.textContent = "Load to ChatGPT";
  loadButton.style.backgroundColor = "#333"; // Dark background
  loadButton.style.color = "white"; // White text
  loadButton.style.marginTop = "10px"; // Add space below the buttons
  loadButton.style.marginRight = "5px"; // Add right margin
  loadButton.style.float = "right"; // Align right
  loadButton.onclick = function() {
    var selectedTextWindow = textWindows[currentIndex];
    var textarea = selectedTextWindow.querySelector("textarea");
    var textToLoad = textarea.value;
    // Set the text to load into the ChatGPT textbox
    document.getElementById("prompt-textarea").value = textToLoad;
  };

  newDiv.appendChild(loadButton);

  // Create the export button
var exportButton = document.createElement("button");
exportButton.textContent = "Export";
exportButton.style.backgroundColor = "#333"; // Dark background
exportButton.style.color = "white"; // White text
exportButton.style.marginTop = "10px"; // Add space below the buttons
exportButton.style.marginRight = "5px"; // Add right margin
exportButton.style.float = "right"; // Align right
exportButton.onclick = function() {
  var currentWindow = textWindows[currentIndex];
  var title = currentWindow.querySelector("input").value;
  var content = currentWindow.querySelector("textarea").value;

  var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, title + ".txt");
};

  newDiv.appendChild(exportButton);

  // Create the credit button
  var creditButton = document.createElement("button");
  creditButton.textContent = "Credit";
  creditButton.style.backgroundColor = "#333"; // Dark background
  creditButton.style.color = "white"; // White text
  creditButton.style.marginTop = "10px"; // Add space below the buttons
  creditButton.style.float = "left"; // Align left
  creditButton.onclick = function() {
    var creditPage = "Lefty & ChatGPT3/4 Original Notepad Dev\nTukangCode New function and improvement";
    alert(creditPage);
  };

  newDiv.appendChild(creditButton);

  // Append the div to the body of the document
  document.body.appendChild(newDiv);
})();
