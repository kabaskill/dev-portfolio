import axios from "axios";

export const getLatestRepos = async (data, token) => {
  try {
    const username = data.githubUsername;
    
    if (token) {
      const res = await axios.get(
        `https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&sort=pushed&per_page=6`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return res.data;
    } 
    
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?affiliation=owner,collaborator,organization_member&sort=pushed&per_page=6`
    );
    return res.data;
    
  } catch (err) {
    console.error("Error fetching GitHub repos:", err);
    return [];  // Return empty array in case of error
  }
};

export default getLatestRepos;