import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import { Pagination } from "@mui/material";
import Box from "../components/PhotoBox";
import { Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState, useEffect} from "react";

import axios from "axios";

const StudentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [siswa, setSiswa] = useState([])
  const itemsPerPage = 25;
    useEffect(() => {
      const fetchData = async () => {
        try {
          const siswwaResponse = await axios.get("http://localhost:8080/siswa");
          setSiswa(siswwaResponse.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };
      fetchData();
    }, [])
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = siswa
    .filter((s) => s.nama.toLowerCase().includes(search))
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (siswa.isLoading)
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
          backgroundImage: `url('src/images/header/Group 435.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-4xl font-semibold uppercase md:text-5xl lg:text-6xl text-white">
            peserta didik
          </h1>
          <p className="text-lg lg:text-xl text-white">Beranda - Peserta Didik</p>
        </div>
      </div>

      <div className="mx-auto my-12 max-w-7xl px-4 lg:px-6">
        <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <div className="w-full sm:w-1/2">
             <Input
              label="Masukan Nama Siswa atau Kelas"
              color="green"
              icon={<MagnifyingGlassIcon />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link to="/login">
            <button className="bg-semi-green rounded-lg px-8 py-3 text-white">
              Lihat Profile Peserta Didik
            </button>
          </Link>
        </div>

        <div>
          <Box styles="w-full h-12 px-6 mb-2 flex justify-between items-center !bg-semi-green text-white">
            <p>No.</p>
            <p>Nama Siswa</p>
            <p>Kelas</p>
          </Box>

          <hr className="mb-2 border-t border-gray-400" />

          <div className="mb-4 flex flex-col gap-2">
           {currentItems.map((s, i) => {
              return (
                <Box
                  key={i}
                  styles="w-full h-12 px-6 flex justify-between items-center !bg-main-seagreen"
                >
                  <p>{indexOfFirstItem  + i + 1}.</p>
                  <p>{s.nama}</p>
                  <p>{s.kelas}</p>
                </Box>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex">
          <div className="mr-auto"></div>
          <Pagination
            count={Math.ceil(siswa.length / itemsPerPage)}
            variant="outlined"
            shape="rounded"
            page={currentPage}
            onChange={(e, page) => paginate(page)}
          />
        </div>
      </div>
    </main>
  );
};

export default StudentsPage;
