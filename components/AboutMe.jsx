import React from "react";
import userData from "@constants/data";
import Link from "next/link";
import TechStack from "./TechStack";

export default function AboutMe() {
    return (
        <section className="bg-white dark:bg-gray-800">
            <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800">
                <h2 className=" text-5xl md:text-9xl font-bold py-20 text-center md:text-left">
                    About Me
                </h2>
            </div>
            <div className="bg-[#F1F1F1] -mt-10 dark:bg-gray-900">
                <div className="text-container max-w-6xl mx-auto pt-20">
                    <p
                        className="leading-loose text-2xl md:text-4xl font-semibold  mx-4"
                        style={{ lineHeight: "3rem" }}
                    >
                        {userData.about.title}
                    </p>
                    <p
                        className="leading-loose text-1xl md:text-2xl font-semibold  mx-4"
                        style={{ lineHeight: "3rem" }}
                    >
                        Currently working on{" "}
                        <Link
                            className="bg-red-500 rounded-md px-2 py-1 text-white"
                            href={userData.about.currentProjectUrl}
                            target="_blank"
                        >
                            {userData.about.currentProject}
                        </Link>
                    </p>
                </div>
            </div>
            <section className="bg-[#F1F1F1] dark:bg-gray-900 px-4">
                <div className="pt-20 grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-y-20 gap-x-20">
                    {/* Social Buttons */}
                    <aside className="inline-flex flex-col">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                Contact
                            </h3>
                            <p className="text-lg text-gray-500 mt-4 dark:text-gray-300">
                                For any sort help / enquiry, shoot a{" "}
                                <Link
                                    href={`mailto:${userData.email}`}
                                    className="text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300"
                                >
                                    mail
                                </Link>{" "}
                                and I'll get back. I swear.
                            </p>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                Job Opportunities
                            </h3>
                            <p className="text-lg text-gray-500 mt-4 dark:text-gray-300">
                                I'm looking for a job currently, If you see me as a good fit, please
                                get in touch.
                            </p>
                        </div>
                        {/* Social Links */}
                        <h3 className="text-xl font-semibold text-gray-700 mt-8 dark:text-gray-200">
                            Social Links
                        </h3>
                        <div className="mt-4 ml-4">
                            <div className="flex flex-row justify-start items-center">
                                <Link
                                    href={userData.socialLinks.linkedin}
                                    className="flex flex-row items-center space-x-4 group"
                                >
                                    <div className="my-4">&rarr;</div>
                                    <div className="text-lg text-gray-500 font-mono relative overflow-hidden dark:text-gray-300">
                                        <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                                        LinkedIn
                                    </div>
                                </Link>
                            </div>
                            <div className="flex flex-row justify-start items-center">
                                <Link
                                    href={userData.socialLinks.github}
                                    className="flex flex-row items-center space-x-4 group"
                                >
                                    <div className="my-4">&rarr;</div>
                                    <div className="text-lg text-gray-500 font-mono relative overflow-hidden dark:text-gray-300">
                                        <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                                        GitHub
                                    </div>
                                </Link>
                            </div>

                            <div className="flex flex-row justify-start items-center">
                                <Link
                                    href={userData.socialLinks.instagram}
                                    className="flex flex-row items-center space-x-4 group"
                                >
                                    <div className="my-4">&rarr;</div>
                                    <div className="text-lg text-gray-500 font-mono relative overflow-hidden dark:text-gray-300">
                                        <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-28 group-hover:translate-x-0 transition duration-300"></div>
                                        Instagram
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </aside>
                    {/* Text area */}
                    <div className="col-span-1 md:col-span-2">
                        {userData.about.description?.map((desc, idx) => (
                            <p key={idx} className="text-xl text-gray-700 mb-4 dark:text-gray-300 ">
                                {desc}
                            </p>
                        ))}

                        <TechStack />
                    </div>
                </div>
            </section>
        </section>
    );
}
