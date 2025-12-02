
let randomCol;

const OLLAMA_URL = "http://192.168.1.206:11434/api/generate";
const MODEL = "mistral-nemo:12b";


function setup(){
    createCanvas(300, 300);
    console.log("Loaded p5sketch");
    let brainScripts = ['SimCo_Brain.rive'];
    let bot = new RiveScript();
    bot.loadFile(brainScripts).then(brainReady).catch(BrainError);
    randomCol = round(random(0, 255));

    let button = select('#submit');
    let user_input = select('#user_input');
    let output = select('#output');

    button.mousePressed(chat);

    
    function brainReady(){
        console.log("Chatbot ready");
        bot.sortReplies();
        let num = floor(random(10000));
        console.log(num);
        let reply = bot.reply('local-user', 'set '+ num);
    }

    function BrainError(){
        console.log("Chatbot error");
    }


    function chat() {
        let input = user_input.value();
        let reply = bot.reply("local-user", input).then(respond);
    }

    async function respond(reply){
          console.log(reply); //send the response to the console
          let botText = reply;
          if (reply == "ERR: No Reply Matched"){
            reply = await sendMessage()
          }
          output.html(reply);
          randomCol = round(random(0, 255));
    }


    async function sendMessage() {
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


function draw(){
    background(randomCol);
}


