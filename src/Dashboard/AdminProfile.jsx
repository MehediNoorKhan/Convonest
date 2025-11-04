import { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../Components/useAxiosSecure";
import { AuthContext } from "../Components/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AdminProfileSkeleton from "../Skeletons/AdminProfileSkeleton";

const MySwal = withReactContent(Swal);

export default function AdminProfile() {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [adminData, setAdminData] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!user?.email) return;

        const fetchAdmin = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get(`/users?email=${user.email}`);
                if (res.data.success && res.data.data.length > 0) {
                    setAdminData(res.data.data[0]);
                }
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [user, axiosSecure]);

    const handleTagSubmit = async (e) => {
        e.preventDefault();
        if (!tags) return;

        try {
            await axiosSecure.post("/addtags", { tag: tags });
            MySwal.fire({
                icon: "success",
                title: `Tag "${tags}" added successfully!`,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: "top-right",
            });
            setTags("");
        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "Failed to add tag",
                text: err.message || "Something went wrong",
            });
        }
    };

    if (loading) return <AdminProfileSkeleton />;

    if (!adminData)
        return (
            <div className="max-w-7xl mx-auto mt-10 p-6 flex flex-col justify-center items-center bg-gray-100 rounded-xl">
                <h3 className="text-3xl font-semibold mb-3 text-red-500">No Admin Data Found</h3>
                <p className="text-xl text-error">
                    It seems there is currently no admin data available. Please check back later!
                </p>
            </div>
        );


    return (
        <div className="space-y-6 p-6 max-w-3xl mx-auto">
            {/* Admin Info Card */}
            <div className="bg-[#2a52be] p-6 rounded-xl shadow-lg text-center opacity-0 animate-fadeIn cursor-pointer transform transition hover:scale-105">
                <img
                    src={adminData.avatar || "https://via.placeholder.com/120"}
                    alt={adminData.fullName}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
                <h2 className="text-2xl font-bold text-white">{adminData.fullName}</h2>
                <p className="text-white/80">{adminData.email}</p>
            </div>

            {/* Add Tag Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg opacity-0 animate-slideUp">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Add New Tag</h2>
                <form onSubmit={handleTagSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Add a frequently used word"
                        className="input input-bordered w-full bg-white text-gray-700 placeholder-gray-400 border-gray-300"
                    />

                    <button type="submit" className="btn btn-primary">
                        Add Tag
                    </button>
                </form>
            </div>

            {/* Animations */}
            <style>{`
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

    @keyframes slideUp {
      0% { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-slideUp { animation: slideUp 0.6s ease forwards; }
  `}</style>
        </div>

    );
}
