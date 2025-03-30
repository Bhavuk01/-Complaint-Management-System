import { useState, useEffect } from "react";
import axios from "axios";
import "./AddComplaint.css";

const AddComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/complaints",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      fetchComplaints(); // Refresh the list
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">All Complaints</h2>
      {complaints.length > 0 ? (
        complaints.map((c, index) => (
          <div key={index} className="p-2 border-b">
            <strong>{c.title}</strong>: {c.description}
          </div>
        ))
      ) : (
        <p>No complaints found.</p>
      )}

      <h2 className="text-xl font-bold mt-6">Staff Members</h2>
      {staff.length > 0 ? (
        staff.map((s, index) => (
          <div key={index} className="p-2 border-b">{s.name}</div>
        ))
      ) : (
        <p>No staff members found.</p>
      )}
    </div>
  );
};

export default AddComplaint;
