import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/picture`;

const getAllPicture = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllPicture,
};
