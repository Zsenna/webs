import { Button, Carousel, Flowbite, Modal } from "flowbite-react";
import places from "../../places";
import { classNames, getFloorImages } from "../../helper";
import { PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  customButtonTheme,
  customModalTheme,
} from "../../themes/flowbiteThemes";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const schoolGroundsModal = (
  openSchoolGroundModal,
  setOpenSchoolGroundModal,
  place,
  setPlace,
  foto, setfoto,
  nama, setnama,
  deskripsi, setdeskripsi,
) => {
  return (
    <Flowbite theme={{ theme: customModalTheme }}>
      <Modal
        dismissible
        show={openSchoolGroundModal}
        size="3xl"
        onClose={() => {
          setPlace(null);
          setOpenSchoolGroundModal(false);
        }}
      >
        <Modal.Body>
          <div className="flex flex-col gap-4 p-4 font-poppins">
            <p className="text-3xl font-bold">
              <strong>{place?.nama}</strong>
            </p>
            <p className="leading-6">{place?.deskripsi}</p>
            <img
              src={`http://localhost:8080/${place?.foto}`}
              alt={`${place?.nama} foto modal`}
            />
          </div>
        </Modal.Body>
      </Modal>
    </Flowbite>
  );
};

const adminSchoolGroundModal = (
  photos,
  openAdminSchoolGroundModal,
  setAdminSchoolGroundModal,
  foto, setfoto,
  nama, setnama,
  deskripsi, setdeskripsi,
  handleSubmit1, handleSubmit2,
  handleSubmit3, currentSlide
) => {
  return (
    <Modal
      dismissible
      show={openAdminSchoolGroundModal}
      size="4xl"
      onClose={() => {
        setAdminSchoolGroundModal(false);
      }}
    >
      <Modal.Body>
        {
          currentSlide === 0
          ? <form className="p-4 font-poppins" onSubmit={handleSubmit1}>
              <div className="mb-8 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-2xl font-medium" htmlFor="Place title">
                    Nama Ruangan
                  </label>
                  <input
                    className="rounded border-[1.5px] border-solid border-gray-400 px-2 py-1"
                    type="text"
                    name="nama"
                    value={nama}
                    onChange={(e) => setnama(e.target.value)}
                    id="Place title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-2xl font-medium"
                    htmlFor="place description"
                  >
                    Deskirpsi Ruangan
                  </label>
                  <textarea
                    id="place description"
                    name="deskripsi"
                    value={deskripsi}
                    onChange={(e) => setdeskripsi(e.target.value)}
                    className="h-52 resize-none rounded border-[1.5px] border-solid border-gray-400 px-2 py-1"
                  ></textarea>
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-4">
                <p className="text-2xl font-medium">Foto Ruangan</p>
                <label className="mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setfoto(e.target.files[0])}/>
                  <PlusIcon className="h-8 w-8" /> Pilih Dokumen
                </label>
              </div>

              <div className="flex justify-end">
                <Flowbite theme={{ theme: customButtonTheme }}>
                  <Button color="dark-green" size="lg" type="submit">
                    Simpan
                  </Button>
                </Flowbite>
              </div>
            </form>
            : currentSlide === 1 
            ? <form className="p-4 font-poppins" onSubmit={handleSubmit2}>
                <div className="mb-8 flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-2xl font-medium" htmlFor="Place title">
                      Nama Ruangan
                    </label>
                    <input
                      className="rounded border-[1.5px] border-solid border-gray-400 px-2 py-1"
                      type="text"
                      name="nama"
                      value={nama}
                      onChange={(e) => setnama(e.target.value)}
                      id="Place title"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-2xl font-medium"
                      htmlFor="place description"
                    >
                      Deskirpsi Ruangan
                    </label>
                    <textarea
                      id="place description"
                      name="deskripsi"
                      value={deskripsi}
                      onChange={(e) => setdeskripsi(e.target.value)}
                      className="h-52 resize-none rounded border-[1.5px] border-solid border-gray-400 px-2 py-1"
                    ></textarea>
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-4">
                  <p className="text-2xl font-medium">Foto Ruangan</p>
                  <label className="mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setfoto(e.target.files[0])}/>
                    <PlusIcon className="h-8 w-8" /> Pilih Dokumen
                  </label>
                </div>

                <div className="flex justify-end">
                  <Flowbite theme={{ theme: customButtonTheme }}>
                    <Button color="dark-green" size="lg" type="submit">
                      Simpan
                    </Button>
                  </Flowbite>
                </div>
              </form>
          : <form className="p-4 font-poppins" onSubmit={handleSubmit3}>
            <div className="mb-8 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-2xl font-medium" htmlFor="Place title">
                  Nama Ruangan
                </label>
                <input
                  className="rounded border-[1.5px] border-solid border-gray-400 px-2 py-1"
                  type="text"
                  name="nama"
                  value={nama}
                  onChange={(e) => setnama(e.target.value)}
                  id="Place title"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-2xl font-medium"
                  htmlFor="place description"
                >
                  Deskirpsi Ruangan
                </label>
                <textarea
                  id="place description"
                  name="deskripsi"
                  value={deskripsi}
                  onChange={(e) => setdeskripsi(e.target.value)}
                  className="h-52 resize-none rounded border-[1.5px] border-solid border-gray-400 px-2 py-1"
                ></textarea>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-4">
              <p className="text-2xl font-medium">Foto Ruangan</p>
              <label className="mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setfoto(e.target.files[0])}/>
                <PlusIcon className="h-8 w-8" /> Pilih Dokumen
              </label>
            </div>

            <div className="flex justify-end">
              <Flowbite theme={{ theme: customButtonTheme }}>
                <Button color="dark-green" size="lg" type="submit">
                  Simpan
                </Button>
              </Flowbite>
            </div>
          </form>
        }
        
      </Modal.Body>
    </Modal>
  );
};

const AdminSchoolGround = () => {
  const [place, setPlace] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openAdminSchoolGroundModal, setAdminSchoolGroundModal] =
    useState(false);
  const [openSchoolGroundModal, setOpenSchoolGroundModal] = useState(false);

  const placeObj = places;


  // pake db
  const [openModal, setOpenModal] = useState(false);
  const [denahRuangan, setDenahRuangan] = useState([]);
  const [denahDetail, setDenahDetail] = useState([]);
  const [denahDetail1, setDenahDetail1] = useState([]);
  const [denahDetail2, setDenahDetail2] = useState([]);
  const [msg, setMsg] = useState('');
  const [fotoDenah, setfotoDenah] = useState('');
  const [foto, setfoto] = useState('');
  const [nama, setnama] = useState('');
  const [deskripsi, setdeskripsi] = useState('');
  const [selectedDenahRuangId, setselectedDenahRuangId] = useState(null);
  const [selectedDenahDetailId, setselectedDenahDetailId] = useState(null);

 useEffect(() => {
    const fetchData = async () => {
      try {
 
      const response1 = await axios.get('http://localhost:8080/denahruang');
      setDenahRuangan(response1.data);

      const response2 = await axios.get('http://localhost:8080/denahdetail');
      setDenahDetail(response2.data);
        
      const response3 = await axios.get('http://localhost:8080/denahdetail1');
      setDenahDetail1(response3.data);
        
      const response4 = await axios.get('http://localhost:8080/denahdetail2');
      setDenahDetail2(response4.data);
        
    } catch (error) {
      console.error('Error fetching data:', error);
      }
    };
   fetchData();
 }, []);
  
  const handleEditDenahRuang = (selectedDenahRuang) => {
    setselectedDenahRuangId(selectedDenahRuang.ID);
    setfotoDenah(selectedDenahRuang.fotoDenah);
  };

  const handleEditDenahDetail = (selectedDenahDeatail) => {
    setselectedDenahDetailId(selectedDenahDeatail.ID);
    setfoto(selectedDenahDeatail.foto);
    setnama(selectedDenahDeatail.nama);
    setdeskripsi(selectedDenahDeatail.deskripsi);

    setOpenModal(true);
  };

  const handleEditDenahDetail1 = (selectedDenahDeatail) => {
    setselectedDenahDetailId(selectedDenahDeatail.ID);
    setfoto(selectedDenahDeatail.foto);
    setnama(selectedDenahDeatail.nama);
    setdeskripsi(selectedDenahDeatail.deskripsi);

    setOpenModal(true);
  };

  const handleEditDenahDetail2 = (selectedDenahDeatail) => {
    setselectedDenahDetailId(selectedDenahDeatail.ID);
    setfoto(selectedDenahDeatail.foto);
    setnama(selectedDenahDeatail.nama);
    setdeskripsi(selectedDenahDeatail.deskripsi);

    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fotoDenah', fotoDenah);

    try {
      let response;

      if (selectedDenahRuangId) {
        response = await axios.put(`http://localhost:8080/admin/denahruang/${selectedDenahRuangId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/denahruang', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/denah');
        setMsg('File Successfully Uploaded');
        setfotoDenah('');
        setselectedDenahRuangId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('foto', foto);

    try {
      let response;

      if (selectedDenahDetailId) {
        response = await axios.put(`http://localhost:8080/admin/denahdetail/${selectedDenahDetailId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/denahdetail', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/denah');
        setMsg('File Successfully Uploaded');
        setOpenModal(false);
        setfoto('');
        setnama('');
        setdeskripsi('');
        setselectedDenahDetailId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('foto', foto);

    try {
      let response;

      if (selectedDenahDetailId) {
        response = await axios.put(`http://localhost:8080/admin/denahdetail1/${selectedDenahDetailId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/denahdetail1', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/denah');
        setMsg('File Successfully Uploaded');
        setOpenModal(false);
        setfoto('');
        setnama('');
        setdeskripsi('');
        setselectedDenahDetailId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('foto', foto);

    try {
      let response;

      if (selectedDenahDetailId) {
        response = await axios.put(`http://localhost:8080/admin/denahdetail2/${selectedDenahDetailId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/denahdetail2', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/denah');
        setMsg('File Successfully Uploaded');
        setOpenModal(false);
        setfoto('');
        setnama('');
        setdeskripsi('');
        setselectedDenahDetailId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };



  return (
    <main className="max-h-full min-h-screen p-12 font-poppins">
      {adminSchoolGroundModal(
        placeObj.photos,
        openAdminSchoolGroundModal,
        setAdminSchoolGroundModal,
        foto, setfoto,
        nama, setnama,
        deskripsi, setdeskripsi,
        handleSubmit1, 
        handleSubmit2,
        handleSubmit3,
        currentSlide
      )}
      {schoolGroundsModal(
        openSchoolGroundModal,
        setOpenSchoolGroundModal,
        place,
        setPlace,
        foto, setfoto,
        nama, setnama,
        deskripsi, setdeskripsi,
        handleSubmit
      )}

      <div className="h-full">
        <h1 className="mb-8 block text-4xl font-semibold" htmlFor="rabuceria">
          Halaman Denah
        </h1>

        <form onSubmit={handleSubmit || handleSubmit1}>
          <div className="relative">
            <p className="absolute left-1/2 top-8 z-10 -translate-x-1/2 text-xl font-bold text-dark-green">
              Lantai {currentSlide + 1}
            </p>

            <Carousel
              className="mb-4 h-[682px] w-full rounded-t-lg bg-light-gray-green"
              indicators={false}
              onSlideChange={(index) => {
                setCurrentSlide(index);
              }}
              slide={false}
            >
              {
                denahRuangan.map((ruanggItem) => (
                  <div
                    key={ruanggItem.ID}
                    onClick={() => handleEditDenahRuang(ruanggItem)}>
                    <img
                      className="scale-75"
                      src={`http://localhost:8080/${ruanggItem.fotoDenah}`}
                      alt="Denah Sekolah"
                    />
                  </div>
                ))
              }
            </Carousel>

            <label className="absolute -bottom-2 right-4 mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
              <input
                type="file"
                className="hidden"
                name="fotoDenah"
                onChange={(e) => setfotoDenah(e.target.files[0])}/>
              <PlusIcon className="h-8 w-8" /> Pilih Gambar
            </label>
          </div>

           <div className="flex justify-end mb-5">
            <Flowbite theme={{ theme: customButtonTheme }}>
              <Button color="dark-green" size="lg" type="submit">
                Simpan
              </Button>
            </Flowbite>
          </div>

          <div>
            <div className="mb-4 grid grid-cols-1 gap-4 bg-light-gray-green px-16 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
             {currentSlide === 0
                ? denahDetail.map((f, i) => (
                    <div
                      key={i}
                      className="flex h-14 w-full items-center justify-center rounded bg-dark-seagreen px-1 text-center text-sm font-semibold tracking-wide text-white hover:cursor-pointer"
                      onClick={() => {
                        setPlace(f);
                        handleEditDenahDetail(f);
                        setAdminSchoolGroundModal(true);
                      }}
                    >
                      {f.nama}
                    </div>
                  ))
                : currentSlide === 1
                  ? denahDetail1.map((s, i) => (
                      <div
                        key={i}
                        className="flex h-14 w-full items-center justify-center rounded bg-dark-seagreen px-1 text-center text-sm font-semibold tracking-wide text-white hover:cursor-pointer"
                        onClick={() => {
                          setPlace(s);
                          handleEditDenahDetail1(s);
                          setAdminSchoolGroundModal(true);
                        }}
                      >
                        {s.nama}
                      </div>
                    ))
                  : denahDetail2.map((t, i) => (
                      <div
                        key={i}
                        className="flex h-14 w-full items-center justify-center rounded bg-dark-seagreen px-1 text-center text-sm font-semibold tracking-wide text-white hover:cursor-pointer"
                        onClick={() => {
                          setPlace(t);
                          handleEditDenahDetail2(t);
                          setAdminSchoolGroundModal(true);
                        }}
                      >
                        {t.nama}
                      </div>
                    ))}
              <button
                type="button"
                className="flex h-14 w-full items-center justify-center gap-2 rounded bg-[#d9d9d9] text-base text-[#7f7f7f] hover:cursor-pointer"
                onClick={() => {
                  setAdminSchoolGroundModal(true);
                }}
              >
                <PlusIcon className="h-6 w-6" /> Tambah
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdminSchoolGround;
