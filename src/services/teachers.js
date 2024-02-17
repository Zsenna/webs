import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/teachers`;

const getAllTeachers = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllTeachers,
};
