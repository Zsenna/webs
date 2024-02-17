import { classNames } from "../helper";

import React, { useState, useEffect } from "react";
import axios from "axios";

import "../revert.css";

const intracurricular = (proker) => {
  return (
    <>
      {
        proker.map((prokerItem) => (
          <div style={{ width: '100%', overflowX: 'auto' }}
          key={prokerItem.ID}>
            <div
              className="our-app-wrapper block break-all !font-poppins"
              dangerouslySetInnerHTML={{ __html: prokerItem.intrakrikuler }}
            ></div>
          </div>
          )
        )
      }
    </>
  );
};

const cocurricular = (proker) => {
  return (
    <>
      {
        proker.map((prokerItem) => (
          <div style={{ width: '100%', overflowX: 'auto' }}
          key={prokerItem.ID}>
            <div
              className="our-app-wrapper block break-all !font-poppins"
              dangerouslySetInnerHTML={{ __html: prokerItem.kokurikuler }}
            ></div>
          </div>
          )
        )
      }
    </>
  );
};

const extracurricular = (proker) => {
  return (
    <>
      {
        proker.map((prokerItem) => (
          <div style={{ width: '100%', overflowX: 'auto' }}
          key={prokerItem.ID}>
            <div
              className="our-app-wrapper block break-all !font-poppins"
              dangerouslySetInnerHTML={{ __html: prokerItem.ekstrakurikuler }}
            ></div>
          </div>
          )
        )
      }
    </>
  );
};

const LearningPage = () => {
  const [proker, setproker] = useState([]);
   useEffect(() => {
    const fetchData = async () => {
      try {
        const prokerResponse = await axios.get("http://localhost:8080/organisasi");
        setproker(prokerResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const [sections, setSections] = useState([
    { title: "Intrakurikuler", current: true, content: intracurricular(proker) },
    { title: "Ko - Kurikuler", current: false, content: cocurricular(proker) },
    { title: "Ekstrakurikuler", current: false, content: extracurricular(proker) },
  ]);

  const currentPage = sections.filter((s) => s.current)[0];

  return (
    <main className="font-poppins">
      <div className="bg-main-gray"
        style={{
          backgroundImage: `url('src/images/header/Group 431.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-3xl font-semibold uppercase md:text-6xl text-white">
            pengorganisasian pembelajaran
          </h1>
          <p className="text-lg md:text-xl text-white">
            Beranda - Pengorganisasian Pembelajaran
          </p>
        </div>
      </div>

      <div className="mx-auto my-12 flex max-w-7xl flex-col-reverse gap-8 px-4 leading-6 sm:grid sm:grid-cols-[60fr_40fr] sm:gap-0 lg:px-6">
        <div>
          <div className="mx-auto my-12 flex max-w-7xl flex-col-reverse gap-8 px-4 leading-6 sm:gap-0 lg:px-6">
            <div>
              <h1 className="mb-2 py-2 text-2xl font-semibold">
                {currentPage.title}
              </h1>
              <article className="flex flex-col gap-6 text-justify">
                {currentPage.title === 'Intrakurikuler' ? intracurricular(proker)
                : currentPage.title === 'Ko - Kurikuler' ? cocurricular(proker)
                : extracurricular(proker)}
              </article>
            </div>
          </div>
        </div>
        <aside className="space-y-2 justify-self-center">
          {sections.map((section, i) => (
            <div key={i} className="flex w-full flex-col sm:w-64">
              <button
                value={section.title}
                className={classNames(
                  section.current
                    ? "bg-semi-green font-semibold text-white"
                    : "bg-light-green text-black",
                  "w-full rounded-lg px-12 py-4",
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
    </main>
  );
};

export default LearningPage;