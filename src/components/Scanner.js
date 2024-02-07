import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import BookData from "./BookData";
import axios from "axios";

function Scanner() {
  const [barcode, setBarcode] = useState(9788327731654);
  const [showScanner, setShowScanner] = useState(true);
  const [showData, setShowData] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://plan.wydawnictwowam.pl/api/plan_get_eproduct_info_by_any_ean/${barcode}`);
        console.log(res.data.success);
        setProperties(res.data.success);
        setShowData(true); // Dodane w celu pokazania danych po pobraniu z API
        setShowScanner(false); // Dodane w celu ukrycia skanera po pobraniu z API
      } catch (err) {
        console.log(err.message);
      }
    }

    if (barcode !== 0) {
      fetchData();
    }
  }, [barcode]); // Dodane barcode jako zależność, aby useEffect wywoływał się po zmianie kodu kreskowego

  const onUpdateScreen = (err, result) => {
    if (result) {
      setBarcode(result.text);
    }
  };

  return (
    <>
      {showScanner && (
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={(err, result) => onUpdateScreen(err, result)}
        />
      )}

      {showData && (
        <BookData
          e_title={properties.e_title}
          e_cena_netto={properties.e_cena_netto}
          e_typ={properties.e_typ}
        />
      )}

      <div>
        <button onClick={() => {
          setBarcode(0); // Dodane w celu ponownego uruchomienia skanera po kliknięciu przycisku
          setShowScanner(true);
          setShowData(false);
        }}>Skanuj</button>
      </div>
    </>
  );
}

export default Scanner;
