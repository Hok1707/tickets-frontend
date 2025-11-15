// import React, { useEffect, useState } from "react";
// import FullScreenLoader from "@/components/common/FullScreenLoader";
// import toast from "react-hot-toast";
// import { orderService } from "@/services/orderService";
// import { OrderPageResponse } from "@/types";


// export default function OrdersPage() {
//   const [orders, setOrders] = useState<OrderPageResponse[]>([]);
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [meta, setMeta] = useState({
//     totalPages: 0,
//     totalItems: 0,
//     currentPage: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async (pageNum: number) => {
//     try {
//       setLoading(true);
//       const res = await orderService.getAllOrders(pageNum, size);
//       setOrders(res.data.items);
//       setMeta({
//         totalPages: res.data.totalPages,
//         totalItems: res.data.totalItems,
//         currentPage: res.data.currentPage,
//       });
//     } catch (err: any) {
//       toast.error("Failed to load orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders(page);
//   }, [page]);

//   const nextPage = () => {
//     if (page < meta.totalPages - 1) setPage(page + 1);
//   };

//   const prevPage = () => {
//     if (page > 0) setPage(page - 1);
//   };

//   if (loading) return <FullScreenLoader />;

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">Orders</h1>

//         <div className="flex items-center gap-3">
//           <input
//             placeholder="Search orders..."
//             className="px-3 py-2 border rounded-md w-64 focus:ring focus:ring-blue-200"
//           />

//           <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
//             Filter ▼
//           </button>

//           <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="border rounded-lg overflow-hidden shadow-sm">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 sticky top-0">
//             <tr>
//               <th className="p-3">QR</th>
//               <th className="p-3">Purchaser</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Ticket ID</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Event</th>
//               <th className="p-3">Purchased On</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id} className="border-t">
//                 <td className="p-3">
//                   <img
//                     src={order.qrCode.value}
//                     className="w-10 h-10 cursor-pointer hover:scale-150 transition"
//                     title="View QR"
//                   />
//                 </td>

//                 <td className="p-3">{order.purchaser.username}</td>
//                 <td className="p-3">{order.purchaser.email}</td>
//                 <td className="p-3">{order.id}</td>

//                 <td className="p-3">
//                   <span
//                     className={
//                       "px-2 py-1 rounded text-xs font-medium " +
//                       (order.status === "PURCHASED"
//                         ? "bg-green-100 text-green-700"
//                         : order.status === "CANCELLED"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700")
//                     }
//                   >
//                     {order.status}
//                   </span>
//                 </td>

//                 <td className="p-3">{order.eventId}</td>

//                 <td className="p-3">
//                   {new Date(order.createdAt).toLocaleString()}
//                 </td>

//                 <td className="p-3 text-center">
//                   <button className="text-blue-600 hover:underline">
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center pt-4">
//         <p className="text-sm text-gray-600">
//           Showing page {meta.currentPage + 1} of {meta.totalPages}
//         </p>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={prevPage}
//             disabled={page === 0}
//             className="px-3 py-1 border rounded disabled:opacity-40"
//           >
//             Prev
//           </button>

//           {[...Array(meta.totalPages)].map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setPage(index)}
//               className={`px-3 py-1 border rounded ${index === meta.currentPage ? "bg-blue-600 text-white" : ""
//                 }`}
//             >
//               {index + 1}
//             </button>
//           ))}

//           <button
//             onClick={nextPage}
//             disabled={page >= meta.totalPages - 1}
//             className="px-3 py-1 border rounded disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }