'use client';

import VerificationManagement from './VerificationManagement';

const AdminPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <VerificationManagement />
    </div>
  );
};

export default AdminPage; 