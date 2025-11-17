"use client";

import {  useState } from "react";
import { Button } from "./ui/button";

export default function SuggestMessages(props: { setMessageSent: any; }) {
  const {setMessageSent} = props;
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = async () => {
    console.log("Fetching suggestions...");
    const res = await fetch("/api/suggest-messages", {
      method: "POST",
      body: JSON.stringify({ topic: "friendship feedback" }),
    });
    if(!res.ok){
      console.error("Failed to fetch suggestions:", res.statusText);
      return;
    }
    const data = await res.json();
    setSuggestions(JSON.parse(data.suggestions!));
 
  };
  console.log("Suggestions:",suggestions);
  return (
    <div>
      <Button onClick={getSuggestions} className="mt-4">Generate Message Suggestions</Button>
      <ul className="mt-2 border rounded p-4 text-sm ">
        {suggestions.map((suggestion: string, index: number) => (
          <li key={index} className="mt-2 p-2 border rounded " onClick={()=>setMessageSent(suggestion)}>
           <p>{suggestion}</p>
          </li>
        ))
        }
      </ul>
    </div>
  );
}
