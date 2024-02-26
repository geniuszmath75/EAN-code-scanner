import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import BookData from "./BookData";
import ErrorSite from "./ErrorSite";
import "./Scanner.css";
import axios from "axios";

function Scanner() {
  const [barcode, setBarcode] = useState(0);
  const [showScanner, setShowScanner] = useState(true);
  const [showData, setShowData] = useState(false);
  const [skuProperties, setSkuProperties] = useState([]);
  const [error, setError] = useState(null);

  const fetchSkuNumber = async () => {
    try {
      const skuRes = await axios.get(
        `https://wydawnictwowam.pl/json/ean2sku/${barcode}`
      );
      const skuNumber = Object.assign({}, skuRes.data).products[0].product.SKU;
      return skuNumber;
    } catch {
      setError("W bazie danych nie ma książki o podanym kodzie.");
    }
  };

  const fetchBookData = async (skuNumber) => {
    try {
      const skuData = await axios.get(
        `https://plan.wydawnictwowam.pl/api/plan_get_product_info_by_sku/${skuNumber}`
      );
      const bookData = Object.values(skuData.data.success)[0];
      console.log(bookData);
      setSkuProperties(bookData);
      setShowData(true);
      setShowScanner(false);
    } catch {
      setError("Wystąpił błąd podczas pobierania danych o produkcie.");
    }
  };

  const fetchDataSKU = async () => {
    try {
      const skuNumber = await fetchSkuNumber();
      await fetchBookData(skuNumber);
    } catch {
      setError("Wystąpił błąd podczas pobierania danych o produkcie.");
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
        <div className="scanner-component">
          <BarcodeScannerComponent
            width={"auto"}
            height={"100%"}
            onUpdate={(err, result) => onUpdateScreen(err, result)}
          />
        </div>
      )}

      {showData && !error && (
        <BookData tytul={skuProperties.tytul} obraz={skuProperties.obraz} />
      )}

      {error && !showScanner && <ErrorSite message={error} />}

      {!showScanner && (
        <div className="scanner-btn-container">
          <button
            className="scanner-btn"
            onClick={() => {
              setBarcode(0);
              setShowScanner(true);
              setShowData(false);
              setError(null);
            }}
          >
            Pokaż skaner
          </button>
        </div>
      )}
    </>
  );
}

export default Scanner;
