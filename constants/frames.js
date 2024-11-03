import userData from "./data";

const PI = Math.PI;
const BASE_RADIUS = 5;

function getThumbnail(url) {
  const isYouTubeLink = url.includes("youtube.com");
  const isVimeoLink = url.includes("vimeo.com");

  let thumbnailUrl = "";

  if (isYouTubeLink) {
    thumbnailUrl = `https://img.youtube.com/vi/${url.split("v=")[1]}/maxresdefault.jpg`;
  } else if (isVimeoLink) {
    const vimeoVideoId = url.split("/").pop();
    thumbnailUrl = `https://i.vimeocdn.com/video/${vimeoVideoId}_640.jpg`;
  } else {
    thumbnailUrl = "https://oguzkabasakal.com/avatar.png";
  }
  return thumbnailUrl;
}

export const categories = Object.keys(userData.projects).map((key, index) => {
  const RADIUS = BASE_RADIUS * Math.log10(userData.projects[key].length);

  return {
    id: key,
    name: key,
    author: userData.projects[key].author,
    bg: "#0052a5",
    position: [index * 1.5, 0, 0],
    rotation: [0, 0, 0],

    subFrames: userData.projects[key].map((project, idx) => {
      const angle = ((PI * 2) / userData.projects[key].length) * idx;

      const posX = RADIUS * Math.cos(angle);
      const posZ = -RADIUS * Math.sin(angle);

      const rotY = angle - PI / 2;

      return {
        name: project.title,
        link: project.link,
        url: project.imgUrl || "/content-fallback.png",
        bg: "#0052a5",
        position: [RADIUS - 2 - posX, 0, posZ + 3],
        rotation: [0, -rotY, 0],
      };
    }),
  };
});
