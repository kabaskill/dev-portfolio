import userData from "@constants/data";
import { cn } from "@lib/cn";
import Link from "next/link";

export default function ExperiencePage() {
  return (
    <section className="bg-gray-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-gray-100 dark:bg-gray-800">
        <h2 className=" text-5xl md:text-9xl font-bold py-20 text-center md:text-left">
          Experience
        </h2>
      </div>
      <div className="bg-[#F1F1F1] dark:bg-gray-900 -mt-4">
        <ul className="grid grid-cols-1 dark:bg-gray-900 max-w-xl mx-auto pt-20">
          {/* Experience card */}
          {userData.experience.map((exp, idx) => (
            <>
              <ExperienceCard
                key={exp.company}
                title={exp.title}
                desc={exp.desc}
                year={exp.year}
                company={exp.company}
                companyLink={exp.companyLink}
              />
              {idx === userData.experience.length - 1 ? null : (
                <div className="divider-container flex flex-col items-center -mt-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full relative z-10">
                    <div className="w-4 h-4 bg-green-500 rounded-full relative z-10 animate-ping"></div>
                  </div>
                  <div className="w-1 h-24 bg-gray-200 dark:bg-gray-500 rounded-full -mt-2"></div>
                </div>
              )}
            </>
          ))}
        </ul>
      </div>
    </section>
  );
}

const ExperienceCard = ({ title, desc, year, company, companyLink }) => {
  return (
    <Link
      href={companyLink}
      target="_blank"
      className={cn(
        "relative experience-card border p-4 rounded-md shadow-xl bg-gray-100 dark:bg-gray-800 z-10 mx-4",
        "hover:scale-105 transiton duration-300 ease-in-out"
      )}
    >
      <p className="absolute -top-10 md:-left-10 md:-top-10 text-4xl text-gray-300 font-bold dark:text-gray-800">
        {year}
      </p>
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="flex text-gray-500">
        {company}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="self-center bi bi-arrow-up-right-square mx-2"
          stroke="4"
          strokeWidth="4"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
          />
        </svg>
      </p>
      <p className="text-gray-600 dark:text-gray-400 my-2">{desc}</p>
    </Link>
  );
};
