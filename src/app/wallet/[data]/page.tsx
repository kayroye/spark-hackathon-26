export default function WalletPage({ params }: { params: { data: string } }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Patient Wallet</h2>
      <p className="text-gray-500">QR-decoded patient summary coming soon...</p>
    </div>
  );
}
