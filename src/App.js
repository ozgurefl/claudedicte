import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Check, X, RefreshCw } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const FrenchDictationApp = () => {
  // Predefined sentence collections
  const sentenceCollections = {
    beginner: [
      "Je suis etudiant.",
      "Elle a un livre.",
      "Nous allons a l'ecole.",
      "Le chat dort.",
      "J'aime le chocolat."
    ],
    intermediate: [
      "Les oiseaux volent dans le ciel bleu.",
      "Ma famille habite pres de Paris.",
      "J'ai visite le musee hier apres-midi.",
      "Les enfants jouent dans le parc.",
      "Elle ecoute de la musique classique."
    ],
    advanced: [
      "La philosophie nous invite a questionner nos certitudes.",
      "Les changements climatiques preoccupent les scientifiques.",
      "L'art contemporain defie souvent les conventions traditionnelles.",
      "La mondialisation transforme les economies du monde entier.",
      "L'intelligence artificielle souleve des questions ethiques profondes."
    ]
  };

  // Expanded special characters including capital versions
  const frenchSpecialChars = [
    'é', 'É', 
    'è', 'È', 
    'ê', 'Ê', 
    'ë', 'Ë', 
    'à', 'À', 
    'â', 'Â', 
    'ù', 'Ù', 
    'û', 'Û', 
    'ü', 'Ü', 
    'ô', 'Ô', 
    'ç', 'Ç', 
    'ï', 'Ï', 
    'î', 'Î', 
    '«', '»'
  ];

  const [difficulty, setDifficulty] = useState('beginner');
  const [sentences, setSentences] = useState(sentenceCollections.beginner);
  const [currentSentence, setCurrentSentence] = useState(sentences[0]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  // Highlighted character rendering
  const renderHighlightedSentence = () => {
    const normalizedCorrect = currentSentence.toLowerCase();
    const normalizedInput = userInput.toLowerCase();

    return currentSentence.split('').map((char, index) => {
      const inputChar = normalizedInput[index];
      
      // Determine character state
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
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    const newSentences = sentenceCollections[newDifficulty];
    setSentences(newSentences);
    setCurrentSentence(newSentences[0]);
    setUserInput('');
    setCurrentSentenceIndex(0);
    setScore(0);
  };

  const checkAnswer = () => {
    const normalizedCorrect = currentSentence.toLowerCase().trim();
    const normalizedInput = userInput.toLowerCase().trim();

    if (normalizedCorrect === normalizedInput) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to next sentence
    const nextIndex = (currentSentenceIndex + 1) % sentences.length;
    setCurrentSentenceIndex(nextIndex);
    setCurrentSentence(sentences[nextIndex]);
    setUserInput('');
  };

  // Auto-move to next sentence
  useEffect(() => {
    const normalizedCorrect = currentSentence.toLowerCase().trim();
    const normalizedInput = userInput.toLowerCase().trim();

    if (normalizedInput.length === normalizedCorrect.length) {
      const nextIndex = (currentSentenceIndex + 1) % sentences.length;
      setCurrentSentenceIndex(nextIndex);
      setCurrentSentence(sentences[nextIndex]);
      setUserInput('');
    }
  }, [userInput, currentSentence, currentSentenceIndex, sentences]);

  const addSpecialChar = (char) => {
    setUserInput(prev => prev + char);
  };

  const randomizeSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setCurrentSentence(sentences[randomIndex]);
    setUserInput('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2" /> French Dictation App
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Difficulty Selector */}
          <div className="mb-4 flex items-center space-x-2">
            <Select 
              value={difficulty} 
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(sentenceCollections).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)} Level
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={randomizeSentence}
              title="Random Sentence"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Highlighted Sentence Display */}
          <div className="mb-4 p-3 bg-blue-50 rounded text-2xl h-24 flex items-center overflow-auto">
            {renderHighlightedSentence()}
          </div>

          {/* User Input */}
          <Input 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your dictation here..."
            className="mb-4 text-2xl h-16"
          />

          {/* Special Character Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {frenchSpecialChars.map((char) => (
              <Button 
                key={char} 
                variant="outline" 
                size="sm"
                onClick={() => addSpecialChar(char)}
              >
                {char}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              onClick={checkAnswer} 
              disabled={!userInput}
              className="flex-grow"
            >
              <Check className="mr-2" /> Check Answer
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setUserInput('')}
              className="flex-grow"
            >
              <X className="mr-2" /> Clear
            </Button>
          </div>

          {/* Score Display */}
          <div className="mt-4 text-center">
            <p>Score: {score}/{sentences.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrenchDictationApp;