import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FormResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const [responsesData, formData] = await Promise.all([
          axios.get(`/api/admin/forms/${id}/responses`),
          axios.get(`/api/admin/forms/${id}`),
        ]);
        setResponses(responsesData.data);
        setFormName(formData.data.title);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [id]);


  const downloadExcel = () => {
    try {
      if (!responses.length) {
        alert("No responses to download");
        return;
      }

      const fileName = formName
        ? `ecell_${formName.toLowerCase().replace(/\s+/g, "_")}`
        : "ecell_form_responses";

      const worksheet = XLSX.utils.json_to_sheet(
        responses.map((response) => ({
          Timestamp: new Date(response.createdAt).toLocaleString(),
          ...response.responses,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file");
    }
  };

  const downloadPDF = () => {
    try {
      if (!responses.length) {
        alert("No responses to download");
        return;
      }

      const fileName = formName
        ? `ecell_${formName.toLowerCase().replace(/\s+/g, "_")}`
        : "ecell_form_responses";

      const doc = new jsPDF();
      const questions = [
        "Timestamp",
        ...new Set(responses.flatMap((r) => Object.keys(r.responses))),
      ];

      const tableData = responses.map((response) => [
        new Date(response.createdAt).toLocaleString(),
        ...questions
          .slice(1)
          .map((q) =>
            Array.isArray(response.responses[q])
              ? response.responses[q].join(", ")
              : response.responses[q] || "-"
          ),
      ]);

      doc.autoTable({
        head: [questions],
        body: tableData,
        startY: 20,
        margin: { top: 20 },
      });

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF file");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const questions =
    responses.length > 0
      ? [...new Set(responses.flatMap((r) => Object.keys(r.responses)))]
      : [];

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Form Responses</h1>
        <div className="space-x-4">
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Excel
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Download PDF
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No responses yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 bg-gray-50 px-4 py-2 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                {questions.map((question, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 border-b border-r text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {question}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {responses.map((response, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white px-4 py-2 border-r text-sm text-gray-900 whitespace-nowrap">
                    {new Date(response.createdAt).toLocaleString()}
                  </td>
                  {questions.map((question, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 border-r text-sm text-gray-900"
                    >
                      {Array.isArray(response.responses[question])
                        ? response.responses[question].join(", ")
                        : response.responses[question] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
