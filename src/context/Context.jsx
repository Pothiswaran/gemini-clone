import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const delayPara = (index, nextword) => {
    setTimeout(function () {
      setResult((prev) => prev + nextword);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResult("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(prompt);
    if (!promptHistory.includes(prompt)) {
      setPromptHistory((prev) => [...prev, prompt]);
    }

    const response = await runChat(prompt);
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 === 0) {
        newResponse += responseArray[i];
      } else {
        newResponse += `<b>${responseArray[i]}</b>`;
      }
    }
    const finalResponse = newResponse.split("*").join("</br>");
    const newResponseArray = finalResponse.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    result,
    loading,
    promptHistory,
    onSent,
    showResult,
    recentPrompt,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
