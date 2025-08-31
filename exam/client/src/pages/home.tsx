import React, { useState } from 'react';
import Header from '@/components/Header';
import PackageSelector from '@/components/PackageSelector';
import PaymentModal from '@/components/PaymentModal';
import { GraduationCap, Shield, Star, CheckCircle, FileText, ChevronDown } from 'lucide-react';

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export default function Home() {
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const semesters = [
    { id: '1st', name: '1st Semester' },
    { id: '2nd', name: '2nd Semester' },
    { id: '3rd', name: '3rd Semester' },
    { id: '4th', name: '4th Semester' },
    { id: '5th', name: '5th Semester' },
    { id: '6th', name: '6th Semester' },
    { id: '7th', name: '7th Semester' },
    { id: '8th', name: '8th Semester' },
    { id: 'yearly', name: 'Yearly Pattern' }
  ];

  const branches = [
    { id: 'cse', name: 'Computer Science & Engineering (CSE)' },
    { id: 'ece', name: 'Electronics & Communication (ECE)' },
    { id: 'me', name: 'Mechanical Engineering (ME)' },
    { id: 'ce', name: 'Civil Engineering (CE)' },
    { id: 'ee', name: 'Electrical Engineering (EE)' },
    { id: 'che', name: 'Chemical Engineering (CHE)' }
  ];

  const handlePurchase = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-4 rounded-full shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" data-testid="icon-graduation-cap" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-main-title">
            JUT Official Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4" data-testid="text-main-description">
            Official Portal for Examination Materials & Important Questions
          </p>
          <div className="mt-3 text-sm text-primary font-medium" data-testid="text-university-name">
            Jharkhand University of Technology (JUT)
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow" data-testid="card-trust-official">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" data-testid="icon-shield" />
            <h3 className="font-semibold text-foreground mb-1 text-sm" data-testid="text-trust-title-official">Official Content</h3>
            <p className="text-muted-foreground text-xs" data-testid="text-trust-desc-official">Verified examination materials</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow" data-testid="card-trust-accuracy">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" data-testid="icon-star" />
            <h3 className="font-semibold text-foreground mb-1 text-sm" data-testid="text-trust-title-accuracy">High Accuracy</h3>
            <p className="text-muted-foreground text-xs" data-testid="text-trust-desc-accuracy">Trusted by thousands of students</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-border text-center hover:shadow-md transition-shadow" data-testid="card-trust-instant">
            <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" data-testid="icon-check-circle" />
            <h3 className="font-semibold text-foreground mb-1 text-sm" data-testid="text-trust-title-instant">Instant Download</h3>
            <p className="text-muted-foreground text-xs" data-testid="text-trust-desc-instant">Immediate access after payment</p>
          </div>
        </div>

        {/* Selection Process */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-t-4 border-primary">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-center" data-testid="text-selection-title">
                📋 Select Your Academic Requirements
              </h2>
              <p className="text-center text-primary-foreground/80 text-sm mt-1" data-testid="text-selection-subtitle">
                Choose semester and branch to view available materials
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Semester Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" data-testid="label-semester">
                  📚 Select Semester *
                </label>
                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full p-4 border-2 border-input rounded-lg appearance-none bg-white dark:bg-gray-700 focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all text-foreground font-medium"
                    data-testid="select-semester"
                  >
                    <option value="">-- Choose Your Semester --</option>
                    {semesters.map((semester) => (
                      <option key={semester.id} value={semester.id} data-testid={`option-semester-${semester.id}`}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" data-testid="icon-chevron-semester" />
                </div>
              </div>

              {/* Branch Selection */}
              {selectedSemester && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-semibold text-foreground mb-2" data-testid="label-branch">
                    🎓 Select Branch *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-4 border-2 border-input rounded-lg appearance-none bg-white dark:bg-gray-700 focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all text-foreground font-medium"
                      data-testid="select-branch"
                    >
                      <option value="">-- Choose Your Branch --</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id} data-testid={`option-branch-${branch.id}`}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" data-testid="icon-chevron-branch" />
                  </div>
                </div>
              )}

              {/* Package Selection */}
              {selectedSemester && selectedBranch && (
                <div className="animate-fadeIn">
                  <PackageSelector
                    semester={selectedSemester}
                    branch={selectedBranch}
                    onPurchase={handlePurchase}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Government Footer Notice */}
        <div className="mt-12 max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 border-l-4 border-primary rounded-lg shadow-sm p-4" data-testid="card-official-notice">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" data-testid="icon-file-text" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1" data-testid="text-notice-title">
                  📢 Official Notice
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed" data-testid="text-notice-content">
                  This portal provides authentic study materials and important questions for JUT students.
                  All content is prepared following university guidelines and examination patterns.
                  For any queries, contact the academic office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPayment && selectedPackage && (
        <PaymentModal
          package={selectedPackage}
          semester={selectedSemester}
          branch={selectedBranch}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
}
