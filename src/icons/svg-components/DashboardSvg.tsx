import {createSvgIcon} from "@mui/material";
import DashboardIconSvgComponent from "../svg/dashboard.svg";

const DashboardIconSvg = () => {
  return <>{DashboardIconSvgComponent().props.children}</>;
}

const DashboardIconSvgWidth = () => {
  return DashboardIconSvgComponent().props.width;
}

const DashboardIconSvgHeight= () => {
  return DashboardIconSvgComponent().props.height;
}

const DashboardIcon = createSvgIcon(
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${DashboardIconSvgWidth()} ${DashboardIconSvgHeight()}`}>
      <DashboardIconSvg />
    </svg>,
    'DashboardIcon',
);

export default DashboardIcon;