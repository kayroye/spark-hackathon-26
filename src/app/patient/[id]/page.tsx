export default function PatientPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Patient Details</h2>
      <p className="text-gray-500">Referral ID: {params.id}</p>
    </div>
  );
}
