import { ImCross } from 'react-icons/im';

export default function PDFViewer({ downloadURL, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70">
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg w-full mx-20">
        <div className="flex justify-end">
          <button
            className="text-black text-lg hover:text-customDark hover:border-customDark hover:border-2 p-1 mb-3 border-none"
            onClick={onClose}
          >
            <ImCross />
          </button>
        </div>
        <embed
          type="application/pdf"
          src={downloadURL}
          width="100%"
          height="500px"
        />
      </div>
    </div>
  );
}
