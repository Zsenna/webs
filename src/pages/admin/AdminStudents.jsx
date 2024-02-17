import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import { Pagination } from "@mui/material";
import Box from "../../components/PhotoBox";
import fileServices from "../../services/files";
import { useQuery } from "@tanstack/react-query";
import { Button, Flowbite, Spinner, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import axios from "axios";

const studentPageView = (student,
  setStudentPage,
  files,
  siswa, 
  setSiswa,
  nama, setnama,
  kelas, setkelas,
  nis, setnis,
  alamat, setalamat,
  sakit, setsakit,
  izin, setizin,
  tanpaKet, settanpaKet,
  dokumen, setdokumen,
  fotoMurid, setfotoMurid,
  msg, setMsg,
  status, setStatus,
  handleSubmit) => {
  return (
    <main className="h-screen overflow-auto font-poppins">
      <div className="mx-auto my-12 flex max-w-7xl flex-col gap-8 px-4 lg:px-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="text-gray-blue">
            <button
              className="flex items-center gap-2 hover:cursor-pointer"
              onClick={() => {
                setStudentPage(false);
                window.location.reload();
              }}
            >
              <ArrowLeftIcon className="h-6 w-6" /> Kembali
            </button>
          </div>

          <h1 className="mb-6 block text-4xl font-semibold">
            Informasi Peserta Didik
          </h1>

          <div className="flex gap-4">
            <div>
              <Box styles="w-52 h-52">
                <label>
                  <input
                    placeholder="foto"
                    type="file"
                    name="fotoMurid"
                    onChange={(e) => {
                      setfotoMurid(e.target.files[0]);
    
                    }} />
                </label>
              </Box>
              
            </div>

            <div className="grid grid-cols-2">
              <p>Nama Peserta Didik</p>
              <p className="before:mr-1 before:content-[':']"><input
                  type="text"
                  name="nama"
                  value={nama}
                  onChange={(e) => setnama(e.target.value)}
                />
              </p>

              <p>Kelas Peserta Didik</p>
              <p className="before:mr-1 before:content-[':']"><input
                  type="text"
                  name="kelas"
                  value={kelas}
                  onChange={(e) => setkelas(e.target.value)}
                />
              </p>

              <p>NIS Peserta Didik</p>
              <p className="before:mr-1 before:content-[':']">
                <input
                  type="text"
                  name="nis"
                  value={nis}
                  onChange={(e) => setnis(e.target.value)}
                />
              </p>

              <p>Alamat</p>
              <p className="leading-6 before:mr-1 before:content-[':']">
                <input
                  type="text"
                  name="alamat"
                  value={alamat}
                  onChange={(e) => setalamat(e.target.value)}
                />
              </p>

              <p>Status Peserta Didik</p>
              <p className="before:mr-1 before:content-[':']">
                <input
                  type="text"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Head className="">
                <Table.HeadCell className="text-center font-semibold">
                  Sakit
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-semibold">
                  Izin
                </Table.HeadCell>
                <Table.HeadCell className="text-center font-semibold">
                  Tanpa Keterangan
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="text-center">
                  <input
                      type="text"
                      name="sakit"
                      value={sakit}
                      onChange={(e) => setsakit(e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell className="text-center">
                  <input
                      type="text"
                      name="izin"
                      value={izin}
                      onChange={(e) => setizin(e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <input
                      type="text"
                      name="tanpaKet"
                      value={tanpaKet}
                      onChange={(e) => settanpaKet(e.target.value)}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>

            <p className="text-2xl font-medium">Unggah Dokumen</p>

            {/* <div className="flex flex-wrap gap-8">
              {files.data?.map((f) => {
                return (
                  <div
                    key={f.id}
                    className="flex h-44 w-64 flex-col items-center justify-center gap-2 rounded border border-solid border-black"
                  >
                    <img
                      src={f.type}
                      alt="document image"
                      className="h-20 w-20"
                    />
                    <p className="capitalize">{f.name}</p>
                  </div>
                );
              })}
            </div> */}

          <label className="mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
            <input
              type="file"
              className="hidden"
              name="dokumen"
              onChange={(e) => {
                setdokumen(e.target.files[0]);
              
              }}/>
              <PlusIcon className="h-8 w-8" /> Pilih Dokumen
          </label>
            <Flowbite theme={{ theme: customButtonTheme }}>
              <Button color="dark-green" size="lg" type="submit">
                Unggah
              </Button>
            </Flowbite>
        </form>
      </div>
    </main>
  );
};

const AdminStudents = () => {
  const [search, setSearch] = useState("");
  const [studentPage, setStudentPage] = useState(false);
  const [student, setStudent] = useState(null);
  const [siswa, setSiswa] = useState([])
  const [nama, setnama] = useState('')
  const [kelas, setkelas] = useState('')
  const [nis, setnis] = useState('')
  const [alamat, setalamat] = useState('')
  const [sakit, setsakit] = useState('')
  const [izin, setizin] = useState('')
  const [tanpaKet, settanpaKet] = useState('')
  const [dokumen, setdokumen] = useState('')
  const [fotoMurid, setfotoMurid] = useState('')
  const [status, setStatus] = useState('')
  const [msg, setMsg] = useState('');
  const [selectedSiswaId, setSelectedSiswaId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleEditSiswa = (selectedSiswa) => {

    setSelectedSiswaId(selectedSiswa.ID);
    setnama(selectedSiswa.nama);
    setkelas(selectedSiswa.kelas);
    setnis(selectedSiswa.nis);
    setalamat(selectedSiswa.alamat);
    setsakit(selectedSiswa.sakit);
    setizin(selectedSiswa.izin);
    settanpaKet(selectedSiswa.tanpaKet);
    setfotoMurid(selectedSiswa.fotoMurid);
    setdokumen(selectedSiswa.dokumen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('kelas', kelas);
    formData.append('nis', nis);
    formData.append('alamat', alamat);
    formData.append('sakit', sakit);
    formData.append('izin', izin);
    formData.append('tanpaKet', tanpaKet);
    formData.append('dokumen', dokumen);
    formData.append('fotoMurid', fotoMurid);
    formData.append('status', status);

    try {
      let response;

      if (selectedSiswaId) {
        response = await axios.put(`http://localhost:8080/admin/siswa/${selectedSiswaId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/siswa', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/siswa');
        setMsg('File Successfully Uploaded');
        setSelectedSiswaId("");
        setnama("");
        setkelas("");
        setnis("");
        setalamat("");
        setsakit("");
        setizin("");
        settanpaKet("");
        setdokumen("");
        setfotoMurid("");
        setStatus("")
        setSelectedSiswaId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };

  const files = useQuery({
    queryKey: ["files"],
    queryFn: () => fileServices.getAllFile(),
  });

  if (siswa.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );

  if (studentPage) {
    return studentPageView(student,
      setStudentPage,
      files,
      siswa, 
      setSiswa,
      nama, setnama,
      kelas, setkelas,
      nis, setnis,
      alamat, setalamat,
      sakit, setsakit,
      izin, setizin,
      tanpaKet, settanpaKet,
      dokumen, setdokumen,
      fotoMurid, setfotoMurid,
      msg, setMsg,
      status, setStatus,
      handleSubmit);
  }

  return (
    <main className="h-screen overflow-auto font-poppins">
      <div className="mx-auto my-12 flex max-w-7xl flex-col gap-8 px-4 lg:px-6">
        <h1 className="mb-6 block text-4xl font-semibold">
          Halaman Peserta Didik
        </h1>

        <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
          <div className="w-full sm:w-1/2">
            <Input
              label="Masukan Nama Siswa atau Kelas"
              color="green"
              icon={<MagnifyingGlassIcon />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="">
            <Pagination
            count={Math.ceil(siswa.length / itemsPerPage)}
            variant="outlined"
            shape="rounded"
            page={currentPage}
            onChange={(e, page) => paginate(page)}
          />
          </div>
        </div>
        <div>
          <Box styles="w-full h-12 px-6 mb-2 flex justify-between items-center !bg-semi-green text-white">
            <p>No.</p>
            <p>Nama Siswa</p>
            <p>Kelas</p>
          </Box>
          <hr className="mb-2 border-t border-gray-400" />
          <div className="flex flex-col gap-2">
            {currentItems.map((s, i) => {
              return (
                <Box
                  key={s.ID}
                  styles="w-full h-12 px-6 flex justify-between items-center !bg-main-seagreen hover:cursor-pointer"
                  onClick={() => {
                    setStudent(s);
                    setStudentPage(true);
                    handleEditSiswa(s)
                  }}
                >
                  <p>{i + 1}.</p>
                  <p>{s.nama}</p>
                  <p>{s.kelas}</p>
                </Box>
              );
            })}
            <div
              className="mt-2 flex h-20 w-full items-center justify-center gap-4 rounded-xl border border-solid border-gray-500 py-2 text-3xl text-blue-800 hover:cursor-pointer"
              onClick={(e) => {
                setStudent();
                setStudentPage(true);
              }}
            >
              <PlusIcon className="h-10 w-10" /> Tambahkan Peserta Didik
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminStudents;
