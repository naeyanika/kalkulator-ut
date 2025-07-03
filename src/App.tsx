import React, { useState, useEffect } from 'react';
import { Calculator, GraduationCap, Award, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface GradeInfo {
  grade: string;
  gpa: number;
  predicate: string;
  color: string;
}

interface GradeRange {
  grade: string;
  gpa: number;
  predicate: string;
  minScore: number;
  maxScore: number;
}

const courseTypes = [
  { id: 'uas-tuton', name: 'UAS + Tuton', uasWeight: 70, otherWeight: 30, otherName: 'Tuton' },
  { id: 'uas-tmk', name: 'UAS + TMK', uasWeight: 80, otherWeight: 20, otherName: 'TMK' },
  { id: 'uas-tuweb', name: 'UAS + TUWEB', uasWeight: 50, otherWeight: 50, otherName: 'TUWEB' },
];

const difficultyLevels = ['Easy', 'Medium', 'Difficult'];
const mcqOptions = [30, 35, 40, 45, 50];

const gradeRanges: Record<string, GradeRange[]> = {
  Easy: [
    { grade: 'A', gpa: 4.0, predicate: 'Excellent (Sangat Baik)', minScore: 80, maxScore: 100 },
    { grade: 'A-', gpa: 3.5, predicate: 'Excellent', minScore: 75, maxScore: 79.99 },
    { grade: 'B+', gpa: 3.0, predicate: 'Good (Baik)', minScore: 70, maxScore: 74.99 },
    { grade: 'B', gpa: 2.5, predicate: 'Good', minScore: 65, maxScore: 69.99 },
    { grade: 'C+', gpa: 2.0, predicate: 'Sufficient (Cukup)', minScore: 60, maxScore: 64.99 },
    { grade: 'C', gpa: 1.5, predicate: 'Sufficient', minScore: 55, maxScore: 59.99 },
    { grade: 'D', gpa: 1.0, predicate: 'Poor (Kurang)', minScore: 40, maxScore: 54.99 },
    { grade: 'E', gpa: 0.0, predicate: 'Failed (Tidak Lulus)', minScore: 0, maxScore: 39.99 },
  ],
  Medium: [
    { grade: 'A', gpa: 4.0, predicate: 'Excellent (Sangat Baik)', minScore: 75, maxScore: 100 },
    { grade: 'A-', gpa: 3.5, predicate: 'Excellent', minScore: 70, maxScore: 74.99 },
    { grade: 'B+', gpa: 3.0, predicate: 'Good (Baik)', minScore: 65, maxScore: 69.99 },
    { grade: 'B', gpa: 2.5, predicate: 'Good', minScore: 60, maxScore: 64.99 },
    { grade: 'C+', gpa: 2.0, predicate: 'Sufficient (Cukup)', minScore: 55, maxScore: 59.99 },
    { grade: 'C', gpa: 1.5, predicate: 'Sufficient', minScore: 50, maxScore: 54.99 },
    { grade: 'D', gpa: 1.0, predicate: 'Poor (Kurang)', minScore: 35, maxScore: 49.99 },
    { grade: 'E', gpa: 0.0, predicate: 'Failed (Tidak Lulus)', minScore: 0, maxScore: 34.99 },
  ],
  Difficult: [
    { grade: 'A', gpa: 4.0, predicate: 'Excellent (Sangat Baik)', minScore: 70, maxScore: 100 },
    { grade: 'A-', gpa: 3.5, predicate: 'Excellent', minScore: 65, maxScore: 69.99 },
    { grade: 'B+', gpa: 3.0, predicate: 'Good (Baik)', minScore: 60, maxScore: 64.99 },
    { grade: 'B', gpa: 2.5, predicate: 'Good', minScore: 55, maxScore: 59.99 },
    { grade: 'C+', gpa: 2.0, predicate: 'Sufficient (Cukup)', minScore: 50, maxScore: 54.99 },
    { grade: 'C', gpa: 1.5, predicate: 'Sufficient', minScore: 45, maxScore: 49.99 },
    { grade: 'D', gpa: 1.0, predicate: 'Poor (Kurang)', minScore: 30, maxScore: 44.99 },
    { grade: 'E', gpa: 0.0, predicate: 'Failed (Tidak Lulus)', minScore: 0, maxScore: 29.99 },
  ],
};

function App() {
  const [courseType, setCourseType] = useState(courseTypes[0]);
  const [totalMcqQuestions, setTotalMcqQuestions] = useState<number>(30);
  const [correctAnswers, setCorrectAnswers] = useState<string>('');
  const [uasScore, setUasScore] = useState<number | null>(null);
  const [otherScore, setOtherScore] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gradeInfo, setGradeInfo] = useState<GradeInfo | null>(null);

  // Calculate UAS score from MCQ
  useEffect(() => {
    const correct = parseFloat(correctAnswers);
    if (!isNaN(correct) && correct >= 0 && correct <= totalMcqQuestions) {
      const calculatedUasScore = (correct / totalMcqQuestions) * 100;
      setUasScore(calculatedUasScore);
    } else {
      setUasScore(null);
    }
  }, [correctAnswers, totalMcqQuestions]);

  const calculateFinalScore = () => {
    const other = parseFloat(otherScore);

    if (uasScore === null || isNaN(other) || other < 0 || other > 100) {
      setFinalScore(null);
      setGradeInfo(null);
      return;
    }

    const final = (uasScore * courseType.uasWeight / 100) + (other * courseType.otherWeight / 100);
    setFinalScore(final);

    // Determine grade
    const ranges = gradeRanges[difficulty];
    const gradeRange = ranges.find(range => final >= range.minScore && final <= range.maxScore);
    
    if (gradeRange) {
      const color = getGradeColor(gradeRange.grade);
      setGradeInfo({
        grade: gradeRange.grade,
        gpa: gradeRange.gpa,
        predicate: gradeRange.predicate,
        color
      });
    }
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-emerald-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    if (grade === 'D') return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'bg-emerald-50 border-emerald-200';
    if (grade.startsWith('B')) return 'bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-50 border-yellow-200';
    if (grade === 'D') return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  useEffect(() => {
    calculateFinalScore();
  }, [uasScore, otherScore, difficulty, courseType]);

  const isCorrectAnswersValid = () => {
    const correct = parseFloat(correctAnswers);
    return !isNaN(correct) && correct >= 0 && correct <= totalMcqQuestions;
  };

  const isValidInput = correctAnswers !== '' && otherScore !== '' && 
    isCorrectAnswersValid() &&
    !isNaN(parseFloat(otherScore)) &&
    parseFloat(otherScore) >= 0 && parseFloat(otherScore) <= 100 &&
    uasScore !== null;

  const hasValidationError = correctAnswers !== '' && !isCorrectAnswersValid();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Final Grade Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate your final score and grade category based on course type and difficulty
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Course Information</h2>
            </div>

            <div className="space-y-6">
              {/* Course Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Type
                </label>
                <select
                  value={courseType.id}
                  onChange={(e) => setCourseType(courseTypes.find(ct => ct.id === e.target.value) || courseTypes[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                >
                  {courseTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.uasWeight}% UAS, {type.otherWeight}% {type.otherName})
                    </option>
                  ))}
                </select>
              </div>

              {/* UAS MCQ Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-800">UAS - MCQ Section</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Total MCQ Questions */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Total Number of MCQ Questions
                    </label>
                    <select
                      value={totalMcqQuestions}
                      onChange={(e) => setTotalMcqQuestions(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      {mcqOptions.map((option) => (
                        <option key={option} value={option}>
                          {option} questions
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Correct Answers */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Correct Answers
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={totalMcqQuestions}
                      step="1"
                      value={correctAnswers}
                      onChange={(e) => setCorrectAnswers(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        hasValidationError 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-blue-300 bg-white'
                      }`}
                      placeholder={`Enter correct answers (0-${totalMcqQuestions})`}
                    />
                    {hasValidationError && (
                      <div className="flex items-center mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Correct answers cannot exceed {totalMcqQuestions} questions
                      </div>
                    )}
                  </div>

                  {/* UAS Score Display */}
                  {uasScore !== null && (
                    <div className="bg-white border border-blue-300 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700">Calculated UAS Score:</span>
                        <span className="text-lg font-bold text-blue-600">{uasScore.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        ({correctAnswers} ÷ {totalMcqQuestions}) × 100 = {uasScore.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {courseType.otherName} Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={otherScore}
                  onChange={(e) => setOtherScore(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Enter ${courseType.otherName} score`}
                />
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight Information */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800 mb-1">Current Weights</h4>
                    <p className="text-sm text-purple-700">
                      UAS: {courseType.uasWeight}% • {courseType.otherName}: {courseType.otherWeight}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Grade Results</h2>
            </div>

            {isValidInput && finalScore !== null && gradeInfo ? (
              <div className="space-y-6">
                {/* Final Score */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Final Score</h3>
                  <div className="text-4xl font-bold text-blue-600">
                    {finalScore.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">out of 100</div>
                </div>

                {/* Grade Information */}
                <div className={`p-6 rounded-xl border-2 ${getGradeBgColor(gradeInfo.grade)}`}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${gradeInfo.color} mb-2`}>
                      {gradeInfo.grade}
                    </div>
                    <div className="text-xl font-semibold text-gray-700 mb-1">
                      GPA: {gradeInfo.gpa.toFixed(1)}
                    </div>
                    <div className="text-lg text-gray-600">
                      {gradeInfo.predicate}
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Calculation Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">UAS ({courseType.uasWeight}%):</span>
                      <span className="font-medium">{uasScore.toFixed(2)} × 0.{courseType.uasWeight} = {(uasScore * courseType.uasWeight / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{courseType.otherName} ({courseType.otherWeight}%):</span>
                      <span className="font-medium">{parseFloat(otherScore).toFixed(2)} × 0.{courseType.otherWeight} = {(parseFloat(otherScore) * courseType.otherWeight / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Final Score:</span>
                      <span>{finalScore.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* MCQ Performance */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-blue-700 mb-3">MCQ Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Correct Answers:</span>
                      <span className="font-medium">{correctAnswers} out of {totalMcqQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Accuracy Rate:</span>
                      <span className="font-medium">{((parseFloat(correctAnswers) / totalMcqQuestions) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">UAS Score:</span>
                      <span className="font-medium">{uasScore.toFixed(2)}/100</span>
                    </div>
                  </div>
                </div>

                {/* Grade Scale Reference */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Grade Scale ({difficulty} Level)</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {gradeRanges[difficulty].map((range) => (
                      <div
                        key={range.grade}
                        className={`flex justify-between p-2 rounded ${
                          gradeInfo.grade === range.grade 
                            ? 'bg-blue-100 border border-blue-300 font-semibold' 
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <span>{range.grade}</span>
                        <span>{range.minScore}-{range.maxScore === 100 ? 100 : Math.floor(range.maxScore)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Enter Your Scores
                </h3>
                <p className="text-gray-400">
                  Fill in MCQ answers and {courseType.otherName} score to see your results
                </p>
                {hasValidationError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Please fix the validation errors above
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Academic Grade Calculator • Created by : @naeyanika on Instagram</p>
        </div>
      </div>
    </div>
  );
}

export default App;