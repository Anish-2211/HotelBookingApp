'use client'
import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";
import Image from "next/image";
import React from "react";

export default function Home() {

  const handleSubmit = (e:React.FormEvent<HTMLElement>)=>{
    e.preventDefault();
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     {/* <form onSubmit={handleSubmit}>
     <input type="text" placeholder="where are you going"/>
     <input type="text" placeholder="check-in date -- check-out date" />
     <button type="submit">Search</button>
     </form> */}
     hello
    </div>
  );
}
