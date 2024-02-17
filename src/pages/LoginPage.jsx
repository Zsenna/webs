import { Button } from "@material-tailwind/react";
import logo from "../images/cropped-bakdhatlogo.svg";
import { Flowbite, Spinner, Table, Button as FlowButton } from "flowbite-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import fileServices from "../services/files";
import { customButtonTheme } from "../themes/flowbiteThemes";
import Box from "../components/PhotoBox";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const studentPageView = (
  setStudentPage,
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
  downloadFile) => {
  return (
    <main className="h-full font-poppins">
      <div className="mx-auto my-12 flex max-w-7xl flex-col gap-8 px-4 lg:px-6">
        <h1 className="mb-6 block text-4xl font-semibold">
          Informasi Peserta Didik
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center justify-center sm:block">
            <Box styles="w-52 h-52">
              <img src={`http://localhost:8080/${siswa.fotoMurid}`} alt={siswa.nama} />
            </Box>
          </div>

          <div className="grid grid-cols-2">
            <p>Nama Peserta Didik</p>
            <p className="before:mr-1 before:content-[':']">{siswa.nama}</p>

            <p>Kelas Peserta Didik</p>
            <p className="before:mr-1 before:content-[':']">{siswa.kelas}</p>

            <p>NIS Peserta Didik</p>
            <p className="before:mr-1 before:content-[':']">{siswa.nis}</p>

            <p>Alamat</p>
            <p className="leading-6 before:mr-1 before:content-[':']">
              {siswa.alamat}
            </p>

            <p>Status Peserta Didik</p>
            <p className="capitalize before:mr-1 before:content-[':']">
              {siswa.status}
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
                <Table.Cell className="text-center">{siswa.sakit}</Table.Cell>
                <Table.Cell className="text-center">{siswa.izin}</Table.Cell>
                <Table.Cell className="text-center">
                  {siswa.tanpaKet}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>

        <form className="flex flex-col gap-4">
          <p className="text-2xl font-medium">Unggah Dokumen</p>
            {/* <img src={`http://localhost:8080/${siswa.dokumen}`} alt={siswa.dokumen} /> */}
          <Flowbite theme={{ theme: customButtonTheme }}>
            <FlowButton
              color="dark-green"
              size="lg"
              onClick={() => downloadFile(siswa.dokumen)}
            >
              Unduh
            </FlowButton>
          </Flowbite>
        </form>
      </div>
    </main>
  );
};

const LoginPage = () => {
  const [studentPage, setStudentPage] = useState(false);
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
  }, []);

  const downloadFile = async (fileName) => {
    try {
      const url = `http://localhost:8080/siswa/download/${fileName}`;
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

  if (siswa.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );

  if (studentPage) {
    return studentPageView(
      setStudentPage,
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
      downloadFile
    );
  }

  const findStudent = siswa.find(
    (f) => f.nama === nama && String(f.nis) === nis,
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (findStudent) {
      setSiswa(findStudent);
      setStudentPage(true);
    } else {
      alert("nama atau nis salah!");
    }
  };

  return (
    <main className="relative mx-auto flex h-[900px] max-w-7xl flex-col items-center justify-center gap-16 px-4 py-12 font-antonio lg:px-6">
      <div className="flex flex-col items-center justify-center justify-items-center gap-4">
        <img src={logo} alt="Logo Sekolah Bakti Idhata" className="h-48 w-48" />
        <p className="text-5xl font-semibold uppercase">smp bakti idhata</p>
        <p className="text-2xl font-light uppercase">cerdas terampil luhur</p>
      </div>

      <form
        className="flex w-full flex-col items-center justify-center gap-6 font-poppins"
        onSubmit={handleLogin}
      >
        <div className="text-gray-blue absolute left-4 top-12 font-poppins lg:left-6">
          <Link
            to="/siswa"
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setStudentPage(false)}
          >
            <ArrowLeftIcon className="h-6 w-6" /> Kembali
          </Link>
        </div>

        <div className="flex w-1/2 flex-col gap-2">
          <label htmlFor="name">Nama</label>
          <input
            type="text"
            id="name"
            name="nama"
            className="rounded border-gray-400"
            onChange={(e) => setnama(e.target.value)}
          />
        </div>

        <div className="mb-6 flex w-1/2 flex-col gap-2">
          <label htmlFor="nisn">Password</label>
          <input
            type="password"
            id="nisn"
            name="nis"
            className="rounded border-gray-400"
            onChange={(e) => setnis(e.target.value)}
          />
        </div>

        <Button
          variant="outlined"
          className="w-36 border-2 border-blue-300 text-base capitalize"
          type="submit"
        >
          Login
        </Button>
      </form>
    </main>
  );
};

export default LoginPage;
