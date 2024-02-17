const customCarouselTheme = {
  carousel: {
    scrollContainer: {
      base: "flex h-full snap-center overflow-y-hidden overflow-x-scroll scroll-smooth rounded-none",
    },
    item: {
      wrapper: {
        off: "w-full h-full flex-shrink-0 cursor-default transform snap-center",
        on: "w-full h-full flex-shrink-0 cursor-default transform snap-center",
      },
    },
  },
};

const customButtonTheme = {
  button: {
    color: {
      "border-semi-green-fixedWidth":
        "border border-solid rounded-lg border-semi-green text-white w-48 h-16 text-black",
      "border-semi-green":
        "border border-solid rounded-lg border-semi-green text-white w-full h-12 text-black",
      "dark-green": "bg-dark-green text-white sm:w-36 w-full h-12",
      "dark-green-fullWidth": "bg-dark-green text-white w-full h-12",
    },
    size: {
      md: "text-base px-4 py-2",
    },
  },
};

const customModalTheme = {
  modal: {
    content: {
      base: "relative w-full p-4 h-auto",
    },
  },
};

export { customCarouselTheme, customButtonTheme, customModalTheme };
