import React, { useState, useEffect } from "react";
import { Table, Input, Button, Card, message, Spin } from "antd";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
const NurseTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNurseData();
  }, []);

  const fetchNurseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9000/nurse");
      setLoading(false);

      if (response.data.status === 1) {
        console.log(response.data.data);
        const fetchedData = response.data.data;
        const firstElement = fetchedData.shift(); // Remove the first element
        setData([...fetchedData, firstElement]); // Add the first element to the end
        setFilteredData([...fetchedData, firstElement]); // Also update filtered data if needed
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  const [filteredData, setFilteredData] = useState([]);
  const [newRow, setNewRow] = useState({});

  const handleInputChange1 = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        return (
          item.name.toLowerCase()?.includes(inputValue) ||
          item.licenseNumber === parseInt(inputValue) ||
          item.Id === parseInt(inputValue) ||
          item.dob?.includes(inputValue) ||
          item.age?.toString()?.includes(inputValue)
        );
      });
      setFilteredData(filtered);
    }
  };

  const handleInputChange = (e, record, field) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.Id === item.Id);
    if (index > -1) {
      newData[index][field] = e.target.value;
      setData(newData);
    }
  };

  const handleAdd = (field, value) => {
    setNewRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleAddRow = async () => {
    console.log(newRow);
    console.log("hsjfjsdsdhhjsh");

    try {
      const response = await axios.post(
        "http://localhost:9000/nurse/add",
        newRow
      );

      if (response.data.status === 1) {
        message.success("Nurse added successfully");
        setNewRow("");
        setLoading(true);
        fetchNurseData();
      } else {
        message.error("Failed to add nurse");
      }
    } catch (error) {
      console.error("Error adding nurse:", error);
      message.error("Failed to add nurse");
    }
  };

  const handleInputBlur = async (e, record, field) => {
    try {
      const { value } = e.target;
      const newData = [...data];
      const index = newData.findIndex((item) => record.Id === item.Id);

      if (index > -1) {
        newData[index][field] = value;

        await axios.put(`http://localhost:9000/nurse/update`, {
          id: record.Id,
          [field]: value,
        });

        setData(newData);

        const filteredIndex = filteredData.findIndex(
          (item) => record.Id === item.Id
        );
        if (filteredIndex > -1) {
          const newFilteredData = [...filteredData];
          newFilteredData[filteredIndex][field] = value;
          setFilteredData(newFilteredData);
        }

        message.success("Nurse data updated successfully");
        fetchNurseData();
      }
    } catch (error) {
      console.error("Error updating nurse data:", error);
      message.error("Failed to update nurse data");
    }
  };

  const handleRemove = async (record) => {
    try {
      console.log(record.Id);
      const response = await axios.delete(
        `http://localhost:9000/nurse/${record.Id}`
      );

      if (response.data.status === 1) {
        message.success("Nurse removed successfully");
        fetchNurseData();
      } else {
        message.error("Failed to remove nurse");
      }
    } catch (error) {
      console.error("Error removing nurse:", error);
      message.error("Failed to remove nurse");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "Id",
      key: "id",
      sorter: (a, b) => a.Id - b.Id,
      render: (text, record, index) => {
        if (index === data.length - 1) {
          return "";
        } else {
          return <div>{text}</div>;
        }
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record, index) => {
        if (index === data.length - 1) {
          return (
            <Input
              value={newRow.name || ""}
              onChange={(e) => handleAdd("name", e.target.value)}
              bordered={false}
            />
          );
        } else {
          return (
            <Input
              value={text}
              onChange={(e) => handleInputChange(e, record, "name")}
              onBlur={(e) => handleInputBlur(e, record, "name")}
              bordered={false}
            />
          );
        }
      },
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
      sorter: (a, b) => a.licenseNumber - b.licenseNumber,
      render: (text, record, index) => {
        if (index === data.length - 1) {
          return (
            <Input
              value={newRow.licenseNumber || ""}
              onChange={(e) => handleAdd("licenseNumber", e.target.value)}
              bordered={false}
            />
          );
        } else {
          return (
            <Input
              value={text}
              onChange={(e) => handleInputChange(e, record, "licenseNumber")}
              onBlur={(e) => handleInputBlur(e, record, "licenseNumber")}
              bordered={false}
            />
          );
        }
      },
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      sorter: (a, b) => a.dob.localeCompare(b.dob),
      render: (text, record, index) => {
        if (index === data.length - 1) {
          return (
            <Input
              value={newRow.dob || ""}
              onChange={(e) => handleAdd("dob", e.target.value)}
              bordered={false}
            />
          );
        } else {
          return (
            <Input
              value={text}
              onChange={(e) => handleInputChange(e, record, "dob")}
              onBlur={(e) => handleInputBlur(e, record, "dob")}
              bordered={false}
            />
          );
        }
      },
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      render: (text, record, index) => {
        if (index === data.length - 1) {
          return (
            <Input
              value={newRow.age || ""}
              onChange={(e) => handleAdd("age", e.target.value)}
              bordered={false}
            />
          );
        } else {
          return (
            <Input
              value={text}
              onChange={(e) => handleInputChange(e, record, "age")}
              onBlur={(e) => handleInputBlur(e, record, "age")}
              bordered={false}
            />
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        if (index === data.length - 1) {
          return (
            <Button type="primary" onClick={handleAddRow}>
              Add Row
            </Button>
          );
        } else {
          return (
            <Button type="primary" danger onClick={() => handleRemove(record)}>
              Remove
            </Button>
          );
        }
      },
    },
  ];

  const handleDownloadCSV = () => {
    const csvData = data
      .map((item) => Object.values(item).join(","))
      .join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "nurse_data.csv");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nurse Data");
    XLSX.writeFile(workbook, "nurse_data.xlsx");
  };

  return (
    <Card className="nurse-card">
      <Input
        className="search-input"
        placeholder="Search Here"
        onChange={handleInputChange1}
        width={100}
      />
      <Button style={{ marginLeft: "16px" }} onClick={handleDownloadCSV}>
        Download CSV
      </Button>
      <Button style={{ marginLeft: "16px" }} onClick={handleDownloadExcel}>
        Download Excel
      </Button>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          bordered
          scroll={{ x: true, y: 400 }}
        />
      </Spin>
    </Card>
  );
};

export default NurseTable;
