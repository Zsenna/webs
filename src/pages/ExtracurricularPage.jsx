import { Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const extracurricularModal = (
  openModal,
  setOpenModal,
  ekskul,
  setEkskul,
  selectedekskul, setSelectedekskul,
  closeModal
) => {
  return (
    <Modal
      dismissible
      show={openModal}
      onClose={closeModal}
    >
      <Modal.Body>  
        <div className="flex flex-col gap-4 font-poppins leading-5">
          <h1 className="text-3xl font-bold capitalize">
            {selectedekskul?.tittle}
          </h1>

          <div>
            <p>Waktu : Hari {formatDate(selectedekskul?.schedule)}</p>
            <p>Tempat: {selectedekskul?.location}</p>
          </div>

          <p>{selectedekskul?.description}</p>

          <div className="flex gap-4">
            <div className="flex justify-center">
              <img
                className="h-48 w-64 rounded-lg"
                src={`http://localhost:8080/${selectedekskul?.picture}`}
                alt=""
              />
            </div>
            <div className="flex justify-center">
              <img
                className="h-48 w-64 rounded-lg"
                src={`http://localhost:8080/${selectedekskul?.picture2}`}
                alt=""
              />
            </div>
            <div className="flex justify-center">
              <img
                className="h-48 w-64 rounded-lg"
                src={`http://localhost:8080/${selectedekskul?.picture3}`}
                alt=""
              />
            </div>
          </div>

        </div>  
      </Modal.Body>
    </Modal>
  );
};

const extracurricularModal1 = (
  openModal1,
  setOpenModal1,
  ekskul1,
  setEkskul1,
  selectedekskul1, setSelectedekskul1,
  closeModal1
) => {
  return (
    <Modal
      dismissible
      show={openModal1}
      onClose={closeModal1}
    >
      <Modal.Body>
        <div className="flex flex-col gap-4 font-poppins leading-5">
          <h1 className="text-3xl font-bold capitalize">
            {selectedekskul1?.tittle}
          </h1>

          <div>
            <p>Waktu : Hari {formatDate(selectedekskul1?.schedule)}</p>
            <p>Tempat: {selectedekskul1?.location}</p>
          </div>

          <p>{selectedekskul1?.description}</p>

          <div className="flex gap-4">
            <div className="flex justify-center">
              <img
                className="h-48 w-64 rounded-lg"
                src={`http://localhost:8080/${selectedekskul1?.picture}`}
                alt=""
              />
            </div>
            <div className="flex justify-center">
              <img
                className="h-48 w-64 rounded-lg"
                src={`http://localhost:8080/${selectedekskul1?.picture2}`}
                alt=""
              />
            </div>
            <div className="flex justify-center">
              <img
                className="h-48 w-64 rounded-lg"
                src={`http://localhost:8080/${selectedekskul1?.picture3}`}
                alt=""
              />
            </div>
          </div>

        </div>  
      </Modal.Body>
    </Modal>
  );
};

const ExtracurricularPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [ekskul, setEkskul] = useState([]);
  const [ekskul1, setEkskul1] = useState([]);
  const [selectedekskul, setSelectedekskul] = useState(null);
  const [selectedekskul1, setSelectedekskul1] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ekskulResponse, ekskulResponse1] = await Promise.all([
          axios.get("http://localhost:8080/ekstrakurikuler/favorite"),
          axios.get("http://localhost:8080/ekstrakurikuler/pilihan")
        ]);
        setEkskul(ekskulResponse.data);
        setEkskul1(ekskulResponse1.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

   const closeModal = () => {
    setOpenModal(false);
    setSelectedekskul(null);
  };

   const closeModal1 = () => {
    setOpenModal1(false);
    setSelectedekskul1(null);
  };

  return (
    <main className="font-poppins">
      <div className="focus-visible:border-none">
        {extracurricularModal(
          openModal,
          setOpenModal,
          ekskul,
          setEkskul,
          selectedekskul, setSelectedekskul,
          closeModal
        )}
      </div>
      <div className="focus-visible:border-none">
        {extracurricularModal1(
          openModal1,
          setOpenModal1,
          ekskul1,
          setEkskul1,
          selectedekskul1, setSelectedekskul1,
          closeModal1
        )}
      </div>

      <div className="bg-main-gray"
        style={{
          backgroundImage: `url('src/images/header/Group 434.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="whitespace-pre-wrap break-all text-6xl font-semibold uppercase text-white">
            ekstrakurikuler
          </h1>
          <p className="text-lg lg:text-xl text-white">Beranda - Ekstrakurikuler</p>
        </div>
      </div>

      <div className="mx-auto my-12 flex max-w-7xl flex-col gap-8 px-4 lg:px-6">
        <div>
          <h2 className="mb-8 text-2xl font-semibold">
            Ekstrakurikuler Favorit
          </h2>
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4">
            {Array.isArray(ekskul) && ekskul.map((e) => (
              <div
                key={e.ID}
                onClick={() => {
                  setSelectedekskul(e);
                  setOpenModal(true);
                }}
                className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-lg text-2xl capitalize text-white hover:cursor-pointer sm:w-56 lg:h-64 lg:w-64"
              >
                <img
                  className="h-full w-full object-cover brightness-50"
                  src={`http://localhost:8080/${e.picture}`}
                  alt=""
                />
                <p className="absolute top-1/2 -translate-y-1/2 font-bold text-white">
                  {e.tittle}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-8 text-2xl font-semibold">
            Ekstrakurikuler Pilihan
          </h2>
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-y-12 xl:grid-cols-4">
            {Array.isArray(ekskul1) && ekskul1.map((e) => (
              <div
                key={e.ID}
                onClick={() => {
                  setSelectedekskul1(e);
                  setOpenModal1(true);
                }}
                className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-lg text-2xl capitalize text-white hover:cursor-pointer sm:w-56 lg:h-64 lg:w-64"
              >
                <img
                  className="h-full w-full object-cover brightness-50"
                  src={`http://localhost:8080/${e.picture}`}
                  alt=""
                />
                <p className="absolute top-1/2 -translate-y-1/2 font-bold text-white">
                  {e.tittle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExtracurricularPage;
