import { useState } from "react";
import "../Styles/nurseManagementPage.css"; 
import NurseTable from "./nurseTable";
function NurseManagement() {
  return (
    <div>
      {" "}
      <div className="page-header">
        <h1 className="page-title">Nurse Management</h1>
        <h2 className="page-subtitle">
          CRUD Operations Using Node.js With MySQL
        </h2>
      </div>
      <NurseTable />
    </div>
  );
}

export default NurseManagement;
