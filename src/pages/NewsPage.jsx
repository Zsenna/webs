import { Input } from "@material-tailwind/react";
import { Pagination } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import newsServices from "../services/news";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsPage = () => {
  const [search, setSearch] = useState("");
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsResponse = await axios.get("http://localhost:8080/berita/:id");
        setNews(newsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news
    .filter((n) => n.judulBerita.toLowerCase().includes(search))
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (news.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );

  return (
    <main className="font-poppins">
      <div className="bg-main-gray"
        style={{
          backgroundImage: `url('src/images/header/Group 432.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-6xl font-semibold uppercase text-white">berita</h1>
          <p className="text-xl text-white">Beranda - Berita</p>
        </div>
      </div>

      <div className="mx-auto my-12 max-w-7xl px-4 lg:px-6">
        <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <div className="w-full sm:w-1/2">
            <Input
              label="Cari Berita"
              color="teal"
              icon={<MagnifyingGlassIcon />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <Pagination
              count={Math.ceil(news.length / itemsPerPage)}
              variant="outlined"
              shape="rounded"
              page={currentPage}
              onChange={(e, page) => paginate(page)}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4">
          {currentItems.map((newsItem) => (
              <Link
                key={newsItem.ID}
                to={`/berita/${newsItem.ID}`}
                className="relative h-48 w-full overflow-hidden rounded-xl"
              >
                <img
                  className="h-full w-full object-cover"
                  src={`http://localhost:8080/${newsItem.sampul}`}
                  alt="sampul berita"
                />
                <p className="absolute bottom-5 left-5 text-3xl font-bold text-white">
                  {newsItem.judulBerita}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
};

export default NewsPage;
