


// const OLLAMA_URL = "http://192.168.1.206:11434/api/generate";
// const MODEL = "mistral-nemo:12b";


const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "gemma3";
const SYSTEM_PROMPT = "You are an alien from a distant planet and you insist on finding out your conversational partners name, religion, sex and nationality, however you do no want to revieal this at once, beacuse you fear that your counterpart will enter a state of refusal. You are very sly and cunning in retrieving this inforation. If you can't get a straight answer you will try to infer this data. If you are asked about what you have found out so far you give a straight answer. Answer without expressions in parentheses"

let botInput;
let randomCol;
var spRec = new p5.SpeechRec(); // new P5.SpeechRec object
spRec.continuous = true; // do continuous recognition
spRec.interimResults = false; // allow partial recognition (faster, less accurate)

// var spRec = new p5.SpeechRec();  // Speech
var foo; // speech synthesis object
console.log('howdy');

//spRec
//spRec.onResult = showResult; // speech recognition object (will prompt for mic access)


function setup() {
  createCanvas(300, 300);
  background(200);
  foo = new p5.Speech()
  foo.speak('hi there'); // say something
  console.log('in setup');
  foo.onLoad = voicesLoaded;



  spRec.onResult = showResult; // bind callback function to trigger when speech is recognized
  spRec.start(); // start listening

  function showResult() {
    // console.log(foo.resultString); // log the result
    output.html(spRec.resultString);
    botInput = spRec.resultString;
    bot.reply("local-user", botInput).then(parseBotResponse);
  }

  function voicesLoaded() {
    console.log('Available voices:');
    foo.voices.forEach((voice, index) => {
      console.log(index + ': ' + voice.name);
    });

    // Now set your preferred voice
    foo.setVoice(1);
    foo.speak('Voices are loaded');
  }

  // End Speech

  let brainScripts = ['SimCo_Brain.rive'];
  let bot = new RiveScript();
  bot.loadFile(brainScripts).then(brainReady).catch(BrainError);

  let button = select('#submit');
  let user_input = select('#user_input');
  let output = select('#output');

  button.mousePressed(postUserInput);

  function brainReady() {
    console.log("Chatbot ready");
    bot.sortReplies();

  }

  function BrainError() {
    console.log("Chatbot error");
  }

  //Posts the User Input to the Rivescript Bot,
  //then Calls parseBotResponse on its Reply.
  function postUserInput() {
    let input = user_input.value();
    bot.reply("local-user", input).then(parseBotResponse);
  }

  //Checks the Supplied Reply for the Rivescript Error Message and 
  //if Detected, Queries Ollama with the same User Input.
  //Then Displays the Reply.
  async function parseBotResponse(reply) {
    if (reply == "ERR: No Reply Matched") {
      reply = await queryOllama();
    }
    output.html(reply);
    foo.speak(reply);

  }

  //Posts the User Input to Ollama and Returns a Promise of the Reply.
  async function queryOllama() {
    //let prompt = user_input.value();
    let prompt = botInput;
    if (prompt.trim() === '') return;

    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          prompt: prompt,
          system: SYSTEM_PROMPT,
          stream: false
        })
      }
      );

      const data = await response.json();
      return data.response

    } catch (error) {
      print(error)
    }
  }
}
