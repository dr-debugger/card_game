import React, { useEffect, useMemo, useState } from "react";
import images from "../utils/images";
import CardBack from "../assests/img/CardBack.png";
import Modal from "./Modal";

let duplicateCode = undefined;
let matchedCode = [];
let interval;
let currentTime = 0;

const Card = () => {
  const [arrImages, setArrImages] = useState(images);
  const [min_sec, setMin_sec] = useState({
    min: "00",
    sec: "00",
  });

  const [backTime, setBackTime] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [win, setWin] = useState(false);

  const memoLengthval = useMemo(() => {
    // console.log('h');
    let codeArr = [];
    arrImages.forEach((e) => {
      if (!codeArr.includes(e.code)) {
        codeArr.push(e.code);
      }
    });
    // console.log(codeArr);
    return codeArr.length;
  }, [arrImages.length]);

  const isWin = () => {
    // console.log(matchedCode);
    return matchedCode.length === memoLengthval ? true : false;
  };

  const matchingAlgo = (code, index) => {
    let _arr = [...arrImages];
    if (!duplicateCode) {
      duplicateCode = code;
      _arr[index].isClicked = true;
      setArrImages(_arr);
      return;
    }
    if (duplicateCode === code) {
      _arr[index].isClicked = true;
      duplicateCode = undefined;
      matchedCode.push(code);
      setArrImages(_arr);
    } else {
      _arr.forEach((e) => {
        if (e.code === duplicateCode) {
          e.isClicked = false;
        }
      });
      duplicateCode = undefined;
      setArrImages(_arr);
    }
  };

  const newLevelClicked = () => {
    setModalOpen(false);
  };

  const retryClicked = () => {
    setModalOpen(false);
    timerFunc(backTime);
  }

  const imageClick = (code, index) => {
    if (matchedCode.includes(code)) return;

    // console.log('not matched');
    matchingAlgo(code, index);

    // console.log(isWin());
    if (isWin()) {
      gameOver(true);
    }
  };

  const suffleArr = (_arr) =>{
    // using Schwartzian transform to suffle the array, visit wiki for clear information
    let suffleArr = _arr.map(perItem => ({perItem, sort: Math.random()}))
                      .sort((a,b)=> a.sort - b.sort)
                      .map(({perItem}) => perItem);


    // last 'map' use here to get the original object back;

    console.log(suffleArr);

    return suffleArr;
  }

  const reset = () => {
    let _arr = [...arrImages];
    _arr.forEach((e) => {
      e.isClicked = false;
    });

    duplicateCode = undefined;
    matchedCode = [];
    currentTime = 0;
    
    let suffledValue = suffleArr(_arr);

    setArrImages(suffledValue);

    setMin_sec({
      min: "00",
      sec: "00",
    });
  };

  const gameOver = (win = false) => {
    // console.log(win);
    clearInterval(interval);
    reset();
    setModalOpen(true);
    win ? setWin(true) : setWin(false);
  };

  const timerFunc = (minutes) => {
    let min_to_sec = minutes * 60000;
    interval = setInterval(() => {
      currentTime++;
      let newSec = min_to_sec - currentTime * 1000;
      // console.log(newSec);
      let minute = Math.floor(newSec / 60000);
      let second = ((newSec % 60000) / 1000).toFixed(0);
      // console.log(minute, second);
      setMin_sec({
        min: `0${minute}`,
        sec: second.length > 1 ? second : `0${second}`,
      });

      if (newSec === 0) {
        isWin() ? gameOver(true) : gameOver(false);
      }
    }, 1000);
  };

  useEffect(() => {
    console.log("useEffect");
    timerFunc(backTime);


    return () => clearInterval(interval);
  }, [backTime]);

  useEffect(()=>{
    let suffledValue = suffleArr(arrImages);

    setArrImages(suffledValue);
  }, []);

  return (
    <>
      <div>Card</div>
      <div>{`${min_sec.min} : ${min_sec.sec}`}</div>
      <div className="images">
        {arrImages.map((elem, index) => {
          return (
            <img
              key={index}
              src={elem.isClicked ? elem.src : CardBack}
              alt="img"
              onClick={() => imageClick(elem.code, index)}
            />
          );
        })}
      </div>

      {
        modalOpen && <Modal win={win} newLevelClicked={newLevelClicked} retryClicked={retryClicked}/>
      }
    </>
  );
};

export default Card;
