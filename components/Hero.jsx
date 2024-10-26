import { useState, Suspense } from "react";
import { RoughNotationGroup } from "react-rough-notation";
import { RainbowHighlight } from "./RainbowHighlight";
import userData from "@constants/data";
import Image from "next/image";
import { cn } from "@lib/cn";
import dynamic from "next/dynamic";

// const ThreeDemo = dynamic(() => import("./ThreeDemo"), { ssr: false });

export default function Hero() {
    const colors = ["#F59E0B", "#84CC16", "#10B981", "#3B82F6"];
    // const [isThreeOpen, setIsThreeOpen] = useState(false);

    return (
        <section
            className={cn(
                "flex flex-row justify-center items-start",
                "overflow-hidden relative py-2"
            )}
        >
            {/* <div
                className={`${
                    !isThreeOpen && "hidden"
                } fade-in absolute inset-0 p-2 bg-red-500 z-10 `}
            >
                <button
                    onClick={() => setIsThreeOpen(false)}
                    className={cn(
                        "px-4 py-2 rounded-full animate-blink text-xl",
                        "flex justify-center items-center",
                        "bg-gray-200 dark:bg-white/90 dark:text-black",
                        "right-2 absolute"
                    )}
                >
                    X
                </button>
                <Suspense fallback={"loading..."}>
                    <ThreeDemo />
                </Suspense>
            </div> */}

            {/* Text container */}
            <aside className="w-full md:w-1/2 mx-auto text-center self-start md:text-left lg:p-10">
                <RoughNotationGroup show={true}>
                    <RainbowHighlight color={colors[0]}>
                        <h2 className="text-4xl md:text-8xl font-bold text-gray-700 dark:text-gray-200 my-2">
                            Developer
                        </h2>
                    </RainbowHighlight>
                    <RainbowHighlight color={colors[1]}>
                        <h2 className="text-4xl md:text-8xl font-bold text-gray-700 dark:text-gray-200 my-2">
                            Designer
                        </h2>
                    </RainbowHighlight>
                    <RainbowHighlight color={colors[2]}>
                        <h2 className="text-4xl md:text-8xl font-bold text-gray-700 dark:text-gray-200 my-2">
                            Programmer
                        </h2>
                    </RainbowHighlight>
                    <RainbowHighlight color={colors[3]}>
                        <h2 className="text-4xl md:text-8xl font-bold text-gray-700 dark:text-gray-200 my-2">
                            Composer
                        </h2>
                    </RainbowHighlight>
                </RoughNotationGroup>

                {/* <div className="pt-8 flex justify-center">
                    <button
                        onClick={() => setIsThreeOpen(!isThreeOpen)}
                        className={cn(
                            "px-8 py-4 rounded-lg animate-blink text-3xl",
                            "flex justify-center items-center",
                            "bg-gray-200 dark:bg-white/90 dark:text-black"
                        )}
                    >
                        Click here to see 3D Demo
                    </button>
                </div> */}
            </aside>
            {/* Image container */}
            <aside className="hidden lg:block relative w-full md:w-1/2 -mr-40 mt-0">
                <div className="w-3/4">
                    <Image
                        src={userData.avatarUrl}
                        alt="avatar"
                        className="rounded-full shadow"
                        width={1000}
                        height={1000}
                        priority={true}
                    />
                    <div className="flex flex-row justify-between mt-4">
                        <div className="flex flex-row space-x-2 pl-40 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-arrow-90deg-up"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"
                                />
                            </svg>
                            <p className="font-mono">That's me</p>
                        </div>
                    </div>
                </div>
            </aside>
        </section>
    );
}
