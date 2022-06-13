
import * as React from 'react';
import {Button} from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className={"bg-gradient-to-br from-cyan-700 to-cyan-200 w-screen h-screen flex items-center justify-center text-center text-2xl"}>
     <div className={"flex  flex-col w-3/4 h-[70vh] bg-zinc-800 rounded-lg text-center items-center justify-center text-white"}>
         <div className={"w-full mb-8"}>
             <h1 className={"text-4xl font-semibold"}>
                 Welcome to the Gym
             </h1>
         </div>


            <Button type={"submit"}>
                <Link href="/dashboard">
                    <a className='inline-block bg-zinc-800 text-white text-lg font-semibold rounded-full px-6 py-3 mt-6 hover:translate-y-1 hover:bg-zinc-600 hover:text-blue-500 transition duration-400'>
                        Start
                    </a>
                </Link>
            </Button>
-




     </div>
    </div>

  )
}
