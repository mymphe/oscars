import React, { useState, useEffect } from 'react';
import './App.scss';

import { ICategory } from './interfaces';
import { categories as data } from './categories';

const App: React.FC = () => {

  const getFromLS = (dataItem: string) => {
    try {
      return JSON.parse(localStorage.getItem(dataItem)!);
    } catch {
      return null;
    }
  };

  const state = getFromLS('state');

  const [categories, setCategories] = useState<ICategory[]>(state ? state.categories : data);
  const [currentPlayer, setCurrentPlayer] = useState<number>(state ? state.currentPlayer : -1);
  const [score, setScore] = useState<number[]>(state ? state.score : []);
  const [done, setDone] = useState<boolean[]>(state ? state.done : [false, false, false]);
  const [showScore, setShowScore] = useState<boolean>(state ? state.showScore : false);

  const handleSelect = (i: number, j: number, k: number) => {
    const updated = [...categories];
    updated[i].predictions[j].prediction = k;
    if (j === 0) {
      document.getElementById("" + i + "predictions")?.scrollIntoView({ behavior: 'smooth' })
    }
    setCategories(updated);
  };

  const calculateResults = () => {
    let ayasScore = 0;
    let azatsScore = 0;
    categories.forEach(category => {
      ayasScore = ayasScore + (category.predictions[1].prediction === category.predictions[0].prediction ? category.points : 0);
      azatsScore = azatsScore + (category.predictions[2].prediction === category.predictions[0].prediction ? category.points : 0);
    });
    setScore([ayasScore, azatsScore]);
    setShowScore(true);
  };


  const startPredicting = () => {
    document.getElementById('table')?.scrollIntoView({ behavior: 'smooth' })
  };

  const goToNextCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  };

  const handleDone = () => {
    const upd = [...done];
    upd[currentPlayer] = true;
    setDone(upd);
    setCurrentPlayer(-1);
  };

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify({categories, currentPlayer, score, done, showScore}));
  }, [categories, currentPlayer, score, done, showScore])


  return (
    <div className="container">
      <header id="header">
        <img src="https://www.oscars.org/sites/all/themes/oscarbase/images/logo2x.png" height="100" alt=""></img>
        <h1>Welcome to <br />the 92nd Oscars Predictions!</h1>
        {(!done[1] || !done[2]) ? <div>
          <p>Who are you?</p>
          <div className="players">
            {!done[1] && <p onClick={() => setCurrentPlayer(1)} style={{ backgroundColor: currentPlayer === 1 ? '#C79F27' : 'white' }}>Aya</p>}
            {!done[2] && <p onClick={() => setCurrentPlayer(2)} style={{ backgroundColor: currentPlayer === 2 ? '#C79F27' : 'white' }}>Azat</p>}
          </div>
          <button onClick={startPredicting}>Start predicting!</button>
        </div> : (
            <div>
              {!done[0] ? <button onClick={() => { setCurrentPlayer(0) }} style={{ backgroundColor: currentPlayer === 0 ? '#C79F27' : 'white' }}>Mark winners!</button> : showScore ? null :
                <button onClick={calculateResults}>Calculate score!</button>}
            </div>
          )}
        {showScore && (
          <div className="score">
            <div>
              <p>Aya</p>
              <h1>{score[0]}</h1>
            </div>
            <div>
              <p>Azat</p>
              <h1>{score[1]}</h1>
            </div>
          </div>
        )}
      </header>
      {currentPlayer > -1 && <div id="table" className="table">
        {categories.map((category, i: number) => (
          <section key={i} className="table__row" id={"" + i}>
            <div className="table__row__head">{category.name}</div>
            <div className="table__row__body">
              {category.predictions.map((prediction, j: number) => (
                currentPlayer === j && (
                  <div key={`${i}${j}`} className="table__row__body__prediction">
                    <p className="table__row__body__prediction__head">{getPlayerName(j)}</p>
                    <div className="table__row__body__prediction__body">
                      {category.nominees.slice(0, 5).map((nominee, k: number) => (
                        <div key={`${i}${j}${k}`} onClick={() => handleSelect(i, j, k)}
                          className="table__row__body__prediction__body__nominee"
                          style={{
                            backgroundImage: `url(${getPicture(category.name, k)})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            filter: prediction.prediction === k ? 'grayscale(0%)' : 'grayscale(80%)',
                            transform: prediction.prediction === k ? 'scale(1.1)' : 'scale(1)',
                            width: prediction.prediction === k ? '300px' : '250px',
                          }}
                        >
                          <div className="table__row__body__prediction__body__nominee__details">
                            <p className="table__row__body__prediction__body__nominee__details__name">{nominee.name}</p>
                            <p className="table__row__body__prediction__body__nominee__details__extra">{nominee.extra_info}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {category.nominees.length > 5 && <div className="table__row__body__prediction__body">
                      {category.nominees.slice(5).map((nominee, k: number) => (
                        <div key={`${i}${j}${k + 5}`} onClick={() => handleSelect(i, j, k + 5)}
                          className="table__row__body__prediction__body__nominee"
                          style={{
                            backgroundImage: `url(${getPicture(category.name, k + 5)})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            filter: prediction.prediction === k + 5 ? 'grayscale(0%)' : 'grayscale(80%)',
                            transform: prediction.prediction === k + 5 ? 'scale(1.1)' : 'scale(1)',
                            width: prediction.prediction === k + 5 ? '300px' : '250px',
                          }}
                        >
                          <div className="table__row__body__prediction__body__nominee__details">
                            <p className="table__row__body__prediction__body__nominee__details__name">{nominee.name}</p>
                            <p className="table__row__body__prediction__body__nominee__details__extra">{nominee.extra_info}</p>
                          </div>
                        </div>
                      ))}
                    </div>}
                    {currentPlayer === 0 && (
                      <div className="table__row__body__prediction__body">
                        <div id={`${"" + i + 'predictions'}`} className="table__row__body__prediction__body__answer"
                          style={{
                            backgroundImage: `url(${getPicture(category.name, category.predictions[1].prediction)})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            opacity: category.predictions[0].prediction < 0 ? 0 : 1,
                          }}>
                          <div className="table__row__body__prediction__body__answer__result">
                            <p className="table__row__body__prediction__body__answer__result__player">Aya</p>
                            <p className="table__row__body__prediction__body__answer__result__points">{category.predictions[0].prediction === category.predictions[1].prediction ? "+" + category.points.toString() : "0"}</p>
                          </div>
                        </div>
                        <div className="table__row__body__prediction__body__answer"
                          style={{
                            backgroundImage: `url(${getPicture(category.name, category.predictions[2].prediction)})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            opacity: category.predictions[0].prediction < 0 ? 0 : 1,
                          }}>
                          <div className="table__row__body__prediction__body__answer__result">
                            <p className="table__row__body__prediction__body__answer__result__player">Azat</p>
                            <p className="table__row__body__prediction__body__answer__result__points">{category.predictions[0].prediction === category.predictions[2].prediction ? "+" + category.points.toString() : "0"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {i < categories.length - 1 ? (
                      <button onClick={() => goToNextCategory("" + (i + 1))}>Next</button>
                    ) : (
                        <button onClick={handleDone}>Done!</button>
                      )}
                  </div>
                )
              ))}
            </div>
          </section>
        ))}
      </div>}
    </div>
  );
}

export default App;

function getPlayerName(id: number) {
  switch (id) {
    case 0:
      return 'Winner';
    case 1:
      return 'Aya';
    case 2:
      return 'Azat';
    default:
      return;
  }
};

function getPicture(categoryName: string, id: number) {
  try {
    return require(`./images/${categoryName}/${id}.jpg`)
  } catch {
    return '#'
  }
}