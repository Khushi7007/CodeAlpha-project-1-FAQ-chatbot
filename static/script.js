function sendMessage(){

    let input=document.getElementById("user-input");

    let text=input.value.trim();

    if(text=="") return;

    let chat=document.getElementById("chat-box");

    chat.innerHTML +=
    `<div class="user-message">${text}</div>`;
fetch("/get",{

    method:"POST",

    headers:{
        "Content-Type":"application/x-www-form-urlencoded"
    },

    body:"msg="+encodeURIComponent(text)

})

.then(response => response.json())

.then(data => {

    // Show typing animation
    let typing = document.createElement("div");

    typing.className = "bot-message typing";

    typing.innerHTML = "AI is typing<span></span><span></span><span></span>";

    chat.appendChild(typing);

    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {

        typing.remove();

        chat.innerHTML +=
        `<div class="bot-message">${data.reply}</div>`;

        chat.scrollTop = chat.scrollHeight;

        speak(data.reply);

    },1000);

});
    


}
function startListening(){

    if (!('webkitSpeechRecognition' in window)){

        alert("Speech Recognition is not supported in this browser.");

        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onstart = function(){

        document.getElementById("mic-btn").innerHTML = "🎙️";

    };

    recognition.onresult = function(event){

        let transcript = event.results[0][0].transcript;

        document.getElementById("user-input").value = transcript;

        document.getElementById("mic-btn").innerHTML = "🎤";

        sendMessage();

    };

    recognition.onerror = function(){

        document.getElementById("mic-btn").innerHTML = "🎤";

        alert("Voice recognition failed.");

    };

    recognition.onend = function(){

        document.getElementById("mic-btn").innerHTML = "🎤";

    };
}
function speak(text){

    const speech = new SpeechSynthesisUtterance();

    speech.text = text;

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(speech);

}