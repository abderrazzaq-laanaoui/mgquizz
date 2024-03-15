import React, { useEffect, useState } from "react";
import "./App.css";
import pb from './lib/pocketbase';


function App() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [creationMessage, setCreationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    async function fetchData() {
      const record = await pb.collection('campagne').getOne('m9o9y1jc2i4nz28');
      //const record = await pb.collection('campagne').getOne(id);
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
    const answer = {
      question_id: record.questions[questionIndex].id,
      answer_id: answerIndex
    };

    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  /* Exits the game */
  const exit = () => {
    window.location.href = "https://www.mgdis.fr/";
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

const submit = async()=> {
  //var name = document.getElementById('name').value;
  console.log("answers", answers);
  console.log("rep correctes", record.reponses_correctes);
  //The name inputted is the user's name
  const user = document.getElementById("user").value; // Get the value from the input field
  const score = answers.reduce((acc, curr) => {
    const correctAnswer = record.reponses_correctes.find(item => item.question_id === curr.question_id);
    if (curr.answer_id) {
      if (correctAnswer && correctAnswer.correct_answer_id === curr.answer_id) {
        return acc + 2;
      } else {
        return acc - 1;
      }
    } else {
      return acc;
    }
  }, 0);
  setScore(score);
  setUser(user)
  setShowResults(true);
  setShowSubmit(false);
  try {
    const newCampagne = await pb.collection('passage').create({
      user: "xp6joalq5r250rp",
      campagne: "m9o9y1jc2i4nz28",
      score: score 
    });
    setCreationMessage(
      <>
        Nouveau user {user} créée <br/>
        Score ajoutée à la campagne "QuestionCyber"
      </>
    );
  
          console.log("User et score ajoutées avec succès");
          setErrorMessage(``);
        } catch (error) {
          console.error("Erreur lors de la création du nouveau user", error);
        }
      }
  console.log(`user ${user} score is ${score}`);

  return (
    <>{record ?
      (<div className="App">
        {/* 1. Header  */}
        <h1>{record.nom || ""}</h1>



        {/* 3. Show results or show the question game  */}
        {showResults? (<> user {user} score is {score}</>) : (showSubmit ? (
          /* 4. Confirm that you wanna submit page */
          <div className="final-results" >
            <h2>Add your name</h2>
            <input type="text" id="user" placeholder="Name"/>
            <button
            className="confirm-button"
              onClick={() => submit()}
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