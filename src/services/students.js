import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/students`;

const getAllStudents = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllStudents,
};
