import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import logo from "../images/cropped-bakdhatlogo.svg";
import { Link } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import { useState } from "react";

const navigation = [
  { name: "Beranda", link: "/" },
  { name: "Profile", link: "/profil" },
  {
    name: "Data",
    link: null,
    subLinks: [
      { name: "Staff Pengajar", link: "/guru" },
      { name: "Peserta Didik", link: "/siswa" },
    ],
  },
  {
    name: "Informasi",
    link: null,
    subLinks: [
      { name: "Berita", link: "/berita" },
      { name: "Pengumuman", link: "/pengumuman" },
      { name: "Program Kerja", link: "/organisasi" },
    ],
  },
  {
    name: "Kegiatan",
    link: null,
    subLinks: [
      { name: "Rabu Ceria", link: "/rabuceria" },
      { name: "Dikmensi", link: "/dikmensi" },
      { name: "Ekstrakurikuler", link: "/ekstrakurikuler" },
    ],
  },
  { name: "Gallery", link: "/galeri" },
  { name: "Kontak", link: null, scrollTo: "footer" },
];

const dropdownNavbarDesktop = (links, setOpenDropDown) => {
  return (
    <div className="absolute flex h-11 w-40 -translate-x-1/4 translate-y-9 flex-col border-t-2 border-solid border-t-dark-green">
      {links.map((l) => (
        <Link
          key={l.name}
          to={l.link}
          className="flex items-center bg-main-gray p-4 hover:bg-blue-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropDown("");
          }}
        >
          {l.name}
        </Link>
      ))}
    </div>
  );
};

const dropdownNavbarMobile = (links, setOpenDropDown) => {
  return (
    <div className="flex flex-col px-2">
      {links.map((l) => (
        <Link
          key={l.name}
          to={l.link}
          className="rounded p-2 hover:bg-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropDown("");
          }}
        >
          {l.name}
        </Link>
      ))}
    </div>
  );
};

export default function NavBar() {
  const [openDropdown, setOpenDropDown] = useState("");

  return (
    <Disclosure
      as="nav"
      className="relative z-10 bg-dark-seagreen font-poppins drop-shadow-md"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="relative flex h-24 items-center justify-between">
              <div className="order-last flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
                <div className="hidden lg:block">
                  <div className="flex">
                    {navigation.map((item) => {
                      if (item.link === null && item?.scrollTo) {
                        return (
                          <LinkScroll
                            key={item.name}
                            activeClass="active"
                            to={item.scrollTo}
                            spy={true}
                            smooth={true}
                            offset={50}
                            duration={500}
                            className="rounded-lg px-3 py-2 text-sm text-dark-gray hover:cursor-pointer hover:bg-gray-50/25 lg:px-3 lg:py-2 lg:text-base"
                          >
                            {item.name}
                          </LinkScroll>
                        );
                      }

                      if (item.link === null && item?.subLinks) {
                        return (
                          <div key={item.name}>
                            <div
                              className="relative rounded-lg px-3 py-2 text-sm text-dark-gray hover:cursor-pointer hover:bg-gray-50/25 lg:px-3 lg:py-2 lg:text-base"
                              onClick={() => {
                                if (openDropdown === item.name)
                                  setOpenDropDown("");
                                else setOpenDropDown(item.name);
                              }}
                            >
                              <div className="flex items-center justify-center gap-1">
                                {item.name}{" "}
                                <ChevronDownIcon className="h-4 w-4" />
                              </div>
                              {openDropdown === item.name &&
                                dropdownNavbarDesktop(
                                  item.subLinks,
                                  setOpenDropDown,
                                )}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.name}
                          to={item.link}
                          className="rounded-lg px-3 py-2 text-sm text-dark-gray hover:bg-gray-50/25 lg:px-3 lg:py-2 lg:text-base"
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 left-0 flex w-full items-center justify-between sm:static sm:inset-auto">
                <div className="flex items-center gap-4">
                  <img
                    className="w-16"
                    src={logo}
                    alt="Logo Sekolah Bakti Idhata"
                  />
                  <h1 className="flex flex-col font-antonio text-2xl font-semibold uppercase">
                    smp bakti idhata
                    <span className="text-sm font-light">
                      cerdas terampil luhur
                    </span>
                  </h1>
                </div>

                <div className="relative inset-y-0 items-center lg:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-dark-gray hover:bg-main-gray hover:outline-none hover:ring-2 hover:ring-inset hover:ring-dark-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dark-gray">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 bg-white px-2 pb-3 pt-2">
              {navigation.map((item) => {
                if (item.link === null && item?.scrollTo) {
                  return (
                    <LinkScroll
                      key={item.name}
                      activeClass="active"
                      to={item.scrollTo}
                      spy={true}
                      smooth={true}
                      offset={50}
                      duration={500}
                      className="block cursor-pointer rounded-md px-3 py-2 text-base font-medium hover:bg-gray-200/75"
                    >
                      {item.name}
                    </LinkScroll>
                  );
                }

                if (item.link === null && item?.subLinks) {
                  return (
                    <div key={item.name}>
                      <div
                        className="block cursor-pointer rounded-md px-3 py-2 text-left text-base font-medium hover:bg-gray-200/75"
                        onClick={() => {
                          if (openDropdown === item.name) setOpenDropDown("");
                          else setOpenDropDown(item.name);
                        }}
                      >
                        <div className="mb-2 flex items-center gap-1">
                          {item.name} <ChevronDownIcon className="h-4 w-4" />
                        </div>
                        {openDropdown === item.name &&
                          dropdownNavbarMobile(item.subLinks, setOpenDropDown)}
                      </div>
                    </div>
                  );
                }

                return (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.link}
                    className="block cursor-pointer rounded-md px-3 py-2 text-base font-medium hover:bg-gray-200/75"
                  >
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
