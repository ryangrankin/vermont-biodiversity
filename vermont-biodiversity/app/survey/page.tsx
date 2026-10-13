"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { surveyQuestions, surveyContent } from "@/data/studentContent";

// ==========================================
// SURVEY ANSWER TYPES
// ==========================================

// Most questions allow one answer.
// The interests question allows multiple answers.

type SurveyAnswers = Record<string, string | string[]>;

export default function SurveyPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [loaded, setLoaded] = useState(false);

  // ==========================================
  // LOAD PREVIOUS ANSWERS
  // ==========================================

  useEffect(() => {
    const savedAnswers = localStorage.getItem("biodiversitySurvey");

    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch {
        setAnswers({});
      }
    }

    setLoaded(true);
  }, []);

  // ==========================================
  // SINGLE-CHOICE QUESTIONS
  // ==========================================

  function handleSingleAnswer(questionId: string, answer: string) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  // ==========================================
  // MULTIPLE-CHOICE INTERESTS
  // ==========================================

  function handleMultipleAnswer(questionId: string, option: string) {
    setAnswers((previous) => {
      const current = previous[questionId];

      const selected = Array.isArray(current)
        ? current
        : typeof current === "string" && current
          ? current.split(",")
          : [];

      const updated = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];

      return {
        ...previous,
        [questionId]: updated,
      };
    });
  }

  // ==========================================
  // SAVE SURVEY
  // ==========================================

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.setItem(
      "biodiversitySurvey",
      JSON.stringify(answers)
    );

    router.push("/dashboard");
  }

  if (!loaded) {
    return (
      <main className="container">
        <p>Loading survey...</p>
      </main>
    );
  }

  return (
    <main className="container">

      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>Personalization Survey</h1>

      <p>
        {surveyContent.introduction ||
          "[STUDENTS: WRITE SURVEY INTRODUCTION]"}
      </p>

      <form onSubmit={handleSubmit}>

        <div className="survey-container">
          {surveyQuestions.map((question, index) => {
            const isMultipleChoice = question.id === "interests";

            return (
              <section className="survey-question" key={question.id}>

                <h2>
                  {question.question ||
                    `[STUDENTS: WRITE QUESTION ${index + 1}]`}
                </h2>

                {isMultipleChoice && (
                  <p className="survey-hint">
                    Select all that apply.
                  </p>
                )}

                <div className="answer-options">

                  {question.options.map((option, optionIndex) => {
                    const currentAnswer = answers[question.id];

                    const checked = isMultipleChoice
                      ? Array.isArray(currentAnswer) &&
                        currentAnswer.includes(option)
                      : currentAnswer === option;

                    return (
                      <label
                        className="answer-option"
                        key={`${question.id}-${optionIndex}`}
                      >
                        <input
                          type={isMultipleChoice ? "checkbox" : "radio"}
                          name={question.id}
                          value={option}
                          checked={checked}
                          disabled={!option.trim()}
                          onChange={() => {
                            if (isMultipleChoice) {
                              handleMultipleAnswer(question.id, option);
                            } else {
                              handleSingleAnswer(question.id, option);
                            }
                          }}
                        />

                        <span>
                          {option ||
                            `[STUDENTS: ANSWER OPTION ${optionIndex + 1}]`}
                        </span>
                      </label>
                    );
                  })}

                </div>
              </section>
            );
          })}
        </div>

        <button type="submit" className="primary-button">
          See My Recommendations →
        </button>

      </form>
    </main>
  );
}