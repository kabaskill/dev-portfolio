import {
  SiAdobecreativecloud,
  SiAdobecreativecloudHex,
  SiCsharp,
  SiCsharpHex,
  SiCss3,
  SiCss3Hex,
  SiFigma,
  SiFigmaHex,
  SiFmod,
  SiFmodHex,
  SiGit,
  SiGitHex,
  SiGithub,
  SiGithubHex,
  SiHtml5,
  SiHtml5Hex,
  SiJavascript,
  SiJavascriptHex,
  SiMongodb,
  SiMongodbHex,
  SiNeovim,
  SiNeovimHex,
  SiNextdotjs,
  SiNextdotjsHex,
  SiReact,
  SiReactHex,
  SiStyledcomponents,
  SiStyledcomponentsHex,
  SiTailwindcss,
  SiTailwindcssHex,
  SiTypescript,
  SiTypescriptHex,
  SiUnity,
  SiUnityHex,
  SiVercel,
  SiVercelHex,
} from "@icons-pack/react-simple-icons";

export default function TechStack() {
 const iconSize = 72
    return (
    <>
      <h1 className="bg-red-500 text-3xl rounded-md px-2 py-1 inline-block font-bold text-gray-50 ">
        Tech Stack
      </h1>
      <div className="bg-gray-100 flex justify-center flex-row flex-wrap gap-8 mt-2 px-4 py-4  ">
        <SiHtml5 title="HTML" color={SiHtml5Hex} size={iconSize} />
        <SiCss3 title="CSS" color={SiCss3Hex} size={iconSize} />
        <SiJavascript title="JavaScript" color={SiJavascriptHex} size={iconSize} />
        <SiTypescript title="TypeScript" color={SiTypescriptHex} size={iconSize} />
        <SiReact title="React" color={SiReactHex} size={iconSize} />
        <SiTailwindcss title="Tailwind" color={SiTailwindcssHex} size={iconSize} />
        <SiStyledcomponents title="Styled Components" color={SiStyledcomponentsHex} size={iconSize} />
        <SiNextdotjs title="Next.js" color={SiNextdotjsHex} size={iconSize} />
        <SiVercel title="Vercel" color={SiVercelHex} size={iconSize} />
        <SiGit title="Git" color={SiGitHex} size={iconSize} />
        <SiGithub title="GitHub" color={SiGithubHex} size={iconSize} />
        <SiMongodb title="Mongodb" color={SiMongodbHex} size={iconSize} />
        <SiNeovim title="NeoVim" color={SiNeovimHex} size={iconSize} />
        <SiCsharp title="C#" color={SiCsharpHex} size={iconSize} />
        <SiUnity title="Unity" color={SiUnityHex} size={iconSize} />
        <SiFmod title="Fmod" color={SiFmodHex} size={iconSize} />
        <SiAdobecreativecloud
          title="Adobe Creative Cloud"
          color={SiAdobecreativecloudHex}
          size={iconSize}
        />
        <SiFigma title="Figma" color={SiFigmaHex} size={iconSize} />

      </div>
    </>
  );
}
