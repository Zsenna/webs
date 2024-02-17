import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

const NewsCard = (props) => {
  return (
    <Card
      className="flex h-full w-full flex-col overflow-hidden border border-solid border-gray-400 shadow-none sm:max-w-sm"
      renderImage={() => (
        <img className="h-36 object-fill" src={props.imgSrc} alt={props.imgAlt} />
      )}
    >
      <h5 className="-mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        {props.title.length > 80
          ? `${props.title.slice(0, 80)}...`
          : props.title}
      </h5>
      <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
        {props.subtitle}
      </p>
      <Link
        className="mt-auto text-sm font-semibold text-dark-green"
        to={`/berita/${props.id}`}
      >
        Lihat selengkapnya &gt;
      </Link>
    </Card>
  );
};

export default NewsCard;
