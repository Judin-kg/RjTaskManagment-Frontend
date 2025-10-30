import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tree, TreeNode } from "react-organizational-chart";
import "./Hierarchy.css";
export default function HierarchyView() {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    axios.get("https://rjtaskmanagment-server.onrender.com/api/auth/hierarchy")
      .then((res) => setTreeData(res.data))
      .catch((err) => console.error("Error fetching hierarchy:", err));
  }, []);

  if (!treeData.length) return <p className="text-center mt-4">Loading hierarchy...</p>;

  const renderTree = (node) => (
    <TreeNode label={<div className="p-2 bg-gray-200 rounded shadow">{node.name} ({node.role})</div>}>
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeNode>
  );

  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold text-center mb-6">Company Hierarchy</h1>
    //   <Tree
    //     lineWidth={"2px"}
    //     lineColor={"#ccc"}
    //     label={<div className="p-2 bg-blue-500 text-white rounded shadow">Admin Root</div>}
    //   >
    //     {treeData.map((admin) => renderTree(admin))}
    //   </Tree>
    // </div>

    <div className="p-4 sm:p-6">
  <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
    Company Hierarchy
  </h1>

  <div className="overflow-x-auto">
    <Tree
      lineWidth={"2px"}
      lineColor={"#ccc"}
      label={
        <div className="p-2 sm:p-3 bg-blue-500 text-white rounded shadow text-xs sm:text-sm md:text-base">
          Admin Root
        </div>
      }
    >
      {treeData.map((admin) => renderTree(admin))}
    </Tree>
  </div>
</div>

  );
}
