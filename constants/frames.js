import userData from "./data";
import { MathUtils } from "three";

const PI = Math.PI;
const BASE_RADIUS = 3;

export const categories = Object.keys(userData.projects).map((key, index) => {
  const length = userData.projects[key].length;

  // lerp
  // const RADIUS = MathUtils.lerp(BASE_RADIUS, BASE_RADIUS * 3, length / 20);

  // clamp
  const RADIUS = MathUtils.clamp(BASE_RADIUS * (length / 10), 0, BASE_RADIUS * 4);

  return {
    id: key,
    name: key,
    author: userData.projects[key].author,
    bg: "#0052a5",
    position: [index * 1.5, 0, 0],
    rotation: [0, 0, 0],

    subFrames: userData.projects[key].map((project, idx) => {
      const angle = ((PI * 2) / length) * idx;

      const posX = RADIUS * Math.cos(angle);
      const posZ = -RADIUS * Math.sin(angle);

      const rotY = angle - PI / 2;

      return {
        name: project.title,
        link: project.link,
        url: project.imgUrl || "/content-fallback.png",
        bg: "#0052a5",
        position: [posX, 0, posZ],
        rotation: [0, rotY, 0],
      };
    }),
  };
});
