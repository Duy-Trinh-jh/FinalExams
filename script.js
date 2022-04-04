const data = [
  {
    'question': 'If a = 1 and b = 2, what is a * b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['1', '2', '3', '4'],
    'correctAnswer': '2',
  },
  {
    'question': 'If a = 2 and b = 2, what is a + b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['1', '2', '3', '4'],
    'correctAnswer': '4',
  },
  {
    'question': 'If a = 4 and b = 1, what is a - b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['1', '2', '3', '4'],
    'correctAnswer': '3',
  },
  {
    'question': 'If a = 2 and b = 2, what is a / b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['1', '2', '3', '4'],
    'correctAnswer': '1',
  },
  {
    'question': 'If a = 2 and b = 2, what is 2 * a + b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['2', '4', '6', '8'],
    'correctAnswer': '6',
  },
  {
    'question': 'If a = 3 and b = 4, what is a * b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['11', '12', '13', '14'],
    'correctAnswer': '12',
  },
  {
    'question': 'If a = 3 and b = 10, what is a + b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['11', '12', '13', '14'],
    'correctAnswer': '13',
  },
  {
    'question': 'If a = 14 and b = 4, what is a - b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['10', '20', '30', '40'],
    'correctAnswer': '10',
  },
  {
    'question': 'If a = 22 and b = 2, what is a / b?',
    'type': 'SELECT_QUESTION',
    'answer' : ['11', '12', '13', '14'],
    'correctAnswer': '11',
  },
  {
    'question': 'If a = 12 and b = 6, what is 2 * b + a?',
    'type': 'SELECT_QUESTION',
    'answer' : ['22', '24', '26', '28'],
    'correctAnswer': '24',
  },
  {
    'question': 'How is the weather today?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'What is your name?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'Where are you from?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'What is your favorite food?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'What are your hobbies?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'What is your telephone number?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'What is your email?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'How many people are there in the world?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'How many people are there in your family?',
    'type': 'ESSAY_QUESTION',
  },
  {
    'question': 'How many cars do you want to own?',
    'type': 'ESSAY_QUESTION',
  },
]

const PERIOD = 1000;
const DEBOUNCE_TIME = 300;
const HOUR_TO_SECOND = 3600;
const MINUTE_TO_SECOND = 60;
const NUMBER_OF_QUESTION = 10;
const TIMER_STATE = {
  TIMER_STOP: 'stop',
  TIMER_RUNNING: 'running',
}
const QUESTION_TYPE = {
  ESSAY_QUESTION: 'ESSAY_QUESTION',
  SELECT_QUESTION: 'SELECT_QUESTION',
}

function debounce(func, timeout = DEBOUNCE_TIME){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const createTimer = () => {
  let state = TIMER_STATE.TIMER_STOP;
  const timerContainer = document.querySelector(".timer");
  let intervalId, time;

  const formatTime = (time) => {
    const hour = Math.floor(time / HOUR_TO_SECOND);
    const minute = Math.floor(
      (time - hour * HOUR_TO_SECOND) / MINUTE_TO_SECOND
    );
    const second = time - hour * HOUR_TO_SECOND - minute * MINUTE_TO_SECOND;
    return `
      ${formatTimeString(hour)}:${formatTimeString(minute)}:${formatTimeString(second)}
    `;
  }

  const formatTimeString = (time) => {
    return time < 10 ? "0" + time : time;
  }

  return {
    getTimerState: () => {
      return state;
    },
    getTimerStateFromLocalStorage: () => {
      return JSON.parse(localStorage.getItem("timer"));
    },
    start: () => {
      time = 0;
      const startTimePrev = +JSON.parse(localStorage.getItem("timer"))?.startTime || 0;
      state = TIMER_STATE.TIMER_RUNNING;
      if(startTimePrev > 0) {
        time = Math.floor(new Date().getTime() / 1000) - startTimePrev;
      } else {
        localStorage.setItem(
          "timer", 
          JSON.stringify({state, startTime: (Math.floor(new Date().getTime() / 1000))})
        );
      }
      intervalId = setInterval(() => {
        timerContainer.innerHTML = formatTime(time++);
      }, PERIOD);
    },
    stop: function() {
      state = TIMER_STATE.TIMER_STOP;
      localStorage.removeItem("timer");
      clearInterval(intervalId);
    },
  }
}

const createQuestion = (data) => {
  const questionContainer = document.querySelector(".wrapper-question");
  const questionStateContainer = document.querySelector(".question-state");
  const point = document.querySelector("#score");
  const listQuestion = [];

  const randomListNumber = (lengthData) => {
    const result = [];
    let count = 0;
    while(count < NUMBER_OF_QUESTION) {
      const randomNumber = Math.floor(Math.random() * lengthData);
      if(!result.includes(randomNumber)) {
        result.push(randomNumber);
        count++;
      }
    }
    return result;
  }
  
  const getRandomListQuestion = (data) => {
    return randomListNumber(data.length).map(num => data[num]);
  }

  const renderQuestionToContainer = (item, index) => {
    let html = "";
    const questionType = item.type;
    switch(questionType) {
      case QUESTION_TYPE.ESSAY_QUESTION:
        html = `
          <div class="question essay-question">
            <h3>Q ${index + 1}: ${item.question}</h3>
            <input 
              type="text" 
              name="${index}" 
              value="${listQuestion[index]?.userAnswer || ""}"
            />
          </div>
        `;
        break;
      case QUESTION_TYPE.SELECT_QUESTION:
        let htmlChoices = "";
        item.answer.forEach((answer, indexOfChoice) => htmlChoices += `
          <div class="choice">
            <input 
              type="radio" 
              id="${indexOfChoice}" 
              name="${index}" 
              value="${answer}"
              ${
                listQuestion[index]?.userAnswer?.value === answer &&
                listQuestion[index]?.userAnswer?.index === indexOfChoice ?
                "checked" : ""
              }/>
            <label for="${indexOfChoice}">${answer}</label>
          </div>
        `)
        html = `
          <div class="question select-question">
            <h3>Q ${index + 1}: ${item.question}</h3>
            ${htmlChoices}
          </div>
        `;
        break;
    }
    return html;
  }

  const renderQuestionStateToContainer = (index) => {
    return `
      <div class="state">
        <p>${index + 1}</p>
        <span class="tick"></span>
      </div>
    `;
  }

  const renderHTML = (rndListQuestion) => {
    let questionHtml = "", questionStateHtml = "";
    rndListQuestion.forEach((question, index) => {
      questionHtml += renderQuestionToContainer(question, index);
      questionStateHtml += renderQuestionStateToContainer(index);
    });
    questionContainer.innerHTML = questionHtml;
    questionStateContainer.innerHTML = questionStateHtml;
  }

  const markAnsweredQuestion = (questionState, value) => {
    if(value && value !== "") {
      questionState.innerHTML = "☀";
    } else {
      questionState.innerHTML = "";
    }
  }

  const handleTextInput = debounce(async (event, questionStates) => {
    const value  = event.target.value;
    const index = event.target.name;
    markAnsweredQuestion(questionStates[index], value);
    listQuestion[index].userAnswer = value;
    localStorage.setItem("listQuestion", JSON.stringify(listQuestion));
  }); 

  const handleSelectInput = (event, questionStates) => {
    const value  = event.target.value;
    const key = event.target.name;
    const index = +event.target.id;
    markAnsweredQuestion(questionStates[key], value);
    listQuestion[key].userAnswer = { value, index };
    localStorage.setItem("listQuestion", JSON.stringify(listQuestion));
  }

  const handleEventInput = () => {
    const questionStates = questionStateContainer.querySelectorAll("span.tick");
    
    questionContainer.querySelectorAll(".essay-question input").forEach(input => {
      input.addEventListener('keyup', function(event) {
        handleTextInput(event, questionStates);
      });
    });

    questionContainer.querySelectorAll(".select-question input").forEach(input => {
      input.addEventListener('change', function(event) {
        handleSelectInput(event, questionStates);
      });
    });
  }

  const reset = () => {
    while(listQuestion.length > 0) listQuestion.pop();
    questionContainer.innerHTML = "";
    point.innerHTML = "";
  }

  const savelistQuestion = (rndListQuestion, options = {isPageReloaded : false}) => {
    const { isPageReloaded } = options;
    rndListQuestion.forEach(question => {
      if(!isPageReloaded) question.userAnswer = undefined;
      listQuestion.push(question);
    });
    localStorage.setItem("listQuestion", JSON.stringify(listQuestion));
  }

  const getListQuestionFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("listQuestion")) || [];
  }

  const updateQuestionState = () => {
    const questionStates = questionStateContainer.querySelectorAll("span.tick");
    listQuestion.forEach((question, index) => {
      const value = question?.userAnswer;
      markAnsweredQuestion(questionStates[index],value);
    });
  }

  return {
    createListQuestion: () => {
      reset();
      const oldData = getListQuestionFromLocalStorage();
      if(oldData.length > 0) {
        savelistQuestion(oldData, { isPageReloaded: true });
        renderHTML(oldData);
        updateQuestionState();
      } else {
        const rndListQuestion = getRandomListQuestion(data);
        savelistQuestion(rndListQuestion);
        renderHTML(rndListQuestion);
      }
      handleEventInput();
    },
    calcPoint: () => {
      localStorage.removeItem("listQuestion");
      questionContainer.querySelectorAll(".question input").forEach(input => {
        input.disabled = true;
      });
      questionStateContainer.innerHTML = "";
      let count = 0;
      listQuestion.forEach((question, index) => {
        if(question.type === QUESTION_TYPE.SELECT_QUESTION) {
          const selectInput =
            questionContainer.querySelectorAll(`.select-question input[name="${index}"]`);
          const correctAnswer = question.correctAnswer;
          const answerList = question.answer;
          const userAnswer = question?.userAnswer;
          if (userAnswer?.value === correctAnswer) {
            count++;
          } else if(userAnswer) {
            selectInput[userAnswer.index].className = "incorrect";
          }
          selectInput[answerList.indexOf(correctAnswer)].className = "correct";
        }
      });
      point.innerHTML = `Your score: ${count}`;
    },
  }
}

const handleReload = () => {
  const timer = createTimer();
  const question = createQuestion(data);
  
  const controlButton = document.querySelector("#control-button");
  
  controlButton.onclick = () => {
    if (timer.getTimerState() === TIMER_STATE.TIMER_STOP) {
      timer.start();
      question.createListQuestion();
      controlButton.innerHTML = "Submit";
    } else {
      timer.stop();
      question.calcPoint();
      controlButton.innerHTML = "Reset";
    }
  }
  
  if(timer.getTimerStateFromLocalStorage()?.state === TIMER_STATE.TIMER_RUNNING) {
    controlButton.click();
  }
}