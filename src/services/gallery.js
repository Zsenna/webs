import axios from "axios";
import baseUrl from "../baseUrl";

const url = `${baseUrl}/gallery`;

const getAllGalleryPicture = () => {
  return axios.get(url).then((res) => res.data);
};

export default {
  getAllGalleryPicture,
};
