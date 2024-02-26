import React, { useState, useEffect, useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import BookData from "./BookData";
import ErrorSite from "./ErrorSite";
import "./Scanner.css";
import axios from "axios";

function Scanner() {
  const [barcode, setBarcode] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [skuProperties, setSkuProperties] = useState([]);
  const [error, setError] = useState(null);
  const [inputEAN, setInputEAN] = useState("");

  const focusInput = useRef(null);

  const fetchSkuNumber = async () => {
    try {
      const skuRes = await axios.get(
        `https://wydawnictwowam.pl/json/ean2sku/${inputEAN.length === 0 ? barcode : parseInt(inputEAN)}`
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
      console.log(showData);
    } catch {
      setError("Wystąpił błąd podczas pobierania danych o produkcie.");
    }
  };

  useEffect(() => {
    if (showInput) {
          focusInput.current.focus();
        }

    if (barcode !== 0 || inputEAN !== "") {
      fetchDataSKU();
    }
  }, [barcode, inputEAN, showInput]);

  const onUpdateScreen = (err, result) => {
    if (result) {
      setBarcode(result.text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  }

  const handleChange = (e) => {
    setInputEAN(e.target.value);
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

      {showInput && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-EAN"
            ref={focusInput}
            value={inputEAN}
            onChange={handleChange}
          />
        </form>
      )}

      {showData && !error && console.log(showData) && (
        <BookData tytul={skuProperties.tytul} obraz={skuProperties.obraz} />
      )}

      {error && !showScanner && !showInput && <ErrorSite message={error} />}

      <div className="scanner-btn-container">
        <button
          className="scanner-btn"
          onClick={() => {
            setBarcode(0);
            setShowScanner(true);
            setShowData(false);
            setShowInput(false);
            setError(null);
          }}
        >
          Kamera
        </button>
        <button
          className="reader-btn"
          onClick={() => {
            setBarcode(0);
            setInputEAN("");
            setShowInput(true);
            setShowScanner(false);
            setShowData(false);
            setError(null);
          }}
        >
          Czytnik
        </button>
      </div>
    </>
  );
}

export default Scanner;
