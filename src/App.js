import React, { useEffect, useState } from "react";
import "./App.css";
import pb from './lib/pocketbase';


function App() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(29);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(null);
  const [answers, setAnswers] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const record = await pb.collection('campagne').getOne('m9o9y1jc2i4nz28');
      //const record = await pb.collection('campagne').getOne('94pbzhsj2v7xt7b'); //pour les questions de devops
      console.log("record", JSON.stringify(record));
      setRecord(record);
    }
    fetchData()
  }, [])


  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (questionIndex, answerIndex) => {
    // check if last question
    if (currentQuestion === record.questions.length - 1) {
      setShowSubmit(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }

    // add the answer to the list of answers
    setAnswers([...answers, answerIndex]);
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const nextQuestion = () => {
    if (currentQuestion === record.questions.length - 1) {
      setShowSubmit(true);
    }
    setCurrentQuestion(currentQuestion + 1);
  }

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }
    setCurrentQuestion(currentQuestion - 1);
  }

  const submitQuizz = () => {
    // to calculate the score we need to compare the answers with the correct answers
    // the corre
  }


  return (
    <>{record ?
      (<div className="App">
        {/* 1. Header  */}
        <h1>{record.nom || ""}</h1>



        {/* 3. Show results or show the question game  */}
        {showResults? (<>Your Score is</>) : (showSubmit ? (
          /* 4. Confirm that you wanna submit page */
          <div className="final-results" >
            <h2>Are you sure you want to submit?</h2>
            <button
            className="confirm-button"
              onClick={() => submitQuizz()}
            >
              Submit
            </button>
            <button 
            className="cancel-button"
            onClick={() => setShowSubmit(false)}>Cancel</button>
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
              {Object.values(record.questions[currentQuestion].answers).map((answer, index) => (
                <li key={index} onClick={() => optionClicked(currentQuestion, index + 1)}>
                  {answer}
                </li>
              ))}
            </ul>
            <div className="question-nav">
              <button className="nav-button" onClick={() => previousQuestion()}  disabled={currentQuestion === 0}>Previous</button>
          
              <button className="nav-button" onClick={() => nextQuestion()} disabled={currentQuestion === record.questions.length - 1} >Next</button>
            </div>
          </div>

        ))}
      </div>) : (<div>Loading...</div>)}
    </>
  );
}

export default App;
/*
<div className="final-results">
            <h1>Final Results</h1>
            <h2>
              {score} out of {record.questions.length} correct - (
              {(score / record.questions.length) * 100}%)
            </h2>
            <button className="start-button" onClick={() => restartGame()}>Restart game</button>
          </div>
          */