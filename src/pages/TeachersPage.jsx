import Box from "../components/PhotoBox";
import { Flowbite, Modal, Spinner } from "flowbite-react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { customModalTheme } from "../themes/flowbiteThemes";
import { useState, useEffect } from "react";
import axios from "axios";

const adminTeacherModal = (
  setViewguru,
  openModal,
  guru, setGuru,
  setOpenModal,
  closeModal,
  selectedGuru
) => {
  return (
    <Flowbite theme={{ theme: customModalTheme }}>
      <Modal
        dismissible
        show={openModal}
        onClose={closeModal}
      >
        <Modal.Body>
          <div className="flex flex-col items-center gap-8 p-2 sm:flex-row sm:p-8">
            <div className="bottom-1/2 h-60 w-60 flex-none">
              <Box styles="h-60 w-60">
                <img src={`http://localhost:8080/${selectedGuru?.fotoGuru}`} alt="" />
              </Box>
            </div>

            <div className="flex w-full flex-col justify-evenly gap-4 font-poppins">
              <div className="space-y-1">
                <strong className="text-xl font-bold">
                  {selectedGuru?.name}
                </strong>
                <p className="leading-6">{selectedGuru?.position}</p>
              </div>

              <div className="space-y-1">
                <strong className="font-bold">Pendidikan</strong>
                <p className="leading-6">{selectedGuru?.education}</p>
              </div>

              <div className="space-y-1">
                <strong className="font-bold">Prestasi</strong>
                <p className="leading-6">{selectedGuru?.achievement}</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
};

const TeachersPage = () => {
  const [viewGuru, setViewguru] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [guru, setGuru] = useState({
    data: [],
    isLoading: true,
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const guruResponse = await axios.get("http://localhost:8080/guru");
      setGuru({
        data: guruResponse.data,
        isLoading: false,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setGuru({
        data: [],
        isLoading: false,
      });
    }
  };

  fetchData();
}, []);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedGuru(null);
  };

  return (
    <main className="font-poppins">
      <div className="flex focus-visible:border-none">
        {adminTeacherModal(
          setViewguru,
          openModal,
          guru, setGuru,
          setOpenModal,
          closeModal,
          selectedGuru
        )}
      </div>
      <div className=" bg-main-gray"
        style={{
          backgroundImage: `url('src/images/header/Group 438.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-6xl font-semibold uppercase text-white">staff pengajar</h1>
          <p className="text-xl text-white">Beranda - Staff Pengajar</p>
        </div>
      </div>
      
      <div className="mx-auto my-12 max-w-7xl">
        {guru.data?.length > 0 && (
          <div className="mb-12 flex flex-col items-center justify-center text-center"
            onClick={() => {
              setOpenModal(true); 
              setSelectedGuru(guru.data[0]);
            }}>
            <Box styles="lg:w-64 lg:h-64 w-56 h-56 mb-2">
              <img src={`http://localhost:8080/${guru.data[0]?.fotoGuru}`} alt="" />
            </Box>
            <p className="mb-2 text-xl font-bold">
              <strong>{guru.data[0]?.name}</strong>
            </p>
            <p>{guru.data[0]?.position}</p>
          </div>
        )}

        <div className="mx-auto flex flex-col justify-items-center gap-x-6 gap-y-12 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-0 lg:gap-y-36 lg:px-6 xl:grid-cols-4">
          {guru.data?.slice(1).map((guruItem) => (
            <div
              key={guruItem.ID}
              className="flex flex-col items-center justify-center text-center"
              onClick={() => {
                setOpenModal(true);
                setSelectedGuru(guruItem);
              }}
            >
              <Box styles="lg:w-64 lg:h-64 w-56 h-56 mb-2">
                <img src={`http://localhost:8080/${guruItem.fotoGuru}`} alt="" />
              </Box>
              <p className="mb-2 text-xl font-bold">
                <strong>{guruItem.name}</strong>
              </p>
              <p>{guruItem.position}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TeachersPage;
