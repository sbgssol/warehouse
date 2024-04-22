import { Navbar, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import home_svg from "../assets/home.svg";
import import_svg from "../assets/import-small.svg";
import processing_svg from "../assets/processing-small.svg";
import product_svg from "../assets/product-small.svg";
import excel_svg from "../assets/excel-small.svg";

export function NavbarDefault() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };
  const handleInpClick = () => {
    navigate("/import");
  };
  const handleProcClick = () => {
    navigate("/processing-release");
  };
  const handleProdClick = () => {
    navigate("/production-release");
  };
  const handleRepoClick = () => {
    navigate("/report");
  };

  return (
    <Navbar className="max-w-screen-xl rounded-md p-1 mb-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div>
          <Button variant="gradient" color="green" className={`p-1`} onClick={handleHomeClick}>
            <img src={home_svg} alt="" />
          </Button>
        </div>
        <div className={`space-x-2`}>
          <Button variant="outlined" color="light-green" className={`p-1`} onClick={handleInpClick}>
            <img src={import_svg} alt="" />
          </Button>
          <Button variant="outlined" color="light-green" className={`p-1`} onClick={handleProcClick}>
            <img src={processing_svg} alt="" />
          </Button>
          <Button variant="outlined" color="light-green" className={`p-1`} onClick={handleProdClick}>
            <img src={product_svg} alt="" />
          </Button>
          <Button variant="outlined" color="light-green" className={`p-1`} onClick={handleRepoClick}>
            <img src={excel_svg} alt="" />
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
