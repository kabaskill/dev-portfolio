import axios from "axios";

const getLatestRepos = async (data, token) => {
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
      let latestSixRepos = res.data;
      return latestSixRepos;
    } else {
      const res = await axios.get(
        `https://api.github.com/users/${username}/repos?affiliation=owner,collaborator,organization_member&sort=pushed&per_page=6`
      );
      let latestSixRepos = res.data;
      return latestSixRepos;
    }
  } catch (err) {
    console.log(err);
  }
};

export default getLatestRepos;
