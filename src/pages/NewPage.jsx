import { Spinner } from "flowbite-react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../revert.css";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const NewPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const newsResponse = await axios.get(`http://localhost:8080/berita/${id}`);
          setNews(newsResponse.data);
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

  
  if (!news) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );
  }

  const currentNew = news.find((n) => n.ID === Number(id));
  
  return (
    <main className="font-poppins">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="h-full w-full object-cover brightness-50"
          src={`http://localhost:8080/${currentNew?.sampul}`}
          alt=""
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <h1 className="absolute bottom-5 text-3xl font-bold text-white">
            {currentNew?.judulBerita}
          </h1>
        </div>
      </div>
      <article className="mx-auto my-12 flex max-w-7xl flex-col gap-6 px-4 text-justify leading-6 lg:px-6">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <CalendarDaysIcon className="h-6 w-6" />
        <div>{formatDate(currentNew?.date)}</div>
      </div>
        <div
          className="our-app-wrapper block break-all !font-poppins"
          dangerouslySetInnerHTML={{ __html: currentNew?.isiBerita }}
        ></div>
      </article>
    </main>
  );
};

export default NewPage;
