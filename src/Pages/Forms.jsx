import { useParams } from "react-router-dom";
import Refunds from "../../Components/Refunds";
import PP from "../../Components/P&P";
import Werror from "../../Components/Werror";
import Lerror from "../../Components/Listingerror";
import Lost from "../../Components/Lost";
import Ref from "../../Components/REF";
import Defective from "../../Components/Defective";
import Carry from "../../Components/DontCarry";
import Saved from "../../Components/Saved";
import Contact from "../../Components/Contact";
import Spanish from "../../Components/Spanish";
export default function Forms() {
  const { form } = useParams();
  if (form === "Refunds") {
    return <Refunds />;
  } else if (form == "P&P") {
    return <PP />;
  } else if (form === "WE") {
    return <Werror />;
  } else if (form === "LE") {
    return <Lerror />;
  } else if (form === "Lost") {
    return <Lost />;
  } else if (form === "REF") {
    return <Ref />;
  } else if (form === "DEF") {
    return <Defective />;
  } else if (form === "PWDC") {
    return <Carry />;
  } else if (form === "SS") {
    return <Saved />;
  } else if (form === "CC") {
    return <Contact />;
  } else if (form === "SPA") {
    return <Spanish />;
  }
}
