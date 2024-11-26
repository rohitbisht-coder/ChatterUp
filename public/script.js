const socket = io.connect("http://localhost:3000");

const loginBtn = document.getElementById("login_btn");
const chatApp = document.getElementById("chat-app");
const formContainer = document.getElementById("form-container");
const userName = document.getElementById("username");
const userJoinMsg = document.getElementById("welcome-text");
const userList = document.getElementById("user-list");
const sendMsgBtn = document.getElementById("send_msg");
const msg = document.getElementById("mesg_input");
const chatBox = document.getElementById("chat-messages");


// user form login
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = userName.value.trim();
  if (name) {
    formContainer.style.visibility = "hidden";
    chatApp.style.visibility = "visible";
    socket.emit("loginUser", name,);
  } else {
    alert("Please enter your name .");
  }
});


socket.on("userLogin", (name, allUserAarray, msgArray) => {
  userJoinMsg.innerText = name.text;
  setTimeout(() => {
    userJoinMsg.innerText = "";
  }, 2000);
  userList.innerHTML = " ";
  allUserAarray.forEach((element) => {
    const user = document.createElement("div");
    const list = document.createElement("li")
    list.innerText = element.name
    user.classList.add("user");
    user.appendChild(list);
    userList.appendChild(user);
  });
  chatBox.innerHTML = " ";
  msgArray.forEach((element) => {
    const data = `
     <div class="message-content">
       <div id="name_time">
         <strong>${element.user.name}</strong>
         <strong class="time">${element.createdAt}</strong>
       </div>
       <p>
        ${element.text}
       </p>
     </div>`;
    const message = document.createElement("div");
    message.classList.add("message");
    message.innerHTML = data;
    chatBox.appendChild(message);
  })
})




socket.on("message", (name,allUserAarray) => {
  userJoinMsg.innerText = name.text;
  setTimeout(() => {
    userJoinMsg.innerText = "";
  }, 2000);
  userList.innerHTML = " ";
  allUserAarray.forEach((element) => {
    const user = document.createElement("div");
    const list = document.createElement("li")
    list.innerText = element.name
    user.classList.add("user");
    user.appendChild(list);
    userList.appendChild(user);
  });
});



// user Typing Status
const typingFunc = () => {
  socket.emit("userTyping");
};

socket.on("typingUserName", (userName) => {
  document.getElementById(
    "typing-status"
  ).innerText = `${userName} is typing....`;
  setTimeout(() => {
    document.getElementById("typing-status").innerText = "";
  }, 3000);
});




// user sending msg



sendMsgBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const sendMsg = msg.value;
  socket.emit("sendMessage", sendMsg);
  msg.value = "";
});


socket.on("sendMsg", (text, name) => {
  const data = `
      <div class="message-content left">
        <div id="name_time">
          <strong>You</strong>
          <strong class="time">${text.createdAt}</strong>
        </div>
        <p>
         ${text.text}
        </p>
      </div>`;

  const message = document.createElement("div");
  message.classList.add("message");
  message.classList.add("left");
  message.innerHTML = data;
  chatBox.appendChild(message);
});

// broadcast message to all users
socket.on("recieveMsg", (text, name) => {
  let audio = new Audio()
  const data = `
      <div class="message-content">
        <div id="name_time">
          <strong>${name}</strong>
          <strong class="time">${text.createdAt}</strong>
        </div>
        <p>
         ${text.text}
        </p>
      </div>`;
  audio.src = "notification.wav"
  audio.play()
  const message = document.createElement("div");
  message.classList.add("message");
  message.innerHTML = data;
  chatBox.appendChild(message);
});