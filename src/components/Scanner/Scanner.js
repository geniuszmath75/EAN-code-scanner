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

  async function fetchSkuNumber() {
    try {
      const skuRes = await axios.get(
        `https://wydawnictwowam.pl/json/ean2sku/${
          inputEAN.length === 0 ? barcode : parseInt(inputEAN)
        }`
      );
      const skuNumber = Object.assign({}, skuRes.data).products[0].product.SKU;
      return skuNumber;
    } catch {
      setError("W bazie danych nie ma książki o podanym kodzie.");
    }
  }

  async function fetchBookData(skuNumber) {
    try {
      const skuData = await axios.get(
        `https://plan.wydawnictwowam.pl/api/plan_get_product_info_by_sku/${skuNumber}`
      );
      const bookData = Object.values(skuData.data.success)[0];
      setSkuProperties(bookData);
      setShowData(true);
      setShowScanner(false);
      setShowInput(false);
    } catch {
      setError("Wystąpił błąd podczas pobierania danych o produkcie.");
    }
  }

  async function fetchDataSKU() {
    try {
      const skuNumber = await fetchSkuNumber();
      await fetchBookData(skuNumber);
    } catch {
      setError("Wystąpił błąd podczas pobierania danych o produkcie.");
    }
  }

  useEffect(() => {
    if (showInput) {
      focusInput.current.focus();
    }

    if (barcode !== 0) {
      fetchDataSKU();
    }
  }, [barcode, inputEAN, showInput]);

  

  function handleSubmit(e) {
    e.preventDefault();
    if (inputEAN !== "") {
      fetchDataSKU();
    }
  }

  function handleChange(e) {
    setInputEAN(e.target.value);
  }

  return (
    <>
      <div className="EAN-scanner">
        <div className="title-container">
          <h1 className="title">Scan EAN</h1>
        </div>
        {showScanner && (
          <div className="scanner-component">
            <BarcodeScannerComponent
              width={"auto"}
              height={"100%"}
              onUpdate={function onUpdateScreen(err, result) {
                if(result) {
                  return setBarcode(result.text);
                }
              }}
            />
          </div>
        )}

        {showInput && (
          <form onSubmit={handleSubmit} className="form-container">
            <input
              placeholder="Przyłóż kod do czytnika..."
              type="text"
              className="input-EAN"
              ref={focusInput}
              value={inputEAN}
              onChange={handleChange}
            />
          </form>
        )}

        {showData && !error && (
          <BookData tytul={skuProperties.tytul} obraz={skuProperties.obraz} />
        )}

        {error && !showScanner && !showInput && <ErrorSite message={error} />}

        <div className="scanner-btn-container">
          <button
            className="scanner-btn"
            onClick={() => {
              setBarcode(0);
              setInputEAN("");
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
      </div>
    </>
  );
}

export default Scanner;
