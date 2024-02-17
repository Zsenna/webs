import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/announcements`;

const getAllAnnoucement = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllAnnoucement,
};
