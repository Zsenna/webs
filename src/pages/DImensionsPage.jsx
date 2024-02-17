import { Spinner } from "flowbite-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../revert.css";

const DimensionsPage = () => {
  const [dikmensi, setDikmensi] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dikmensiResponse = await axios.get("http://localhost:8080/dikmensi");
        setDikmensi(dikmensiResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  if (dikmensi.isLoading)
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
          backgroundImage: `url('src/images/header/Group 437.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="mx-auto flex h-96 max-w-7xl flex-col items-start justify-center gap-4 px-4 lg:px-6">
          <h1 className="text-4xl font-semibold uppercase lg:text-6xl text-white">
            dikmensi
          </h1>
          <p className="text-lg lg:text-xl text-white">Beranda - Dikmensi</p>
        </div>
      </div>

      <div className="mx-auto my-12 max-w-7xl px-4 lg:px-6">
        <article className="leading-6">
          {
              dikmensi.map(dikmensiItem => (
                <div style={{ width: '100%', overflowX: 'auto' }}
                    key={dikmensiItem.ID}>
                    <div
                      className="our-app-wrapper block break-all !font-poppins"
                      dangerouslySetInnerHTML={{ __html: dikmensiItem.isiDikmensi }}
                    ></div>
                  </div>
                )
              )
            }
        </article>
      </div>
    </main>
  );
};

export default DimensionsPage;
