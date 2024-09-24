import { FunctionComponent } from "react";
import { ProjectCardProps } from "../../../../types/types";
import Link from "next/link";

const ServiceCard: FunctionComponent<{ service: ProjectCardProps }> = ({
  service: { Icon, title, about, href, imgpath },
}) => {
  //XSS attack :( on our portfolio btw, as an alternate use npm i dom purify
  function createMarkup() {
    return {
      __html: about,
    };
  }

  return (
    <Link href={href}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 p-6 transition duration-300 ease-in-out transform hover:bg-gray-100 text-gray-600 hover:text-gray-900">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-2xl mx-2">{title}</h3>
          <Icon size={30} />
        </div>
        <div className="my-4 text-center">
          <h4 className="text-sm" dangerouslySetInnerHTML={createMarkup()} />
        </div>
        <div className="flex flex-col items-center"></div>
      </div>
    </Link>
  );
};

export default ServiceCard;
