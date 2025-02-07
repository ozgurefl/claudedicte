import React, { useState, useEffect, useMemo, useRef } from 'react';

// Preload JSON files
import beginnerSentences from './beginner.json';
import intermediateSentences from './intermediate.json';
import advancedSentences from './advanced.json';
import causeSentences from './cause.json';
import comparisonSentences from './comparison.json';
import concludingSentences from './concluding.json';
import conditionSentences from './condition.json';
import consequenceSentences from './consequence.json';
import doubtSentences from './doubt.json';
import emphasisSentences from './emphasis.json';
import illustratingSentences from './illustrating.json';
import introducingSentences from './introducing.json';
import locationSentences from './location.json';
import modalsSentences from './modals.json';
import oppositionSentences from './opposition.json';
import purposeSentences from './purpose.json';
import referencingSentences from './referencing.json';
import set1Sentences from './set1.json';
import set2Sentences from './set2.json';
import set3Sentences from './set3.json';
import set4Sentences from './set4.json';
import set5Sentences from './set5.json';
import set6Sentences from './set6.json';
import set7Sentences from './set7.json';
import set8Sentences from './set8.json';
import set9Sentences from './set9.json';
import set10Sentences from './set10.json';
import set11Sentences from './set11.json';
import set12Sentences from './set12.json';
import set13Sentences from './set13.json';
import summarizingSentences from './summarizing.json';
import timeSentences from './time.json';

const FrenchDictationApp = () => {
  const frenchSpecialChars = [
    'é', 'É', 'è', 'È', 'ê', 'Ê', 'ë', 'Ë',
    'à', 'À', 'â', 'Â', 'ù', 'Ù', 'û', 'Û',
    'ü', 'Ü', 'ô', 'Ô', 'ç', 'Ç', 'ï', 'Ï',
    'î', 'Î', '«', '»',
  ];

  // Map difficulty levels to preloaded sentences
  const sentenceCollections = {
    Beginner: beginnerSentences,
    Intermediate: intermediateSentences,
    Advanced: advancedSentences,
    cause: causeSentences,
    comparison: comparisonSentences,
    concluding: concludingSentences,
    condition: conditionSentences,
    consequence: consequenceSentences,
    doubt: doubtSentences,
    emphasis: emphasisSentences,
    illustrating: illustratingSentences,
    introducing: introducingSentences,
    location: locationSentences,
    modals: modalsSentences,
    opposition: oppositionSentences,
    purpose: purposeSentences,
    referencing: referencingSentences,
    set1: set1Sentences,
    set2: set2Sentences,
    set3: set3Sentences,
    set4: set4Sentences,
    set5: set5Sentences,
    set6: set6Sentences,
    set7: set7Sentences,
    set8: set8Sentences,
    set9: set9Sentences,
    set10: set10Sentences,
    set11: set11Sentences,
    set12: set12Sentences,
    set13: set13Sentences,
    summarizing: summarizingSentences,
    time: timeSentences,
  };

  const [state, setState] = useState({
    selectedLevel: 'Beginner', // Default to Beginner
    sentences: sentenceCollections['Beginner'],
    currentSentence: sentenceCollections['Beginner'][0],
    userInput: '',
    currentSentenceIndex: 0,
  });

  const inputRef = useRef(null); // Reference to the input field

  const { selectedLevel, sentences, currentSentence, userInput, currentSentenceIndex } = state;

  // Memoized highlighted sentence rendering
  const highlightedSentence = useMemo(() => {
    const normalizedCorrect = currentSentence.toLowerCase();
    const normalizedInput = userInput.toLowerCase();
    return currentSentence.split('').map((char, index) => {
      const inputChar = normalizedInput[index];
      let className = 'text-gray-400'; // default untyped
      if (char === ' ') {
        className = 'bg-gray-200 mx-1'; // space highlighting
      } else if (inputChar) {
        if (normalizedInput[index] === normalizedCorrect[index]) {
          className = 'text-green-600 font-bold'; // correct match
        } else {
          className = 'text-red-600 underline'; // incorrect match
        }
      }
      return (
        <span key={index} className={className}>
          {char === ' ' ? '⎵' : char}
        </span>
      );
    });
  }, [currentSentence, userInput]);

  const handleLevelChange = (level) => {
    setState({
      selectedLevel: level,
      sentences: sentenceCollections[level],
      currentSentence: sentenceCollections[level][0],
      userInput: '',
      currentSentenceIndex: 0,
    });
  };

  const addSpecialChar = (char) => {
    setState((prevState) => ({ ...prevState, userInput: prevState.userInput + char }));
    inputRef.current.focus(); // Focus back on the input field after adding a special character
  };

  const randomizeSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setState((prevState) => ({
      ...prevState,
      currentSentence: sentences[randomIndex],
      userInput: '',
    }));
  };

  useEffect(() => {
    const normalizedCorrect = currentSentence.toLowerCase().trim();
    const normalizedInput = userInput.toLowerCase().trim();
    if (normalizedInput.length === normalizedCorrect.length) {
      const nextIndex = (currentSentenceIndex + 1) % sentences.length;
      setState((prevState) => ({
        ...prevState,
        currentSentence: sentences[nextIndex],
        userInput: '',
        currentSentenceIndex: nextIndex,
      }));
    }
  }, [userInput, currentSentence, currentSentenceIndex, sentences]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Header */}
        <h1 className="flex items-center text-2xl font-bold text-gray-800">
          📝 French Dictation App
        </h1>

        {/* Level Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedLevel}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(sentenceCollections).map((level) => (
              <option key={level} value={level}>
                {level} Sentences
              </option>
            ))}
          </select>
          <button
            onClick={randomizeSentence}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            title="Random Sentence"
          >
            Randomize
          </button>
        </div>

        {/* Highlighted Sentence Display */}
        <div className="p-4 bg-blue-50 rounded-lg text-2xl h-24 flex items-center overflow-auto">
          {highlightedSentence}
        </div>

        {/* User Input */}
        <input
          ref={inputRef} // Attach the ref to the input field
          type="text"
          value={userInput}
          onChange={(e) => setState({ ...state, userInput: e.target.value })}
          placeholder="Type your dictation here..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl"
        />

        {/* Special Character Buttons */}
        <div className="flex flex-wrap gap-2">
          {frenchSpecialChars.map((char) => (
            <button
              key={char}
              onClick={() => addSpecialChar(char)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrenchDictationApp;