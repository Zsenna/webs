import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Spinner } from "flowbite-react";
import { useParams } from "react-router-dom";

import React, {useEffect, useState} from "react";
import axios from "axios";
import "../revert.css";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const AnnoucementPage = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const noticeResponse = await axios.get(`http://localhost:8080/pengumuman/${id}`);
          setNotice(noticeResponse.data);
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

   const downloadFile = async (fileName) => {
    try {
      const url = `http://localhost:8080/pengumuman/download/${fileName}`;
      const response = await axios.get(url, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };


  if (!notice) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );
  }

  const currentAnnoucement = notice.find((a) => a.id === Number(id));

  return (
    <main className="font-poppins">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="h-full w-full object-cover brightness-50"
          src="https://i.ibb.co/6tKXXbV/foto-gedung-2.jpg"
          alt="Gambar Pengumuman"
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <h1 className="absolute bottom-5 text-3xl font-bold text-white">
            {currentAnnoucement.judul}
          </h1>
        </div>
      </div>

      <div className="mx-auto mb-12 mt-4 flex max-w-7xl flex-col gap-6 px-4 text-justify leading-6 lg:px-6">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CalendarDaysIcon className="h-6 w-6" />
          <div>{formatDate(currentAnnoucement.date)}</div>
        </div>
        <div
          className="our-app-wrapper block break-all !font-poppins"
          dangerouslySetInnerHTML={{ __html: currentAnnoucement.descNotice }}
        ></div>
        <div className="flex flex-wrap gap-8">
            <div
              key={currentAnnoucement.ID}
            >
              {/* <p className="capitalize">{currentAnnoucement.document}</p> */}
            </div>
          
        </div>
        <p className="text-2xl font-medium">Dokumen Pengumuman</p>
        <button
          className="w-36 rounded-lg bg-dark-green px-8 py-4 text-white"
          onClick={() => downloadFile(currentAnnoucement.document)}
        >
          Unduh
        </button>
      </div>
    </main>
  );
};

export default AnnoucementPage;
