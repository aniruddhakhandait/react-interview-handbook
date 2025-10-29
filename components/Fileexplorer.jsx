import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  File,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";

const initialData = [
  {
    id: 1,
    name: "src",
    type: "folder",
    isOpen: true,
    children: [
      { id: 2, name: "App.js", type: "file" },
      {
        id: 3,
        name: "components",
        type: "folder",
        isOpen: false,
        children: [],
      },
    ],
  },
];

const FileExplorer = () => {
  const [structure, setStructure] = useState(initialData);

  // ✅ Toggle folder open/close
  const toggleFolder = (id) => {
    const toggle = (items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, isOpen: !item.isOpen }
          : item.children
          ? { ...item, children: toggle(item.children) }
          : item
      );
    setStructure(toggle(structure));
  };

  // ✅ Add file or folder inside another folder
  const addNode = (id, type) => {
    const newNode = {
      id: Date.now(),
      name: `New ${type}`,
      type,
      isEditing: true,
      ...(type === "folder" ? { children: [], isOpen: false } : {}),
    };

    const add = (items) =>
      items.map((item) =>
        item.id === id && item.type === "folder"
          ? {
              ...item,
              isOpen: true,
              children: [...(item.children || []), newNode],
            }
          : item.children
          ? { ...item, children: add(item.children) }
          : item
      );

    setStructure(add(structure));
  };

  // ✅ Delete any file or folder
  const deleteNode = (id) => {
    const del = (items) =>
      items
        .filter((item) => item.id !== id)
        .map((item) =>
          item.children ? { ...item, children: del(item.children) } : item
        );
    setStructure(del(structure));
  };

  // ✅ Rename functionality
  const renameNode = (id) => {
    const rename = (items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, isEditing: true }
          : item.children
          ? { ...item, children: rename(item.children) }
          : item
      );
    setStructure(rename(structure));
  };

  // ✅ Save renamed node
  const saveRename = (id, newName) => {
    if (!newName.trim()) {
      deleteNode(id);
      return;
    }
    const save = (items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, name: newName, isEditing: false }
          : item.children
          ? { ...item, children: save(item.children) }
          : item
      );
    setStructure(save(structure));
  };

  // ✅ Recursive rendering
  const renderTree = (nodes, level = 0) =>
    nodes.map((node) => (
      <div key={node.id} className={`ml-${level * 4} my-1`}>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition group`}
        >
          {/* Folder/File Icon */}
          {node.type === "folder" ? (
            node.isOpen ? (
              <FolderOpen
                className="text-yellow-500 cursor-pointer"
                onClick={() => toggleFolder(node.id)}
              />
            ) : (
              <Folder
                className="text-yellow-500 cursor-pointer"
                onClick={() => toggleFolder(node.id)}
              />
            )
          ) : (
            <File className="text-blue-500" />
          )}

          {/* Folder/File Name */}
          {node.isEditing ? (
            <input
              type="text"
              autoFocus
              defaultValue={node.name}
              onBlur={(e) => saveRename(node.id, e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && saveRename(node.id, e.target.value)
              }
              className="border border-gray-300 rounded px-2 text-sm w-40 focus:outline-none"
            />
          ) : (
            <span className="flex-1 text-black font-medium">{node.name}</span>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
            {node.type === "folder" && (
              <>
                <button
                  onClick={() => addNode(node.id, "folder")}
                  className="text-green-600 hover:scale-110 transition"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => addNode(node.id, "file")}
                  className="text-blue-600 hover:scale-110 transition"
                >
                  <File size={16} />
                </button>
              </>
            )}
            <button
              onClick={() => renameNode(node.id)}
              className="text-yellow-600 hover:scale-110 transition"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => deleteNode(node.id)}
              className="text-red-600 hover:scale-110 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Render Children */}
       {node.isOpen && node.children && (
         <div className="ml-5 border-l border-gray-200 pl-3">
            {renderTree(node.children,level +1)}
         </div>
       )}
      </div>
    ));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-xl w-[600px] p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 mb-5 text-center">
          📁 File Explorer
        </h1>
        {renderTree(structure)}
      </div>
    </div>
  );
};

export default FileExplorer;
