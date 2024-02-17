import { classNames, getFloorImages } from "../helper";
import { Carousel, Flowbite, Modal, Spinner } from "flowbite-react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import places from "../places";
import { customModalTheme } from "../themes/flowbiteThemes";
import "../revert.css";

import React, { useState, useEffect } from "react";
import axios from "axios";

const schoolGroundsModal = (openModal, setOpenModal, place, setPlace) => {
  return (
    <Flowbite theme={{ theme: customModalTheme }}>
      <Modal
        dismissible
        show={openModal}
        size="3xl"
        onClose={() => {
          setPlace(null);
          setOpenModal(false);
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

const introduction = (profil) => {
  return (
    <>
      <div>
        {
          profil.map(introItem => (
            <div style={{ width: '100%', overflowX: 'auto' }}
              key={introItem.ID}
              onClick={() => handleEditProfil(introItem)}>
              <div
                className="our-app-wrapper block break-all !font-poppins"
                dangerouslySetInnerHTML={{ __html: introItem.kataPen }}
              ></div>
            </div>
            )
          )
        }
      </div>
    </>
  );
};

const visionAndMission = (profil) => {
  return (
    <>
      <div>
        {
          profil.map(visimisiItem => (
            <div style={{ width: '100%', overflowX: 'auto' }}
              key={visimisiItem.ID}
              onClick={() => handleEditProfil(visimisiItem)}>
              <div
                className="our-app-wrapper block break-all !font-poppins"
                dangerouslySetInnerHTML={{ __html: visimisiItem.visimisi }}
              ></div>
            </div>
            )
          )
        }
      </div>
    </>
  );
};

const structureOrganization = (profil) => {
  return (
    <div>
      {
        profil.map(strukturItem => (
        <div key={strukturItem}>
          <img src={`http://localhost:8080/${strukturItem.struktur}`} alt="Struktur Organisasi" />
        </div>
        )
        )
      }
    </div>
  );
};

const schoolGrounds = (
  currentSlide,
  setCurrentSlide,
  arrayAt,
  setArrayAt,
  setPlace,
  setOpenModal,
  denahRuangan, setDenahRuangan,
  denahDetail, setDenahDetail,
  denahDetail1, setDenahDetail1,
  denahDetail2, setDenahDetail2,
) => {

  return (
    <div>
      <div className="relative">
        <p className="absolute left-1/2 top-8 z-10 -translate-x-1/2 text-xl font-bold text-dark-green">
          Lantai {currentSlide + 1}
        </p>

        <Carousel
          className="h-[341px] w-full rounded-t-lg bg-light-gray-green md:h-[682px]"
          indicators={false}
          onSlideChange={(index) => {
            setCurrentSlide(index);
          }}
          slide={false}
        >
          {
            denahRuangan?.map((ruanggItem) => (
              <div
                key={ruanggItem.ID}>
                <img
                  className="scale-75"
                  src={`http://localhost:8080/${ruanggItem.fotoDenah}`}
                  alt="Denah Sekolah"
                />
              </div>
            ))
          }
        </Carousel>
        <div className="mb-4 flex w-full items-center justify-evenly rounded-b-lg bg-dark-seagreen py-8">
          <img
            className={classNames(
            currentSlide === 0
              ? "sm:scale-125"
              : "hidden sm:block sm:scale-100",
            "h-24 w-40",
          )}
            src={`http://localhost:8080/${denahRuangan[0]?.fotoDenah}`}
            alt="Denah Sekolah"
          />
          <img
            className={classNames(
            currentSlide === 1
              ? "sm:scale-125"
              : "hidden sm:block sm:scale-100",
            "h-24 w-40",
          )}
            src={`http://localhost:8080/${denahRuangan[1]?.fotoDenah}`}
            alt="Denah Sekolah"
          />
          <img
            className={classNames(
            currentSlide === 2
              ? "sm:scale-125"
              : "hidden sm:block sm:scale-100",
            "h-24 w-40",
          )}
            src={`http://localhost:8080/${denahRuangan[2]?.fotoDenah}`}
            alt="Denah Sekolah"
          />
        </div>
      </div>
      <div
        className="mb-4 grid grid-cols-1 gap-4 bg-light-gray-green px-16 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {/* {currentSlide === 0 && (
          <>
            <ChevronUpIcon
              className="h-12 w-12 stroke-dark-green p-2 hover:cursor-pointer lg:hidden"
              onClick={() => {
                if (arrayAt <= 0) return;
                setArrayAt(Math.abs(arrayAt - 5));
              }}
            />
            <ChevronLeftIcon
              className="hidden h-12 w-12 stroke-dark-green p-2 hover:cursor-pointer lg:block"
              onClick={() => {
                if (arrayAt <= 0) return;
                setArrayAt(Math.abs(arrayAt - 5));
              }}
            />
          </>
        )} */}
        {currentSlide === 0
          ? denahDetail?.map((f, i) => (
              <div
                key={i}
                className="h-full w-full rounded bg-dark-seagreen py-3 text-center text-sm font-semibold tracking-wide text-white hover:cursor-pointer"
                onClick={() => {
                  setPlace(f);
                  setOpenModal(true);
                }}
              >
                {f.nama}
              </div>
            ))
          : currentSlide === 1
            ? denahDetail1?.map((s, i) => (
                <div
                  key={i}
                  className="h-full w-full rounded bg-dark-seagreen py-3 text-center text-sm font-semibold tracking-wide text-white hover:cursor-pointer"
                  onClick={() => {
                    setPlace(s);
                    setOpenModal(true);
                  }}
                >
                  {s.nama}
                </div>
              ))
            : denahDetail2?.map((t, i) => (
                <div
                  key={i}
                  className="h-full w-full rounded bg-dark-seagreen py-3 text-center text-sm font-semibold tracking-wide text-white hover:cursor-pointer"
                  onClick={() => {
                    setPlace(t);
                    setOpenModal(true);
                  }}
                >
                  {t.nama}
                </div>
              ))}
        {/* {true && (
          <>
            <ChevronDownIcon
              className={classNames(
                currentSlide === 0 ? "block" : "invisible",
                "h-12 w-12 flex-none stroke-dark-green p-2 hover:cursor-pointer lg:hidden",
              )}
              onClick={() => {
                if (arrayAt >= 15) return;
                setArrayAt(Math.abs(arrayAt + 5));
              }}
            />
            <ChevronRightIcon
              className={classNames(
                currentSlide === 0 ? "block" : "invisible",
                "hidden h-12 w-12 flex-none stroke-dark-green p-2 hover:cursor-pointer lg:block",
              )}
              onClick={() => {
                if (arrayAt >= 15) return;
                setArrayAt(Math.abs(arrayAt + 5));
              }}
            />
          </>
        )} */}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [profil, setprofil] = useState([]);
  const [denahRuangan, setDenahRuangan] = useState([]);
  const [denahDetail, setDenahDetail] = useState([]);
  const [denahDetail1, setDenahDetail1] = useState([]);
  const [denahDetail2, setDenahDetail2] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [place, setPlace] = useState(null);
  const [arrayAt, setArrayAt] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profilResponse = await axios.get("http://localhost:8080/profil");
        setprofil(profilResponse.data);
        
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
  
  const [sections, setSections] = useState([
    { title: "Pengantar", current: true, content: introduction(profil) },
    { title: "Visi dan Misi", current: false, content: visionAndMission(profil) },
    {
      title: "Struktur Organisasi",
      current: false,
      content: structureOrganization(profil),
    },
    {  title: "Denah Sekolah",
      current: false,
      content: schoolGrounds(
        currentSlide,
        setCurrentSlide,
        arrayAt,
        setArrayAt,
        setPlace,
        setOpenModal,
        denahRuangan, setDenahRuangan,
        denahDetail, setDenahDetail,
        denahDetail1, setDenahDetail1,
        denahDetail2, setDenahDetail2,
      ), },
  ]);

   const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleArrayChange = (index) => {
    setArrayAt(index);
  };

  const handlePlaceChange = (p) => {
    setPlace(p);
  };

  const handleModalChange = (m) => {
    setOpenModal(m);
  };

  const currentPage = sections.filter((s) => s.current)[0];

  useEffect(() => {
    setSections(
      sections.map((s) => ({
        ...s,
        content:
          s.title === "Denah Sekolah"
            ? schoolGrounds(
                currentSlide,
                handleSlideChange,
                arrayAt,
                handleArrayChange,
                handlePlaceChange,
                handleModalChange,
                denahRuangan, setDenahRuangan,
                denahDetail, setDenahDetail,
                denahDetail1, setDenahDetail1,
                denahDetail2, setDenahDetail2,
              )
            : s.content,
      })),
    );
  }, [currentSlide,
    setCurrentSlide,
    arrayAt, setArrayAt,
    denahRuangan, setDenahRuangan,
    denahDetail, setDenahDetail,
    denahDetail1, setDenahDetail1,
    denahDetail2, setDenahDetail2,]);

  return (
    <main className="font-poppins">
      <div className="focus-visible:border-none">
        {schoolGroundsModal(
          openModal,
          handleModalChange,
          place,
          handlePlaceChange,
          denahRuangan, setDenahRuangan,
          denahDetail, setDenahDetail,
          denahDetail1, setDenahDetail1,
          denahDetail2, setDenahDetail2,
        )}
      </div>
      <div className="bg-main-gray"
        style={{
          backgroundImage: `url('src/images/header/Group 430.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        >
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-6xl font-semibold uppercase text-white">profil sekolah</h1>
          <p className="text-xl text-white">Beranda - Profil Sekolah</p>
        </div>
      </div>

      {currentPage.title !== "Denah Sekolah" ? (
        <div className="mx-auto my-12 flex max-w-7xl flex-col-reverse gap-8 px-4 leading-6 sm:grid sm:grid-cols-[60fr_40fr] sm:gap-0 lg:px-6">
          <div>
            <h1 className="mb-2 py-2 text-2xl font-semibold uppercase">
              {currentPage.title}
            </h1>
            <article className="flex flex-col gap-6 text-justify">
              {currentPage.title === 'Pengantar' ? introduction(profil)
                : currentPage.title === 'Visi dan Misi' ? visionAndMission(profil)
                : structureOrganization(profil)}
            </article>
          </div>

          <aside className="space-y-2 justify-self-center">
            {sections.map((section, i) => (
              <div key={i} className="flex w-64 flex-col">
                <button
                  value={section.title}
                  className={classNames(
                    section.current
                      ? "bg-semi-green font-semibold text-white"
                      : "bg-light-green text-black",
                    "rounded-lg px-12 py-4",
                  )}
                  onClick={(e) => {
                    setSections(
                      sections.map((s) =>
                        s.title === e.target.value
                          ? { ...s, current: true }
                          : { ...s, current: false },
                      ),
                    );
                  }}
                >
                  {section.title}
                </button>
              </div>
            ))}
          </aside>
        </div>
      ) : (
        <div className="mx-auto my-12 max-w-7xl px-4 lg:px-6">
          <div className="mb-8 text-gray-blue">
            <button
              className="flex items-center gap-4 text-gray-600 hover:cursor-pointer"
              onClick={() =>
                setSections([
                  {
                    title: "Pengantar",
                    current: true,
                    content: introduction(profil),
                  },
                  {
                    title: "Visi dan Misi",
                    current: false,
                    content: visionAndMission(profil),
                  },
                  {
                    title: "Struktur Organisasi",
                    current: false,
                    content: structureOrganization(profil),
                  },
                  {
                    title: "Denah Sekolah",
                    current: false,
                    content: schoolGrounds(
                      currentSlide,
                      handleSlideChange,
                      arrayAt,
                      handleArrayChange,
                      handlePlaceChange,
                      handleModalChange,
                      denahRuangan, setDenahRuangan,
                      denahDetail, setDenahDetail,
                      denahDetail1, setDenahDetail1,
                      denahDetail2, setDenahDetail2,
                    ),
                  },
                ])
              }
            >
              <ArrowLeftIcon className="h-6 w-6" /> Kembali
            </button>
          </div>

          <div>
            <h1 className="mb-2 py-2 text-2xl font-semibold uppercase">
              {currentPage.title}
            </h1>
            <article className="flex max-w-7xl flex-col gap-6">
              {currentPage.content}
            </article>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
