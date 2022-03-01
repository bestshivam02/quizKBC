import React,{useEffect, useState} from 'react';
import { useTimer } from "react-timer-hook";
import {data as maindata} from './data';
import './App.css';

// const data = null

const timeinSeconds = 16;
const QNoForStopTimer = 3
const time = new Date();
const expiryTimestamp = time.setSeconds(time.getSeconds() + timeinSeconds);

function App() {

  const [data, setdata] = useState(null)
  const [weather, setweather] = useState(null)

  const [initialState, setInitialState] = useState({});
  const [status, setStatus] = useState(initialState.status);
  const [questionsData, setQuestionData] = useState(initialState.data);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(null)

  const [finalResult, setFinalResult] = useState({
    "totalRupees": 0,
    "answered": 0,
    "answers":[]
  })

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart
  } = useTimer({
    expiryTimestamp,
    // onExpire: () => handleNextQuestion()
    onExpire: () => QuizOver(questionsData && questionsData[questionNumber].answers)
  });


  const QuizOver = (allAnswers) => {
    setStatus(false);
    console.log(allAnswers)
    console.log(finalResult)
  }
  const handleNextQuestion = () => {
    if(questionNumber < data.data.length - 1){
      setQuestionNumber(questionNumber + 1);
    }else{
      QuizOver(questionsData && questionsData[questionNumber].answers);
      // setQuestionNumber(0)
    }
  }

  const handleReplay = () => {
    setInitialState(data);
    setStatus(!status);
    setQuestionNumber(0);
    const time = new Date();
        time.setSeconds(time.getSeconds() + timeinSeconds);
        restart(time);
  }
  
  const handlePrevQuestion = () => {
    if(questionNumber !== 0){
      setQuestionNumber(questionNumber - 1);
    }else{
      setQuestionNumber(data.data.length - 1)
    }
  }

  const handleFifty = (e) => {
    let alls = []
    let highlightedItems = Array.from(document.querySelectorAll("li"));
    highlightedItems.map((item, index)=>{
        if(item.getAttribute("value") == 'false'){
          alls.push(item)
          return alls
        }
    })
    alls[0].classList.add('hide')
    alls[1].classList.add('hide')
    e.target.classList.add('hide')
  }


  useEffect(()=>{
    if(questionNumber < QNoForStopTimer){
    setTimeout(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + timeinSeconds);
        restart(time);
      }, 100);
    }else{
      setTimeout(() => {
        restart(0);
        pause();
      }, 100);
    }
    document.querySelectorAll('li').forEach(element => element.style = null)
    questionsData && setCorrectAnswer(questionsData[questionNumber].answers.filter((question)=>question.isCorrect && question ))
    // console.log(finalResult)
    if(questionsData && questionNumber < questionsData.length){
      document.querySelector('ul').classList.remove("pointer-none")
      document.querySelectorAll('li').forEach(elem=>elem.classList.remove("hide"));
    }
  },[questionNumber])


  const handleClickedAnswer = (allAnswers, selectedAnswer, e) => {
    document.querySelector('ul').classList.add("pointer-none")
    if(selectedAnswer.isCorrect){
      e.target.style.backgroundColor = "green"
      e.target.style.color = "white"
      pause();

      setFinalResult(values => ({ ...values, ["answered"]: finalResult.answered + 1}))
      setFinalResult(values => ({ ...values, ["answers"]: [...finalResult.answers, selectedAnswer] }))
      setFinalResult(values => ({ ...values, ["totalRupees"]: 
      finalResult.answered == 0 ? 1000 :  
      finalResult.answered == 1 ? 2000 :
      finalResult.answered == 2 ? 10000 :
      finalResult.answered == 3 ? 15000 :
      finalResult.answered == 4 ? 50000 :
      finalResult.answered == 5 ? 500000 : 
      finalResult.answered == 6 ? 700000 : 0
    }))

      // console.log(selectedAnswer);
      // console.log(allAnswers);
      // console.log(e.target);
    }else{
      e.target.style.backgroundColor = "red"
      e.target.style.color = "white"
      QuizOver(allAnswers)
    }
  }

  // async function fetchData() {
  //   const response = await fetch('http://127.0.0.1:8000/api/get-quiz/')
  //   const maindata = await response.json();
  //   setdata(maindata);
  //   setStatus(maindata.status);
  //   setQuestionData(maindata.data);
  // }
  
  useEffect(()=>{
    // setTimeout(() => {
    //   console.log('setted');
    //   console.log(maindata);
    //   setdata(maindata);
    //   setStatus(maindata.status);
    //   setQuestionData(maindata.data);
    // }, 1000);

    
    // fetchData();
    fetch("http://127.0.0.1:8000/api/get-quiz/")
      .then(response => {
        return response.json()
      })
      .then(maindata => {
        setdata(maindata);
        setStatus(maindata.status);
        setQuestionData(maindata.data);
        console.log(maindata)
      })

      fetch("http://127.0.0.1:8000/api/get-game/")
      .then(response => {
        return response.json()
      })
      .then(wdata => {
        setweather(wdata)
        console.log(wdata)
      })

  },[])

  return (
    <div className="App">
      {/* {console.log(questionsData)} */}
      
      {status? 
        <>
        {/* <div>{weather.games && weather.games.questions.map(question=><span>{question}</span>)}</div> */}
        <h4><b>{questionNumber + 1}</b> {questionsData && questionsData[questionNumber].question}</h4>
        <ul style={{width: "fit-content", textAlign: "left", margin: "auto", marginBottom: "30px"}}>
          {questionsData &&
            questionsData[questionNumber].answers.map((perAnswer, index)=> 
            <li onClick={(e)=>handleClickedAnswer(questionsData[questionNumber].answers, perAnswer, e)} key={index} value={`${perAnswer.isCorrect}`}><b>{index + 1}</b> {perAnswer.answer}</li>
            )
          }
        </ul>
        
      
        <button className='btn btn-info m-5' onClick={handleNextQuestion}>next Question</button>
        <button className='btn btn-info m-5' onClick={handlePrevQuestion}>Prev Question</button>
        <button className='btn btn-warning m-5' onClick={handleFifty}>50/50</button>

      <div style={{ fontSize: "100px" }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button
        onClick={() => {
          const time = new Date();
          time.setSeconds(time.getSeconds() + timeinSeconds);
          restart(time);
        }}
      >
        Restart
      </button>
        </>
        :
        <>
        <h4>Game Over</h4>  
        <h5>The Correct Answer is: <b id="answerId"></b> {correctAnswer && correctAnswer[0].answer}</h5>

        <button onClick={handleReplay}>Replay</button>
        </>
    }
    </div>
  );
}

export default App;
