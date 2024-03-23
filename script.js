let posX = 0;
let posY = 150;
const boardWidth = 5;
const boardHeight = 5;
const stepSize = 50;
const brains = []; // Array to store brain images and positions
/* Array explanation: 
 - The 'brains' array is declared to store brain images and positions.
 - The 'scatterBrains' function scatters brain images on the game page.
 - For each brain, a new image element is created, styled, and positioned randomly.
 - The code checks for overlap with existing brains using the 'brains.some' method.
 - If no overlap is detected, the brain is appended to the body and added to the 'brains' array.
 - The process continues until the desired number of brains ('numBrains') is placed.
*/ 
let lives = 3;
let time = 60;
let timerStarted = false;
let stopMove = false;
let questionActive = false;
let pauseTimer = false;
let characterURI = ''

function drawLives() 
{
  const livesContainer = document.getElementById('lives');
  livesContainer.innerHTML = '';
  Array(lives).fill().map(() => 
  {
    const live = document.createElement('img');
    
    live.src = 'lives.png'; // Image resource - Canva.com
    live.setAttribute('width', '45');
    livesContainer.appendChild(live);
  })
}
/* Resource used (lives visibility): https://stackoverflow.com/questions/69395510/subtract-an-image-that-is-representing-a-life-in-a-game
This function is designed to draw and display a visual representation of the player's lives in the HTML document.
It checks if there is an element with the ID 'startButton' in the document. If such an element exists, it
t adds an event listener to the 'startButton' element. 
This resource taught me how to create a function to visually represent the player's lives.
*/

document.addEventListener('DOMContentLoaded', function() // Add event listener for DOMContentLoaded to initialize page
{
  // Triggered when the start game button is clicked
  let startButton = document.getElementById('startButton');
  
  if (startButton)
  {
    startButton.addEventListener('click', onClick);
  }
  else 
  {
    scatterBrains(10); // Calls this function 10 times
    drawLives(); // Visually represents player's lives
  }
  /* Resource used: (adding/removing an EventListener): https://discuss.hotwired.dev/t/add-and-remove-eventlisteners/710 
    Here, the event listener listens for the 'DOMContentLoaded' event on the document object. 
    The 'DOMContentLoaded' event is fired when the initial HTML document has been completely loaded and parsed, 
    without waiting for stylesheets, images, and subframes to finish loading. 
    This website taught me how to handle Event Listeners. If the 'startButton' element exists in the DOM,
    it adds an additional event listener to it. When the 'startButton' is clicked, the onClick
    function will be executed. Removing an event listener is done using the removeEventListener method.
    When you remove an event listener, you are essentially detaching the function from the specified event. 
  */

  function onClick() 
  {
    let selectedLevel = document.querySelector('input[name="level"]:checked');
    let selectedCharacter = document.querySelector('input[name="character"]:checked');
    /* Resource used: https://stackoverflow.com/questions/71288407/document-queryselectorinputname-nameofradiochecked-value-but-radio-not-c
      These lines of code are used when dealing with HTML forms where you have groups of radio
      buttons (input elements with type="radio") and you want to find out which option the 
      user has selected for a particular group. In this code, I learned document.querySelector is a 
      method that selects the first element in the document that matches the specified CSS selector.
      document.querySelector('input[name="character"]:checked') selects the first checked input
      element with the name attribute set to 'character,' and the result is stored in the 
      variable selectedCharacter.
    */
    
    if (!selectedLevel || !selectedCharacter) 
    {
      // if the user does not select a game and a character before starting
      document.getElementById('no-type-selected').style.visibility = 'visible';
    } 
    else 
    {
      let levelValue = selectedLevel.value;
      let characterImageSrc = selectedCharacter.nextElementSibling.src;
      
      window.location.href = `${levelValue}Page.html?character=${encodeURIComponent(characterImageSrc)}`;
      /* Resource used (for`${levelValue}Page.html?character=${encodeURIComponent(characterImageSrc)}'): AI tools on ChatGpt
        JS statement that changes the current page's URL to a new one
        window.location.href means the current URL of the browser window 
        ${levelValue}Page.html - ${levelValue} means a variable or value representing the level
        ?character=${encodeURIComponent(characterImageSrc)} is a query string appended to the URL
        - question mark followed by key-value pairs
      */
    }
  }

  appendCharacterImage(); // Set up character image movement on the game page

  if (document.getElementById('start-popup'))
  {
    document.getElementById('start-popup').style.visibility = 'visible';
  }
  scatterBrains();
});

function startGame()
{
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', (event) => 
  {
    moveCharacter(event);
    checkBrainCollision(); // Check collision after each move
  });
    document.getElementById('start-popup').style.visibility = 'hidden'
    startTimer();
}
/* Resource used (keydown): https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
This event provides information about the key that was pressed, such as the key code, key identifier, 
and other details. When you use addEventListener  with the 'keydown' event, you are essentially 
attaching a function (event handler) to be executed whenever a key is pressed. 
This website taught me what this event was, and how it was significant to my code. The keydown
event in JavaScript is triggered when a key on the keyboard is pressed down. 
*/

function updateTimer()
{
  document.getElementById('timer').innerHTML = `${time} seconds`;
}
/* Resource used (timer): https://www.w3schools.com/js/js_timing.asp 
The updateTimer function is responsible for updating the content of an HTML element 
with the ID 'timer' to display the current value of the time variable followed by the text " seconds".
Through this website, I learned ${time} is a template literal, a way to embed expressions 
within string literals. It allows you to dynamically insert the value of the time variable into the string.
*/

function startTimer() 
{
  setInterval(function()
  {
    if (!pauseTimer  && time >= 0)
    {
      time--;
    } 
    if (time <= 0) 
    {
      const popup =  document.getElementById('generic-popup');
      const text = `<span class='red-class'>Time is up!</span>`
      document.getElementById('generic-text-line-1').innerHTML = text;
      document.getElementById('generic-next').style.visibility = 'hidden';
      popup.style.visibility = 'visible';
    } 
    if (!pauseTimer && time >= 0) 
    {
      updateTimer();
    }
  }, 1000);
}

/* Resource used (timer): https://www.w3schools.com/js/js_timing.asp 
  The code uses the setInterval function in JavaScript to create a timer that counts down at intervals of one second. 
  This resource allowed me to learn how the timer function works: When the timer reaches zero, a confirmation 
  dialog asks the user if they want to play again. If the user chooses to play again, a function called resetGame() 
  is called; otherwise, the page is redirected to 'index.html'. T
*/

function appendCharacterImage()
{
  let params = new URLSearchParams(window.location.search); /* extracts the character 
  value from URL */
  let characterImageSrc = params.get('character');
  if (characterImageSrc)
  {
    let characterImage = document.createElement('img');
    characterImage.src = characterImageSrc;
    characterImage.alt = 'Selected Character';
    characterImage.id = 'character'; // This adds an ID to the character image 
    let container = document.getElementById('right-container'); /* used to structure
    content in EasyPage.html and HardPage.html */
    if (container)
    {
      container.appendChild(characterImage); /*  the newly created characterImage is 
      appended to this container using container.appendChild(characterImage) */
      adjustCharacterInitialPosition(); /* set the initial position of the character
       image within the container */
    }
  }
}
/* 
Resources used: https://www.techiedelight.com/load-and-append-image-to-dom-javascript
This function is responsible for adding a character image to the HTML page based on the
character selected by the user.
This website taught me how to append an image based on its attributes and container elements.

Resource used: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams 
let params = new URLSearchParams(window.location.search) is a line that creates a new URLSearchParams object.
This website taught me that this was using the query parameters from the current URL.
*/

function adjustCharacterInitialPosition()
{
  // Get the character element by its ID
  const character = document.getElementById('character');
  if (character)  // Check if the character element exists
  {
    character.style.position = 'absolute';
    character.style.left = '0px'; 
    character.style.top = '150px';
  }
}

// Function to scatter brain images on the game page
function scatterBrains(numBrains) 
{
// Constants for brain dimensions and position offset
  const brainWidth = 50; // Adjust to match the width of brain image
  const brainHeight = 62;// Adjust to match height of brain
  const offsetX = 100;   // Minimum distance from the left of the screen
  const offsetY = 100;   // Minimum distance from the top of the screen
  const padding = 100;   // So elements do not move past the screen
// these are the parameters of the brain images that is being stored in the array 

  for (let i = 0; i < numBrains;)
  {
    const brain = document.createElement('img');
    brain.src = 'brain.png'; // Image resource - Canva.com
    brain.className = 'brain'; 
    brain.style.position = 'absolute'; // Random position within window bounds with an offset
    let x = Math.random() * (window.innerWidth - brainWidth - offsetX - padding) + padding/2 +  offsetX;
    const y = Math.random() * (window.innerHeight - brainHeight - offsetY - padding) + padding/2 +  offsetY;
    x = x > window.innerWidth - padding ? window.innerWidth - (padding * 2) : x
    brain.style.left = `${x}px`;
    brain.style.top = `${y}px`;

    // Check if the new brain overlaps with existing brains
    let overlap = brains.some(otherBrain => 
    {
      const otherRect = otherBrain.getBoundingClientRect();
      const newRect = brain.getBoundingClientRect();
      return !(
        newRect.right < otherRect.left ||
        newRect.left > otherRect.right ||
        newRect.bottom < otherRect.top ||
        newRect.top > otherRect.bottom
        // New brain being placed (newRect) overlaps with any existing brains
      );
    });

    // If no overlap detected, append the brain to the body and save it
    if (!overlap) 
    {
      document.body.appendChild(brain);
      brains.push(brain);
      i++; // Only increment if the brain has been placed successfully
    }
  }
}

/* The scatterBrains function generates brain images, ensures their random placement 
  on the screen without overlapping with existing brains, and appends them to the
   HTML document. The references to these brain elements are stored in the brains 
   array for reference and overlap checks.

  Resource used (storing images as an array): https://copyprogramming.com/howto/how-to-store-images-in-an-array-when-image-is-on-load
  This initializes an empty array called brains to store references to the brain image elements 
  created during the game. This resource taught me how to store images in an array and the different  
  attributes you may choose to store in it. 

  Resource used (how to randomize image placement): https://replit.com/talk/ask/JS-place-image-on-random-coordinates/48068
  the lines initalizing const x and const y calculate random X and Y coordinates within the window boundaries, 
  considering the width, height of the brain images, and specified offsets. This website taught me how to
  calculate a random amount of brains onto the screen. 

  Resource used (Rect): https://www.reddit.com/r/pygame/comments/1gpe4j/having_trouble_understanding_rects/ 
  getBoundingClientRect() is used to obtain the bounding rectangles of the brain elements. otherRect represents the 
  bounding rectangle of an existing brain in the brains array. newRect represents the bounding rectangle of the
  newly created brain.
  This website helped me understand the use and purpose of rects, which helped me determine how to use them for the 
  overlap function. The overlap variable is a boolean indicating whether the new brain overlaps with any 
  existing brains.

  Resource used (appendChild): https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
  document.body.appendChild(brain) appends the newly created brain element to the body of the HTML document.
  This website showed me how I can display this array of brains to the user the most efficiently and have it show
  on the HTML. 

  Resource used (pushing elements): https://www.w3schools.com/jsref/jsref_push.asp
  brains.push(brain) adds the reference of the new brain element to the brains array.
  i++; increments the loop counter only if the brain has been placed successfully without overlapping.
  This website taught me about the push method, which adds new items to the end of the array. This 
  was a necessity given that I needed 10 brains stored into the brains array.
*/

function handleKeyPress(event)
{
   if (event.key=="Enter") // Allows for the enter key to be interchanged with pressing the next button for user convienience
   {
    handleEnterKey();
   }
   else
   {
    moveCharacter(event);
   }
}

function handleEnterKey ()
{
  document.getElementById('popup-close').click ();
  if (lives < 0) 
  {
    pauseTimer = true;
  }
}

function moveCharacter(event) 
{
  if(stopMove == true)
  {
    return;
  }
  // If the character image exists on the page, this function is applied
  const character = document.getElementById('character');

  if (character) 
  {
    let newPosX = posX;
    let newPosY = posY;

    switch (event.key)
    {
      case 'ArrowUp': // Move the character upward by subtracting 20 from the current Y position
        newPosY -= 20;
        newPosY -= 20;
        break;
      case 'ArrowDown': // Move character down
        newPosY += 20;
        break;
      case 'ArrowLeft': // Move character left
        newPosX -= 20;
        break;
      case 'ArrowRight': // Move character right
        newPosX += 20;
        break;
    }

    /* Resource used (positions): https://stackoverflow.com/questions/74832175/document-addeventlistenerkeydown-myfunction-is-not-working
      When a key is pressed down anywhere on the document, the moveCharacter function
      will be triggered. This website helped me learn the logic to handle the movement 
      of a character, based on the key that was pressed.

      Resource used (capturing arrow key events): https://www.w3schools.com/graphics/game_controllers.asp 
       This code captures arrow key events and updates the character's position 
       accordingly, allowing it to move in response to arrow key presses. This website allowed me to 
       learn what the different cases meant and what affect it had to the keys and the character. 
    */
    const characterWidth = character.clientWidth;
    const characterHeight = character.clientHeight;

    if (newPosX >= 0 && newPosX <= window.innerWidth - characterWidth)
    // Check boundaries to ensure the character stays within the screen
    {
      posX = newPosX;
      character.style.left = `${posX}px`;
    }

    if (newPosY >= 150 && newPosY <= window.innerHeight - characterHeight) 
    // Adjust the boundary check for the Y-axis to allow the character to go further down
    {
      posY = newPosY;
      character.style.top = `${posY}px`;
    }
  }
}

function checkBrainCollision() // Function to check for collision between the character and brains
{
  // Retrieving necessary elements from the DOM
  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popup-text');
  const popupInput = document.getElementById('popup-input');
  const popupClose = document.getElementById('popup-close');
  const popupContent = document.getElementById('popup-content');

  const character = document.getElementById('character');
  const characterRect = character.getBoundingClientRect();
  const brains = document.querySelectorAll('.brain');

  brains.forEach(brain =>  // Looping through each brain to check for collision
  {
    const brainRect = brain.getBoundingClientRect();
    const brainCenterX = brainRect.left + brainRect.width / 2;
    const brainCenterY = brainRect.top + brainRect.height / 2;
    // Checking if the character and brain overlap (similar to overlap function in ScatterBrains)
   
    if 
    (
      characterRect.left < brainCenterX &&
      characterRect.right > brainCenterX &&
      characterRect.top < brainCenterY &&
      characterRect.bottom > brainCenterY
    ){
      if (!brain.classList.contains('answered')) 
      // Checking if the brain has not been answered before
      {
        if(questionActive)
        {
          return; // If a question is already active, do nothing
        }
        questionActive = true;
        stopMove = true; 

        const { question, answer, explanation } = getRandomQuestion();
        // Brain is not marked as answered - Generating a random question

        popupText.innerHTML = `${question}` // Displaying the question in the popup
        popup.style.visibility = 'visible';
        popupInput.style.display = 'block'
        popupInput.value = '';
        popupInput.focus();

        function closeHandler ()
         // Event handler for closing the popup
        {
          popup.style.visibility = 'hidden';
          stopMove = false;
          questionActive = false;
          popupClose.removeEventListener('click', closeHandler);
        }

        function answerHandler()
        // Event handler for submitting an answer
        {
          popupClose.removeEventListener('click', answerHandler);
          popupClose.addEventListener('click', closeHandler);
          const userAnswer = parseInt(popupInput.value);

          if (userAnswer == answer) // if user answer is correct
          {
            popupText.innerHTML = ('Correct!');
            brain.classList.add('answered'); // Marking the brain as 'answered'
            brain.remove(); // Removing brain element from page
          } 
          else
          {
          // If the answer is incorrect
            pauseTimer = true;
            popupText.innerHTML = `<p>Wrong! The correct answer is ${answer}. ${explanation}</p>`
            popupInput.style.display = 'none'
            brain.remove();
            lives--; // subtracting the amount they got wrong
            console.log(lives)
            if (lives >= 0)
            {
            drawLives();
            }
          } 
        }
        popupClose.addEventListener('click', answerHandler);  
         // Adding event listener for submitting an answer
      }
    }
  });

  /* Resource used (popup): https://javascript.info/popup-windows
    In the provided code, the popup is a modal or pop-up window that appears when the game character collides with a brain 
    in the game. The popup is an HTML element with the ID "popup." It contains a content area, which, in turn, has elements 
    like popup-text, popup-input, and popup-close. These elements are used to display text, take user input, and c
    close the popup. The JavaScript code is responsible for handling interactions with the popup when a brain collision is detected.
    The forEach loop iterates over each brain element on the page and checks for a collision with the game character.
    Initially, I set the popups to an alert for a temporary solution to the program. Although I ran into many issues when 
    changing it to a popup, this resource helped me recognize that a popup is a central element for presenting questions
    to the player upon brain collisions, receiving their input, and providing feedback based on the correctness of their answers, 
    and guided me on how to do so.

    Resource used (forEach): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    Here, brains is an array, and forEach is used to loop through each element (in this case, each brain element) in the array.
    For each iteration, the specified callback function (the arrow function inside forEach) is executed. This code taught me 
    what forEach was and the difference between forEach and for. I wanted to learn and try something new with my current knowledge
    of for loops. Through this website, I learned that the main difference between forEach and a traditional for loop in JavaScript 
    lies in their syntax, use cases, and behavior. The use cases are designed for iterating over elements in an array, which 
    worked perfect in this context. It also provides a cleaner and more concise syntax when dealing with arrays. It also doesn't
    create a new array and is mainly used for iterating, not for modifying the original array.

    Resource used (visibility): https://www.w3schools.com/css/tryit.asp?filename=trycss_display#:~:text=%3E-,Difference%20between%20display%3Anone%20and%20visiblity%3A%20hidden,the%20element%20from%20the%20document.
    The line popup.style.visibility = 'visible'; sets the CSS style property "visibility" of the popup
    element to "visible". This line makes the element visible on the web page. In HTML and CSS, elements
    can be hidden or shown by adjusting their visibility property. 
    This website taught me what different properties of "visibility" did. For example, while hidden just
    hides the popup from the user, it is still there. However, display-none gets rid of the actual popup
    in that instance.
  */

  if(brains.length < 1)  // Checking if all brains have been answered correctly 
  {
    const popup =  document.getElementById('generic-popup');
    pauseTimer = true; 
    const text = `<span class='red-class'>Congratulations - you passed! You answered ${10 - (3 - lives)}/10 questions correctly.</span>`;
    pauseTimer = true; 
    const line2 = 'Would you like to play again or attempt the Hard Level?';
    document.getElementById('generic-text-line-1').innerHTML = text;
    document.getElementById('generic-text-line-2').innerHTML = line2;
    document.getElementById('generic-next').style.visibility = 'visible';
    popup.style.visibility = 'visible';
  }
}

function handleOkay() // Function to handle the "Okay" button in the generic popup
{
    resetGame();
} 

function handleToHard() // Function to navigate to the Hard Level page if "Congratulations" screen shows up
{
  const character = window.location.search.split('=')?.[1] || '';
  window.location.href = `HardPage.html?character=${character}`;
}
 /* Resource used (window.location.search.split('=')?.[1] || ''): https://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/
  This line retrieves the query string portion of the URL, including the leading 
  '?' character. This makes it possible for the character to be shown on the next page when 
  the user selects the option to go to the Hard Level if they decide to after they pass the 
  Easy Level game. This website taught me how to extract the value associated with the 
  query parameter 'character' from the URL.
*/

function resumeTimer() // Function to resume the timer when pauseTimer is not true
{
    if (lives >= 0 ) 
    {
      pauseTimer = false;
    }
}

function continueGame() // Continues the game only if lives are greater than or equal to 0 - otherwise, displays popup losing screen
{
  if (lives >=0) 
  {
    resumeTimer();
  } 
  else 
  {
    const popup =  document.getElementById('generic-popup');
    pauseTimer = true; 
    const text = `<span class='red-class'>You lost! Would you like to try again?</span>`;
    document.getElementById('generic-text-line-1').innerHTML = text;
    document.getElementById('generic-next').style.display = 'none';
    popup.style.visibility = 'visible';
  }
}

function closeGenericPopup() // Button that navigates user to home page
{
   window.location.href = 'index.html'; 
}

function closeModal()
{
  document.getElementById('no-type-selected').style.visibility = 'hidden';
}

function resetGame()
{
  window.location.reload(); // Button that reloads the screen for the user if they want to replay
}

/* Resource used (window.location): https://developer.mozilla.org/en-US/docs/Web/API/Window/location
 Throughout the code, I've employed the window.location object for various functionalities. 
 Specifically, I utilized it for creating HTML references (href) and reloading the screen in functions 
 resetGame(). The use of window.location proved instrumental in navigating to specific content, 
 exemplified by the closeGenericPopup function directing users to index.html. This website 
 significantly facilitated my navigation and identification of window.location references, 
 enabling me to implement the desired actions within the game. Notably, in the context of the 
 resetGame() function, the reloading of the screen serves to reset the game and provide 
 users with a refreshed experience upon button press.
*/

function getRandomMultiplicationQuestion() 
{
// Simple multiplication questioin
  const num1 = Math.floor(Math.random() * 9) + 1; // Ensure single-digit positive number
  const num2 = Math.floor(Math.random() * 9) + 1; // Ensure single-digit positive number
  return {
    question: `<p class='before-question'> You encountered a brain! Answer to proceed:</p><span class='question'>What is ${num1} x ${num2}?</span>`,
    // These classes are created to style how the questions are displayed on maze.css
    answer: num1 * num2,
    explanation: `
    <p class='explain-p'>To multiply ${num1} x ${num2}:</p>
    <li>Imagine you have ${num1} groups, and each group has ${num2} items. </li>
    <li>Combine all the items, and you get ${num1 * num2} in total.</li>
    <li>So, the answer is ${num1 * num2}.</li>
    `
    /* All of these explanations provide an easy way for the user to follow along with what they got wrong and 
    how to approach problems like this. The timer function also pauses when the questions are prompted, ensuring 
    that the user has time to process the information before going on with the maze without being worried about the 
    timer.  
    */
  };
}

function getRandomDivisionQuestion() 
{
// Simple division question
  const num1 = Math.floor(Math.random() * 9) + 1; // Ensure single-digit positive number
  const num2 = Math.floor(Math.random() * 9) + 1; // Ensure single-digit positive number
  const product = num1 * num2;
  return {
    question: `<p class='before-question'>You encountered a brain! Answer to proceed:</p><span class='question'>What is ${product} ÷ ${num1}?</span>`,
    answer: num2,
    explanation: `
    <p class='explain-p'>To divide ${product} by ${num1}:</p>
    <li>Imagine you have ${product} items, and you want to share them into ${num1} groups.</li>
    <li>You are figuring out how many items are in each group (${num2} items in each group).</li>
    <li>By rearranging the division, you find that dividing by ${num1} is the same as dividing by ${num2}.</li>
    <li>Dividing any number by itself or by 1 always results in the original number.</li>
    <li>So, the answer is ${num2}, which represents the number of items in each group.</li>
    `
  };
}

function getRandomSubtractionQuestion()
// Simple subtraction question 
 {
  const num1 = Math.floor(Math.random() * 9) + 10; // Ensure two-digit positive number
  const num2 = Math.floor(Math.random() * 9); // Ensure one-digit positive number
  if (num1 < num2) 
  {
    return {
      question: `<p class='before-question'>You encountered a brain! Answer to proceed:</p><span class='question'>What is ${num2} - ${num1}?</span>`,
      answer: num2 - num1,
      explanation: `
      <p class='explain-p'>To solve ${num2} - ${num1}:</p>
      <li>Imagine you have ${num2} items, and you want to take away ${num1} of them.</li>
      <li>When subtracting a larger number from a smaller one, start with zero and count backward by the absolute value of the smaller number until you reach the absolute value of the larger number.</li>
      <li>For example, to subtract ${num1} from ${num2}, start with ${num2} and count backward by ${Math.abs(num1)}: ${num2} - ${num1} = ${num2 - num1}.</li>
     `,
    };
  }
// Subtraction question in the case that num1 is greater (don't want the Easy Level to prompt negative values) 
  return {
    question: `<p class='before-question'>You encountered a brain! Answer to proceed:</p><span class='question'>What is ${num1} - ${num2}?</span>`,
    answer: num1 - num2,
    explanation: `
    <p class='explain-p'>To solve ${num1} - ${num2}:</p>
      <li>Imagine you have ${num1} items, and you want to take away ${num2} of them.</li>
      <li>When subtracting a larger number from a smaller one, start with zero and count backward by the absolute value of the smaller number until you reach the absolute value of the larger number.</li>
      <li>For example, to subtract ${num1} from ${num2}, start with ${num1} and count backward by ${Math.abs(num2)}: ${num1} - ${num2} = ${num1 - num2}.</li>
      `,
  };
}

function getRandomAdditionQuestion() 
// Simple addition question (two-digit number + one-digit number) 
{
  const num1 = Math.floor(Math.random() * 90); // Ensure two-digit positive number
  const num2 = Math.floor(Math.random() * 9); // Ensure one-digit positive number
  return {
    question: `<p class='before-question'>You encountered a brain! Answer to proceed: </p><span class='question'>What is ${num1} + ${num2}?</span>`,
    answer: num1 + num2,
    explanation: ` 
    <p class='explain-p'>To add ${num1} and ${num2} together:</p>
    <li>Imagine you have ${num1} items, and you want to add ${num2} more.</li>
    <li>Start with the first number (${num1}) and count up by the second number (${num2}).</li>
    <li>Combine the counted items to get the final result: ${num1 + num2}.</li>
    `
  };
}

function getRandomQuestion()  
{
  // Store functions in an array in order to give each function an index so that it can be later selected at random
  const questions = [getRandomAdditionQuestion, getRandomSubtractionQuestion, getRandomMultiplicationQuestion, getRandomDivisionQuestion];
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex]();
}

/* Resource used(for random equations generated): https://stackoverflow.com/questions/32936045/generate-a-random-math-equation-using-random-numbers-and-operators-in-javascript
  This JavaScript code defines a set of functions to generate random math questions, including addition and subtraction.
  The questions are generated with random numbers, and each question comes with an explanation for the solution if 
  the user gets it wrong. 
  This website helped me get an idea of how to set up these equations in a variety of ways. I used what best fit 
  my model. 

  Resource used: (for explanations): https://discuss.codecademy.com/t/what-does-this-syntax-do/432913/3
  The $ syntax is used as a placeholder for variable interpolation or substitution within a template ]
  string in JavaScript. Specifically, it is used to embed the values of the variables num1 and num2 
  into the template string. 
  This website showed me how to use this in the right way, and taught me
  its significance in its functionality through different contexts. When the template 
  string is evaluated, the placeholders ${num1} and ${num2} will be replaced with the actual
   values of the variables.
*/