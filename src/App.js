import React, { useEffect, useState } from "react";
import "./App.css";
import PocketBase from 'pocketbase';
const questions = [
    {
      question: "abc",
      options: [
        { id: 0, text: "New York City", isCorrect: false },
        { id: 1, text: "Boston", isCorrect: false },
        { id: 2, text: "Santa Fe", isCorrect: false },
        { id: 3, text: "Washington DC", isCorrect: true },
      ],
    },
    {
      question: "What year was the Constitution of America written?",
      options: [
        { id: 0, text: "1787", isCorrect: true },
        { id: 1, text: "1776", isCorrect: false },
        { id: 2, text: "1774", isCorrect: false },
        { id: 3, text: "1826", isCorrect: false },
      ],
    },
    {
      text: "Who was the second president of the US?",
      options: [
        { id: 0, text: "John Adams", isCorrect: true },
        { id: 1, text: "Paul Revere", isCorrect: false },
        { id: 2, text: "Thomas Jefferson", isCorrect: false },
        { id: 3, text: "Benjamin Franklin", isCorrect: false },
      ],
    },
    {
      text: "What is the largest state in the US?",
      options: [
        { id: 0, text: "California", isCorrect: false },
        { id: 1, text: "Alaska", isCorrect: true },
        { id: 2, text: "Texas", isCorrect: false },
        { id: 3, text: "Montana", isCorrect: false },
      ],
    },
    {
      text: "Which of the following countries DO NOT border the US?",
      options: [
        { id: 0, text: "Canada", isCorrect: false },
        { id: 1, text: "Russia", isCorrect: true },
        { id: 2, text: "Cuba", isCorrect: true },
        { id: 3, text: "Mexico", isCorrect: false },
      ],
    },
  ];

//const pb = new PocketBase("https://6cee-2001-660-7304-f-3-00-865b.ngrok-free.app");
const pb = new PocketBase("http://127.0.0.1:8090");

function App() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(null);
  const [records, setRecords] = useState(0);
  const [result, setResult] = useState(0);
  
  useEffect(()=>{
  async function fetchData(){
  const record = await pb.collection('campagne').getOne('m9o9y1jc2i4nz28');
  //const record = await pb.collection('campagne').getOne('94pbzhsj2v7xt7b'); //pour les questions de devops
  console.log("record",record);
  setRecord(record);
}
fetchData()},record)
  

  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < record.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <>{record ?
    <div className="App">
      {/* 1. Header  */}
      <h1>{record.nom || ""}</h1>

      {/* 2. Current Score  */}
      <h2>Score: {score}</h2>

      {/* 3. Show results or show the question game  */}
      {showResults ? (
        /* 4. Final Results */
        <div className="final-results">
          <h1>Final Results</h1>
          <h2>
            {score} out of {record.questions.length} correct - (
            {(score / record.questions.length) * 100}%)
          </h2>
          <button onClick={() => restartGame()}>Restart game</button>
        </div>
      ) : (
        /* 5. Question Card  */
        <div className="question-card">
          {/* Current Question  */}
          <h2>
            Question: {currentQuestion + 1} out of {record.questions.length}
          </h2>
          <h3 className="question-text">{record.questions[currentQuestion].question}</h3>

          {/* List of possible answers  */}
          <ul>
                <li
                  onClick={() => optionClicked(currentQuestion, 1)}
                >
            {record.questions[currentQuestion].answers[1]}
                </li>
                <li
                  onClick={() => optionClicked(currentQuestion, 2)}
                >
            {record.questions[currentQuestion].answers[2]}
                </li>
                <li
                  onClick={() => optionClicked(currentQuestion, 3)}
                >
            {record.questions[currentQuestion].answers[3]}
                </li>
                <li
                  onClick={() => optionClicked(currentQuestion, 4)}
                >
            {record.questions[currentQuestion].answers[4]}
                </li>
          </ul>
        </div>
      )}
    </div> : <div>Loading...</div>}
    </>
  );
}

export default App;
