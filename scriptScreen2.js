let photoBanner;
let title;
let questionsQuizz = [];
let colorQuizz = [];
let global;
let qtfyQuest;
let answerQuizz = [];
let hits = [];
let levels = [];
let level;

function catchQuestionsQuizz(valor) {
  const promisse = axios.get(
    `https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${valor}`
  );

  promisse.then(showQuestionsQuizz);
}

function showQuestionsQuizz(object) {
  photoBanner = object.data.image;
  title = object.data.title;
  global = object.data.questions;
  level = object.data.levels;
  for (let j = 0; j < global.length; j++) {
    questionsQuizz.push(global[j].title);
    colorQuizz.push(global[j].color);
    for (let i = 0; i < 1; i++) {
      answerQuizz.push(global[j].answers);
    }
  }
  for (let p = 0; p < level.length; p++) {
    levels.push(level[p]);
  }
  qtfyQuest = quantifyQuestions(questionsQuizz);
}

function quantifyQuestions(array) {
  let quantify = array.length;
  return quantify;
}

function comparador() {
  return Math.random() - 0.5;
}

function putQuestions(array, number, color) {
  catchQuestionsQuizz();
  let allscreen2 = document.querySelector(".allscreen2");
  allscreen2.innerHTML = "";

  for (let i = 0; i < number; i++) {
    allscreen2.innerHTML += `
      <div class="boxQuestion noclick">
          <div class="question" style="background-color: ${color[i]}"><p>${array[i]}</p></div>
              <div class="boxAnswer">
                  
              </div>
      </div>
      `;
  }
  let boxAnswer = document.querySelectorAll(".boxAnswer");
  boxAnswer.innerHTML = "";
  for (let j = 0; j < number; j++) {
    answerQuizz[j].sort(comparador);
    for (let p = 0; p < answerQuizz[j].length; p++) {
      if (answerQuizz[j][p].isCorrectAnswer) {
        boxAnswer[j].innerHTML += `
        <div class="answer" onclick="selectAnswer(this)" >
          <img src=${answerQuizz[j][p].image} />
          <p class = "green black">${answerQuizz[j][p].text}</p>
        </div>
      `;
      } else {
        boxAnswer[j].innerHTML += `
        <div class="answer" onclick="selectAnswer(this)" >
          <img src=${answerQuizz[j][p].image} />
          <p class = "red black">${answerQuizz[j][p].text}</p>
        </div>
      `;
      }
    }
  }
}

function selectAnswer(element) {
  let dad = element.parentNode.children;
  for (let i = 0; i < dad.length; i++) {
    element.parentNode.children[i].classList.add("opacity");
    element.parentNode.children[i].children[1].classList.remove("black");
  }
  if (element.children[1].classList[0] === "green") {
    hits.push("green");
  }
  element.classList.remove("opacity");
  element.parentNode.classList.add("noclick");
  if (element.parentNode.parentElement.nextElementSibling === null) {
    computationResults();
    let result = document.querySelector(".result");
    setTimeout(function () {
      result.scrollIntoView(false);
    }, 2000);
  }

  if (
    element.parentElement.parentElement.nextElementSibling.classList[1] ===
    "noclick"
  ) {
    element.parentElement.parentElement.nextElementSibling.classList.remove(
      "noclick"
    );
  }

  setTimeout(function () {
    element.parentNode.parentElement.nextElementSibling.scrollIntoView();
  }, 2000);
}

function htmlScreen2(object) {
  let screen1 = document.querySelector(".screen1");
  screen1.innerHTML = "";
  screen1.innerHTML = `
    <div class="topBar">BuzzQuizz</div>
      <div
        class="bannerQuizz"
        style="
          background-image: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.57),
              rgba(0, 0, 0, 0.57)
            ),
            url(${photoBanner});
        "
      >
        <p>${title}</p>
      </div>
      <div class="allscreen2">
        </div>
      </div>
    `;

  putQuestions(questionsQuizz, qtfyQuest, colorQuizz);
  firstQuestions();
}

function firstQuestions() {
  let boxQuestion = document.querySelector(".boxQuestion");
  boxQuestion.classList.remove("noclick");
}

function wait(element) {
  loading();
  catchQuestionsQuizz(element.children[1].innerHTML);
  setTimeout(htmlScreen2, 2000);
}

function loading() {
  let screen1 = document.querySelector(".screen1");
  screen1.innerHTML = "";
  screen1.innerHTML = `
    <div class="topBar">BuzzQuizz</div>
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>    `;
}

function computationResults() {
  let allscreen2 = document.querySelector(".allscreen2");
  let questionsHits;
  let resultValue;
  let resultText;
  let resultTitle;
  let resultImage;
  questionsHits = hits.length;
  resultValue = questionsHits / qtfyQuest;
  resultValue = resultValue * 100;
  resultValue = Math.ceil(resultValue);
  let bigger;
  let resultIndexs;
  let listBigger = [];
  for (let i = 0; i < levels.length; i++) {
    bigger = levels[i].minValue;
    if (resultValue - bigger < 0) {
      listBigger.push(10000);
    } else {
      listBigger.push(resultValue - bigger);
    }
    let minLevel;
    for (let p = 0; p < listBigger.length; p++) {
      minLevel = Math.min.apply(null, listBigger);
      resultIndexs = listBigger.indexOf(minLevel);
      resultTitle = levels[resultIndexs].title;
      resultText = levels[resultIndexs].text;
      resultImage = levels[resultIndexs].image;
    }
  }
  allscreen2.innerHTML += `
  <div class="result ">
    <div class="titleLevel">${resultValue}% de acerto: ${resultTitle}</div>
    <div class="textLevel">
      <img src="${resultImage}" />
      <p>${resultText}</p>
    </div>
  </div>
  <div class="buttomRestart ">Reiniciar Quizz</div>
  <div class="buttomHome" >Voltar pra home</div>
  `;

  let buttomHome = document.querySelector(".buttomHome");
  buttomHome.addEventListener("click", function () {
    location.reload();
  });

  let buttomRestart = document.querySelector(".buttomRestart");
  buttomRestart.addEventListener("click", restartQuizz);
}

function restartQuizz() {
  let topo = document.querySelector(".boxQuestion");
  topo.scrollIntoView(true);
  hits = [];
  catchQuestionsQuizz();
  htmlScreen2();
}

function restarPage() {
  location.reload();
}
