import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AccessibleIcon from '@mui/icons-material/Accessible';
import {OverridableComponent} from "@mui/material/OverridableComponent";
import {SvgIconTypeMap} from "@mui/material";


export const IconMapping: { [key: string]: OverridableComponent<SvgIconTypeMap<{}, "svg">> } = {
  'AccessibilityIcon': AccessibilityIcon,
  'AccessibleIcon': AccessibleIcon,
};