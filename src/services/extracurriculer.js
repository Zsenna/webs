import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/extracurriculer`;

const getAllExtracurriculer = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllExtracurriculer,
};
