import Box from "../components/PhotoBox";
import { Spinner } from "flowbite-react";

import { useState, useEffect } from "react";
import axios from "axios";

const GalleryPage = () => {
  const [galeri, setGaleri] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ekskulResponse = await axios.get("http://localhost:8080/galeri");
        setGaleri(ekskulResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);
  if (galeri.isLoading)
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
          backgroundImage: `url('src/images/header/Group 439.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-6xl font-semibold uppercase text-white">galeri</h1>
          <p className="text-lg lg:text-xl text-white">Beranda - Galeri</p>
        </div>
      </div>

      <div className="mx-auto my-12 max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 content-between gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galeri.map((g, id) => {
            return (
              <div
                key={id}
                className="flex flex-col items-center gap-4"
              >
                <Box styles="h-64 w-64 overflow-hidden">
                  <img src={`http://localhost:8080/${g.docGal}`}
                    alt="" />
                </Box>
                <p className="text-xl font-medium">{g.judulGal}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default GalleryPage;
