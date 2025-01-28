/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import "./style.css";
import Papa from "papaparse";
import { ethers } from "ethers";

const isValidEthereumAddress = (address) => ethers.isAddress(address);

const handleFileUpload = (event) => {
  const file = fetch(process.env.PUBLIC_URL + "/wallets.csv");
  if (file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        console.log("Parsed results:", results);  // Debugging line
        if (results.data && Array.isArray(results.data)) {
          const addresses = results.data.map((row) => row.address.trim());
          const uniqueAddresses = new Set();
          const invalidAddresses = [];
          const duplicateAddresses = [];

          addresses.forEach((address) => {
            if (!isValidEthereumAddress(address)) {
              invalidAddresses.push(address);
            } else if (uniqueAddresses.has(address)) {
              duplicateAddresses.push(address);
            } else {
              uniqueAddresses.add(address);
            }
          });

          // Provide feedback to the user
          if (invalidAddresses.length > 0) {
            console.error('Invalid addresses found:', invalidAddresses);
          }
          if (duplicateAddresses.length > 0) {
            console.error('Duplicate addresses found:', duplicateAddresses);
          }
          if (invalidAddresses.length === 0 && duplicateAddresses.length === 0) {
            console.log('All addresses are valid and unique.');
            // Update wallets state with valid unique addresses
            // setWallets([...uniqueAddresses]);
          }
        } else {
          console.error("Invalid data format:", results.data);
        }
      },
    });
  } else {
    console.error("No file selected");
  }
};

const SenderTable = (props) => {
  let indexOfLastItem;
  let indexOfFirstItem;
  let currentItems;
  const { wallets, setWallets, isConnected } = props;
  const { currentPage, setCurrentPage } = useState(1);
  const [itemPerPage] = useState(5);

  useEffect(() => {
    indexOfLastItem = currentPage * itemPerPage;
    indexOfFirstItem = indexOfLastItem - itemPerPage;
    currentItems = wallets && wallets.slice(indexOfFirstItem, indexOfLastItem);
  }, [wallets, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const uploadWallet = async (e) => {
    handleFileUpload(e);
    // const response = await fetch(process.env.PUBLIC_URL + "/wallets.csv");
    // const data = await response.text();
    // const dataArray = data.replace(/\s/g, "").split(",");
    // const resultArr = dataArray.filter((item) => item !== "");
    // setWallets(resultArr);
  };

  return (
    <div>
      <Table responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {wallets && wallets.length > 0
            ? wallets.map((e, idx) => {
                return (
                  <tr>
                    <td>{idx + 1}</td>
                    <td>{e}</td>
                  </tr>
                );
              })
            : "No data"}
        </tbody>
      </Table>

      {/* <Pagination>
        {[
          ...Array(Math.ceil(wallets && wallets.length / itemPerPage)).key(),
        ].map(
          // eslint-disable-next-line array-callback-return
          (number) => {
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>;
          }
        )}
      </Pagination> */}

      <div className="tableButton">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".csv"
          style={{ display: 'none' }}  // Hide the input
        />
        <Button
          className="uploadButton"
          disabled={!isConnected}
          onClick={handleFileUpload}
        >
          Upload file
        </Button>
        {/* <InputGroup className="addButton">
          <Form.Control
            placeholder="New Wallet Address"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            aria-disabled={!isConnected}
          />
          <Button variant="primary" id="button-addon2" disabled={!isConnected}>
            Add
          </Button>
        </InputGroup> */}
      </div>
    </div>
  );
};

export default SenderTable;
