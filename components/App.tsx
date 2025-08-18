import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { FareForm } from './components/FareForm';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { Toast } from './components/Toast';
import { Profile } from './components/Profile';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { useTheme } from './hooks/useTheme';
import { useIndexedDB } from './hooks/useIndexedDB';
import { useToast } from './hooks/useToast';
import { useProfile } from './hooks/useProfile';
import { calculateFare } from './services/fareCalculator';
import { generatePdf } from './services/pdfGenerator';
import { FareInput, FareRecord, ProfileData, ContractData } from './types';

function App() {
  const [theme, toggleTheme] = useTheme();
  const { history, saveFare, clearHistory } = useIndexedDB();
  const { toast, showToast } = useToast();
  const [calculatedFare, setCalculatedFare] = useState<number | null>(null);
  const [profile, saveProfile] = useProfile();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const contractRef = useRef<HTMLDivElement>(null);

  const handleCalculate = useCallback(async (data: FareInput): Promise<boolean> => {
    if (isNaN(data.distance) || isNaN(data.duration) || isNaN(data.pickup) || isNaN(data.wait)) {
        showToast("Please fill in all fields correctly.", "error");
        return false;
    }
    if (data.distance <= 0 || data.duration < 0 || data.pickup < 0 || data.wait < 0) {
      showToast("Inputs must be positive numbers.", 'error');
      return false;
    }

    const total = calculateFare(data);
    setCalculatedFare(total);

    const newRecord: FareRecord = {
      ...data,
      total,
      timestamp: Date.now(),
    };
    
    try {
        await saveFare(newRecord);
        showToast("Fare saved to history!", 'success');
        return true;
    } catch (err) {
        console.error(err);
        showToast("Failed to save fare.", "error");
        return false;
    }
  }, [saveFare, showToast]);
  
  const handleClearHistory = useCallback(async () => {
    await clearHistory();
    showToast("History cleared.", "success");
  }, [clearHistory, showToast]);

  const handleSaveProfile = useCallback((newProfile: ProfileData) => {
    saveProfile(newProfile);
    showToast("Profile saved successfully!", "success");
  }, [saveProfile, showToast]);

  const handleGenerateContract = useCallback((data: ContractData) => {
    setContractData(data);
  }, []);
  
  const handleDownloadPdf = useCallback(async () => {
    if (contractRef.current && contractData) {
        await generatePdf(contractRef.current, `RideContract-${contractData.customerName.replace(/\s/g, '_')}`);
    }
  }, [contractData]);

  return (
    <div className={`min-h-screen bg-[--surface-light] dark:bg-[--surface] text-[--on-surface] transition-colors duration-[var(--md-sys-transition-duration)]`}>
      <main className="container mx-auto max-w-2xl px-4 pb-12">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <FareForm onCalculate={handleCalculate} />
        <ResultDisplay fare={calculatedFare} />
        <HistoryList history={history} onClear={handleClearHistory} />
        <Profile initialProfile={profile} onSave={handleSaveProfile} />
        <ContractForm riderProfile={profile} onGenerate={handleGenerateContract} showToast={showToast} />
      </main>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      {contractData && (
        <ContractPreview 
            contractData={contractData} 
            onDownload={handleDownloadPdf}
            onClose={() => setContractData(null)}
            contractRef={contractRef}
        />
      )}
    </div>
  );
}

export default App;
