import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/news`;

const getAllNews = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllNews,
};
