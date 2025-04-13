"use client";

import { useEffect, useState } from "react";
import supabase from "@/app/config/supabaseClient";

export default function MenuManagement() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("")

    // Pagination states
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Default 5 items per page
    const [totalItems, setTotalItems] = useState(0);

    const [newItem, setNewItem] = useState({
        name: "",
        category: "bakery",
        description: "",
        price: 0,
        imageFile: null
    });

    useEffect(() => {
        fetchMenuItems();
        fetchTotalItems();
    }, [page, pageSize, selectedCategory]);

    // Fetch total items count for pagination
    const fetchTotalItems = async () => {
        let query = supabase
            .from("menu_items")
            .select("*", { count: "exact", head: true });

        if (selectedCategory !== "all") {
            query = query.eq("category", selectedCategory);
        }

        const { count, error } = await query;

        if (!error) {
            setTotalItems(count);
        } else {
            console.error("Error fetching item count:", error);
        }
    };


    const fetchMenuItems = async () => {
        setLoading(true);

        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        let query = supabase.from("menu_items").select("*").range(start, end);

        if (selectedCategory !== "all") {
            query = query.eq("category", selectedCategory);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching menu items", error);
            setError("Failed to load menu items");
        } else {
            setMenuItems(data);
        }
        setLoading(false);
    };

    return (
        <main className="max-h-full pb-[100px]">
            <h1 className="p-6 text-4xl m-0 mb-4">Menu Management</h1>

            {loading && <p>Loading menu items...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-between md:items-center mb-4 menu-management-top flex-col md:flex-row">
                {/* Filter Dropdown */}
                <div>
                    <label className="mr-2 font-bold">Filter by Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setPage(1); // Reset to first page when changing category
                        }}
                        className="border p-2 rounded-md"
                    >
                        <option value="all">All Categories</option>
                        <option value="bakery">Bakery</option>
                        <option value="hot_drinks">Hot Drinks</option>
                        <option value="frozen_drinks">Frozen Drinks</option>
                        <option value="iced_drinks">Iced Drinks</option>
                        <option value="coffee_alternative">Coffee Alternative</option>
                    </select>
                </div>

                {/*<input*/}
                {/*    type="text"*/}
                {/*    placeholder="Search menu items..."*/}
                {/*    value={searchQuery}*/}
                {/*    onChange={(e) => setSearchQuery(e.target.value)}*/}
                {/*    className="border p-2 rounded-md mb-4 w-full max-w-xs"*/}
                {/*/>*/}


                {/* Page Size Selector */}
                <div className="max-md:my-3">
                    <label className="mr-2">Items per Page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1); // Reset to first page
                        }}
                        className="border p-2 rounded-md"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                {/* Add New Item Button */}
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md max-md:w-1/2"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + Add New Item
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg menu-management-table">
                <table className="w-full border-collapse border border-gray-500">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Price</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {menuItems
                        // .filter(item =>
                        //     item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        //     item.description.toLowerCase().includes(searchQuery.toLowerCase())
                        // )
                        .map((item) => (
                        <tr key={item.id} className="text-center border-b">
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2">{item.description}</td>
                            <td className="border p-2">{item.category}</td>
                            <td className="border p-2">${item.price.toFixed(2)}</td>
                            <td className="border-none p-2 flex justify-center gap-2">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                    onClick={() => setEditItem(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                    onClick={() => setItemToDelete(item)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 menu-management-bottom">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span className="pagination-page-number">
                    Page {page} of {Math.ceil(totalItems / pageSize)}
                </span>

                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={() => setPage(page + 1)}
                    disabled={page * pageSize >= totalItems}
                >
                    Next
                </button>
            </div>

            {editItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>

                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            value={editItem.name}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                            className="border p-2 w-full mb-2"
                        />

                        <label className="block mb-1">Description</label>
                        <input
                            type="text"
                            value={editItem.description}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            className="border p-2 w-full mb-2"
                        />

                        <label className="block mb-1">Category</label>
                        <select
                            value={editItem.category}
                            onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                            className="border p-2 w-full mb-2"
                        >
                            <option value="bakery">Bakery</option>
                            <option value="hot_drinks">Hot Drinks</option>
                            <option value="frozen_drinks">Frozen Drinks</option>
                            <option value="iced_drinks">Iced Drinks</option>
                            <option value="coffee_alternative">Coffee Alternative</option>
                        </select>

                        <label className="block mb-1">Price</label>
                        <input
                            type="number"
                            value={editItem.price}
                            onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                            className="border p-2 w-full mb-4"
                        />

                        <label className="block mb-1">Update Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditItem({ ...editItem, newImageFile: e.target.files[0] })}
                            className="border p-2 w-full mb-4"
                        />


                        <div className="flex justify-center gap-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setEditItem(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={async () => {
                                    let updatedItem = { ...editItem };

                                    if (editItem.newImageFile) {
                                        const fileExt = editItem.newImageFile.name.split(".").pop();
                                        const fileName = `${Date.now()}-${editItem.id}.${fileExt}`;

                                        const { data, error: uploadError } = await supabase.storage
                                            .from("menu-images")
                                            .upload(`menu-images/${fileName}`, {
                                                cacheControl: "3600",
                                                upsert: true
                                            });

                                        if (uploadError) {
                                            console.error("Image upload failed:", uploadError);
                                            alert("Failed to upload new image.");
                                            return;
                                        }

                                        const { data: publicUrlData } = supabase
                                            .storage
                                            .from("menu-images")
                                            .getPublicUrl(`menu-images/${fileName}`);

                                        updatedItem.image_url = publicUrlData.publicUrl;
                                    }

                                    const { error } = await supabase
                                        .from("menu_items")
                                        .update({
                                            name: updatedItem.name,
                                            description: updatedItem.description,
                                            category: updatedItem.category,
                                            price: parseFloat(updatedItem.price),
                                            image_url: updatedItem.image_url,
                                        })
                                        .eq("id", updatedItem.id);

                                    if (!error) {
                                        setEditItem(null);
                                        fetchMenuItems();
                                    } else {
                                        console.error(error);
                                        alert("Failed to update item.");
                                    }
                                }}

                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {itemToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl mb-4">
                            Are you sure you want to delete <strong>{itemToDelete.name}</strong>?
                        </h2>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setItemToDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded"
                                onClick={async () => {
                                    const { error } = await supabase
                                        .from("menu_items")
                                        .delete()
                                        .eq("id", itemToDelete.id);

                                    if (!error) {
                                        setItemToDelete(null);
                                        fetchMenuItems();
                                    } else {
                                        alert("Failed to delete item.");
                                    }
                                }}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>

                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Item name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="border p-2 w-full mb-2"
                        />

                        <label className="block mb-1">Description</label>
                        <input
                            type="text"
                            placeholder="Description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="border p-2 w-full mb-2"
                        />

                        <label className="block mb-1">Category</label>
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            className="border p-2 w-full mb-2"
                        >
                            <option value="bakery">Bakery</option>
                            <option value="hot_drinks">Hot Drinks</option>
                            <option value="frozen_drinks">Frozen Drinks</option>
                            <option value="iced_drinks">Iced Drinks</option>
                            <option value="coffee_alternative">Coffee Alternative</option>
                        </select>

                        <label className="block mb-1">Price</label>
                        <input
                            type="number"
                            placeholder="Price"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value || "0") })}
                            className="border p-2 w-full mb-4"
                        />

                        <label className="block mb-1">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewItem({ ...newItem, imageFile: e.target.files[0] })}
                            className="border p-2 w-full mb-4"
                        />


                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setNewItem({ name: "", category: "bakery", description: "", price: 0 });
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={async () => {
                                    if (!newItem.name || !newItem.description || !newItem.category || !newItem.price || !newItem.imageFile) {
                                        alert("All fields including image are required!");
                                        return;
                                    }

                                    // 1. Upload image to Supabase bucket
                                    const fileExt = newItem.imageFile.name.split('.').pop();
                                    const fileName = `${Date.now()}.${fileExt}`;
                                    const filePath = `menu-items/${fileName}`;

                                    const { data: uploadData, error: uploadError } = await supabase
                                        .storage
                                        .from("menu-images")
                                        .upload(filePath, newItem.imageFile);

                                    if (uploadError) {
                                        console.error("Upload error:", uploadError);
                                        alert("Failed to upload image.");
                                        return;
                                    }


                                    const { data: { publicUrl } } = supabase
                                        .storage
                                        .from("menu-images")
                                        .getPublicUrl(filePath);

                                    // 2. Insert new menu item with image URL
                                    const { error } = await supabase
                                        .from("menu_items")
                                        .insert([{
                                            name: newItem.name,
                                            description: newItem.description,
                                            category: newItem.category,
                                            price: parseFloat(newItem.price),
                                            image_url: publicUrl
                                        }]);

                                    if (!error) {
                                        setIsAddModalOpen(false);
                                        setNewItem({ name: "", category: "bakery", description: "", price: 0, imageFile: null });
                                        fetchMenuItems();
                                    } else {
                                        alert("Failed to add item.");
                                        console.error(error);
                                    }
                                }}

                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
