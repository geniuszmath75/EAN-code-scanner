import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import BookData from "./BookData";
import axios from "axios";

function Scanner() {
  const [barcode, setBarcode] = useState(0);
  const [showScanner, setShowScanner] = useState(true);
  const [showData, setShowData] = useState(false);
  const [skuProperties, setSkuProperties] = useState([]);

  const fetchSkuNumber = async () => {
    try {
      const skuRes = await axios.get(
        `https://wydawnictwowam.pl/json/ean2sku/${barcode}`
      );
      const skuNumber = Object.assign({}, skuRes.data).products[0].product.SKU;
      return skuNumber;
    } catch {
      alert("W bazie danych nie ma książki o podanym kodzie.");
    }
  };

  const fetchBookData = async (skuNumber) => {
    try {
      const skuData = await axios.get(
        `https://plan.wydawnictwowam.pl/api/plan_get_product_info_by_sku/${skuNumber}`
      );
      const bookData = Object.values(skuData.data.success)[0];
      setSkuProperties(bookData);
      setShowData(true);
      setShowScanner(false);
    } catch {
      throw new Error("Wystąpił błąd podczas pobierania danych o produkcie.");
    }
  };

  const fetchDataSKU = async () => {
    try {
      const skuNumber = await fetchSkuNumber();
      await fetchBookData(skuNumber);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (barcode !== 0) {
      fetchDataSKU();
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
          tytul={skuProperties.tytul}
          obraz={skuProperties.obraz}
        />
      )}

      <div>
        <button
          onClick={() => {
            setBarcode(0);
            setShowScanner(true);
            setShowData(false);
          }}
        >
          Skanuj
        </button>
      </div>
    </>
  );
}

export default Scanner;
