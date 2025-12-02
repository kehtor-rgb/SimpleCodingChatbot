
let randomCol;

const OLLAMA_URL = "http://192.168.1.206:11434/api/generate";
const MODEL = "mistral-nemo:12b";


function setup(){
    createCanvas(300, 300);
    background(200);

    let brainScripts = ['SimCo_Brain.rive'];
    let bot = new RiveScript();
    bot.loadFile(brainScripts).then(brainReady).catch(BrainError);

    let button = select('#submit');
    let user_input = select('#user_input');
    let output = select('#output');

    button.mousePressed(postUserInput);

    function brainReady(){
        console.log("Chatbot ready");
        bot.sortReplies();
    }

    function BrainError(){
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
    async function parseBotResponse(reply){
          if (reply == "ERR: No Reply Matched"){
            reply = await queryOllama()
          }
          output.html(reply);
    }

    //Posts the User Input to Ollama and Returns a Promise of the Reply.
    async function queryOllama() {
      let prompt = user_input.value();
      if (prompt.trim() === '') return;
      
      try {
        const response = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            model: MODEL,
            prompt: prompt,
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
