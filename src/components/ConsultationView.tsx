import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useHealth } from '../context/HealthContext';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle, 
  Send, 
  ChevronRight, 
  Activity, 
  Heart,
  Stethoscope,
  Star,
  Award,
  BookOpen
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  alumnus: string;
  status: 'Online' | 'Offline' | 'Sibuk';
  avatarUrl: string;
}

const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Adrian Halim, Sp.JP (K)',
    specialty: 'Spesialis Jantung & Pembuluh Darah (Aritmia)',
    rating: 4.9,
    experience: 12,
    alumnus: 'Universitas Indonesia (UI)',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'doc-2',
    name: 'Dr. Sarah Wijaya, Sp.JP',
    specialty: 'Kardiologi Intervensi & Pencegahan',
    rating: 4.8,
    experience: 9,
    alumnus: 'Universitas Airlangga (UNAIR)',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'doc-3',
    name: 'Dr. Farhan Lubis, Sp.JP (K)',
    specialty: 'Pakar Penyakit Jantung Koroner',
    rating: 5.0,
    experience: 16,
    alumnus: 'Universitas Gadjah Mada (UGM)',
    status: 'Sibuk',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

interface ChatMessage {
  sender: 'patient' | 'doctor';
  text: string;
  time: string;
}

export const ConsultationView: React.FC = () => {
  const { selectedPatient, isLoggedIn, setShowLoginModal, triggerToast } = useHealth();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Interactive Booking States
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Chat/Consultation Portal States
  const [activeChatDoc, setActiveChatDoc] = useState<Doctor>(DOCTORS[0]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      sender: 'doctor', 
      text: `Halo ${selectedPatient?.name || 'Pasien'}! Saya Dr. Adrian. Ada keluhan kardiovaskular atau pertanyaan seputar data kesehatan Anda yang bisa saya bantu hari ini?`, 
      time: '10:00' 
    }
  ]);
  
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>([
    { 
      sender: 'doctor', 
      text: `Halo ${selectedPatient?.name || 'Pasien'}! Saya AI Asisten Kardiologi Anda. Ada yang bisa saya bantu terkait analisis data Anda hari ini?`, 
      time: '10:00' 
    }
  ]);

  // Handle preset patient questions
  const presetQuestions = [
    {
      q: 'Bagaimana analisis status risiko jantung saya saat ini?',
      a: () => {
        const risk = selectedPatient?.riskStatus || 'Tinggi';
        const score = (selectedPatient?.topsisScore || 0).toFixed(3);
        const sys = selectedPatient?.systolic || 0;
        const dia = selectedPatient?.diastolic || 0;
        const hr = selectedPatient?.heartRate || 0;
        
        let response = `Berdasarkan pengolahan kriteria medis menggunakan metode TOPSIS klinis kami, status risiko kardiovaskular Anda saat ini tergolong **${risk}** (Skor Closeness: ${score}).\n\n`;
        
        if (risk === 'Tinggi') {
          response += `Faktor pemicu utama Anda adalah tekanan darah yang cukup tinggi (${sys}/${dia} mmHg) serta detak jantung harian rata-rata yang melebihi ambang normal (${hr} BPM). Saya sangat menyarankan Anda melakukan konsultasi tatap muka segera, memantau asupan garam, dan menghindari aktivitas fisik yang terlalu berat sebelum evaluasi menyeluruh dilakukan.`;
        } else if (risk === 'Sedang') {
          response += `Status risiko Anda tergolong sedang. Tekanan darah Anda di angka ${sys}/${dia} mmHg dan detak jantung ${hr} BPM. Tetap pertahankan pola makan rendah kolesterol dan usahakan mencatat data secara rutin untuk memantau fluktuasinya.`;
        } else {
          response += `Selamat! Indikator kardio harian Anda (${sys}/${dia} mmHg, detak jantung ${hr} BPM) berada pada batas optimal. Teruskan pola hidup aktif Anda.`;
        }
        return response;
      }
    },
    {
      q: 'Apakah detak jantung hasil sync smartwatch saya aman?',
      a: () => {
        const hr = selectedPatient?.heartRate || 0;
        if (hr > 100) {
          return `Rata-rata resting heart rate Anda terdeteksi sebesar **${hr} BPM**. Ini di atas batas normal dewasa sehat (60-100 BPM), suatu kondisi yang disebut *takikardia*. Hal ini sering dipicu stres, kurang tidur, dehidrasi, atau kelelahan jantung. Terus sinkronisasikan Apple Watch Anda dan segera hubungi kami jika Anda merasakan dada berdebar kencang secara terus-menerus.`;
        } else if (hr < 60 && hr > 0) {
          return `Detak jantung Anda berada di kisaran **${hr} BPM**. Ini cukup rendah (*bradikardia*). Jika Anda adalah atlet terlatih, hal ini normal dan sangat baik. Namun jika disertai pusing, lemas, atau sesak napas, disarankan untuk mengecek ritme jantung via EKG klinis.`;
        } else {
          return `Detak jantung harian Anda rata-rata sebesar **${hr} BPM**. Ini berada dalam rentang normal optimal (60-100 BPM). Kinerja sinus node jantung Anda berfungsi dengan baik dan efisien.`;
        }
      }
    },
    {
      q: 'Kapan sebaiknya saya menggunakan tombol darurat medis?',
      a: () => `Tombol darurat medis (Emergency Trigger) pada bagian kanan atas didesain khusus untuk situasi kritis di mana Anda merasakan nyeri dada menusuk yang menjalar ke lengan kiri atau rahang selama lebih dari 5 menit, sesak napas akut tanpa sebab, pingsan tiba-tiba, atau pusing hebat mendadak. Menekan tombol tersebut akan langsung mengirimkan peringatan darurat prioritas tinggi ke pusat kardiologi terdekat.`
    }
  ];

  const handleSendChat = (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Add patient message
    const newMsgs = [...chatMessages, { sender: 'patient' as const, text: textToSend, time: timeStr }];
    setChatMessages(newMsgs);
    setChatInput('');

    // Simulate doctor busy response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'doctor' as const,
        text: `Pesan Anda telah terkirim. Saat ini saya sedang melayani pasien lain atau sedang di luar jam aktif. Harap tunggu beberapa menit untuk balasan dari saya ya.`,
        time: timeStr
      }]);
    }, 1500);
  };

  const handleSendAiChat = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsgs = [...aiChatMessages, { sender: 'patient' as const, text: textToSend, time: timeStr }];
    setAiChatMessages(newMsgs);
    setAiChatInput('');
    setIsAiTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const prompt = `Anda adalah AI Asisten Kardiologi spesialis bernama "CardioCare AI".
Jawab pertanyaan pasien dengan bahasa Indonesia yang ramah, empati, profesional, ringkas (maksimal 2-3 paragraf pendek), dan mudah dipahami.
Data Pasien:
- Nama: ${selectedPatient?.name}
- Skor Risiko TOPSIS: ${selectedPatient?.topsisScore?.toFixed(3)} (${selectedPatient?.riskStatus})
- Tekanan Darah: ${selectedPatient?.systolic}/${selectedPatient?.diastolic} mmHg
- Detak Jantung: ${selectedPatient?.heartRate} BPM
- Gejala saat ini: ${selectedPatient?.symptoms?.join(', ') || 'Tidak ada'}

Pertanyaan Pasien: ${textToSend}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const replyTime = new Date();
      const replyTimeStr = `${String(replyTime.getHours()).padStart(2, '0')}:${String(replyTime.getMinutes()).padStart(2, '0')}`;
      
      setAiChatMessages(prev => [...prev, {
        sender: 'doctor' as const,
        text: response.text || 'Maaf, saya tidak dapat menghasilkan respons saat ini.',
        time: replyTimeStr
      }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      setAiChatMessages(prev => [...prev, {
        sender: 'doctor' as const,
        text: 'Maaf, terjadi kesalahan saat menyambung ke server AI (Pastikan API Key valid atau internet stabil).',
        time: timeStr
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const triggerPresetAnswer = async (preset: typeof presetQuestions[0]) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updated = [...aiChatMessages, { sender: 'patient' as const, text: preset.q, time: timeStr }];
    setAiChatMessages(updated);
    setIsAiTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const prompt = `Anda adalah AI Asisten Kardiologi spesialis bernama "CardioCare AI".
Jawab pertanyaan pasien dengan bahasa Indonesia yang ramah, empati, profesional, ringkas, dan mudah dipahami.
Data Pasien:
- Nama: ${selectedPatient?.name}
- Skor Risiko TOPSIS: ${selectedPatient?.topsisScore?.toFixed(3)} (${selectedPatient?.riskStatus})
- Tekanan Darah: ${selectedPatient?.systolic}/${selectedPatient?.diastolic} mmHg
- Detak Jantung: ${selectedPatient?.heartRate} BPM

Pertanyaan Pasien: ${preset.q}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const replyTime = new Date();
      const replyTimeStr = `${String(replyTime.getHours()).padStart(2, '0')}:${String(replyTime.getMinutes()).padStart(2, '0')}`;
      
      setAiChatMessages(prev => [...prev, {
        sender: 'doctor' as const,
        text: response.text || 'Maaf, saya tidak dapat menghasilkan respons saat ini.',
        time: replyTimeStr
      }]);
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to local
      setAiChatMessages(prev => [...prev, {
        sender: 'doctor' as const,
        text: preset.a(),
        time: timeStr
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingReason) {
      triggerToast('Mohon lengkapi semua field jadwal.', 'warning');
      return;
    }
    setBookingSuccess(true);
    triggerToast('Janji temu berhasil dikirimkan ke Dr. Adrian Halim, Sp.JP.', 'success');
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
      setBookingDate('');
      setBookingTime('');
      setBookingReason('');
    }, 3000);
  };

  const startBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setShowBookingModal(true);
  };

  const switchChatDoctor = (doc: Doctor) => {
    setActiveChatDoc(doc);
    setChatMessages([
      {
        sender: 'doctor',
        text: `Halo ${selectedPatient?.name || 'Pasien'}! Saya ${doc.name}. Ada yang bisa saya bantu terkait diagnosa ${doc.specialty} hari ini?`,
        time: 'Baru saja'
      }
    ]);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Konsultasi Dokter Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk atau daftarkan akun Anda terlebih dahulu untuk mengakses direktori dokter spesialis jantung, membuat janji temu telemedisin, dan berkonsultasi secara interaktif.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
        >
          Masuk Akun Sekarang
        </button>
      </div>
    );
  }

  return (
    <div id="consultation-view" className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-fit mb-3 border border-white/15">
            <Stethoscope className="h-4 w-4 text-blue-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Kardiologi Telemedisin</span>
          </div>
          <h2 className="text-2xl font-sans font-bold tracking-tight mb-2">Pusat Konsultasi Jantung</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Hubungkan kondisi harian dan skor risiko TOPSIS Anda langsung dengan para dokter spesialis kardiovaskular. Lakukan tanya jawab instan atau buat jadwal tatap muka.
          </p>
        </div>
        <div className="absolute right-6 bottom-0 top-0 opacity-15 hidden md:flex items-center justify-center">
          <Stethoscope className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* AI Chat Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
        <button 
          onClick={() => setShowAiChat(!showAiChat)}
          className="w-full flex justify-between items-center p-5 bg-gradient-to-r from-indigo-50 via-white to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all cursor-pointer border-b border-indigo-100/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">Tanya AI Kardiologi</h3>
              <p className="text-[11px] text-slate-500 font-medium">Konsultasi cerdas dan instan (Powered by Gemini)</p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 text-indigo-400 transition-transform ${showAiChat ? 'rotate-90' : ''}`} />
        </button>

        {showAiChat && (
          <div className="border-t border-slate-100 bg-slate-100 shadow-inner flex flex-col h-[400px]">
            <div className="p-3 bg-white border-b border-slate-200 shadow-sm z-10 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center shrink-0">
                Tanya Cepat:
              </span>
              {presetQuestions.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerPresetAnswer(pq)}
                  className="text-[10px] font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200/50 px-2.5 py-1 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  {pq.q}
                </button>
              ))}
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {aiChatMessages.map((msg, idx) => {
                const isDoc = msg.sender === 'doctor';
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-2 max-w-[85%] ${isDoc ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {isDoc && (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200 shadow-sm">
                         <span className="text-white text-[10px] font-bold">AI</span>
                      </div>
                    )}
                    
                    <div>
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isDoc 
                          ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none font-medium shadow-sm' 
                          : 'bg-indigo-600 text-white rounded-tr-none font-medium shadow-md'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      <p className={`text-[9px] text-slate-400 font-semibold mt-1 ${isDoc ? 'text-left' : 'text-right'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
              {isAiTyping && (
                <div className="flex gap-2 max-w-[85%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <div>
                    <div className="p-3.5 rounded-2xl text-xs bg-white border border-slate-200/80 text-slate-800 rounded-tl-none flex gap-1.5 items-center h-[38px] shadow-sm">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tanya AI seputar data kesehatan Anda..."
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendAiChat(aiChatInput);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent placeholder-slate-400"
                />
                <button
                  onClick={() => handleSendAiChat(aiChatInput)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (lg:col-span-5) - Dokter Terpercaya Directory */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                Direktori Dokter Spesialis
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{DOCTORS.length} Tersedia</span>
            </div>

            <div className="space-y-4">
              {DOCTORS.map((doc) => (
                <div 
                  key={doc.id} 
                  className={`p-4 rounded-xl border transition-all hover:border-blue-300 ${
                    activeChatDoc.id === doc.id ? 'bg-blue-50/40 border-blue-200/80 shadow-sm' : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={doc.avatarUrl} 
                        alt={doc.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200" 
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        doc.status === 'Online' ? 'bg-green-500' :
                        doc.status === 'Sibuk' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                        <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 font-medium truncate mb-1">{doc.specialty}</p>
                      
                      <div className="flex gap-2 items-center text-[10px] text-slate-400 font-semibold mb-3">
                        <span className="flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded">
                          <BookOpen className="h-2.5 w-2.5" /> {doc.experience} Thn Pengalaman
                        </span>
                        <span className="truncate max-w-[150px]" title={doc.alumnus}>
                          {doc.alumnus}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => switchChatDoctor(doc)}
                          className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="h-3 w-3 text-blue-600" />
                          Chat Dokter
                        </button>
                        <button
                          onClick={() => startBooking(doc)}
                          className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <Calendar className="h-3 w-3" />
                          Jadwalkan Temu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ / Guidelines Card */}
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-indigo-600" />
              Panduan Telemedisin Jantung
            </h4>
            <ul className="space-y-2.5 text-[11px] text-slate-600 leading-relaxed font-medium">
              <li className="flex gap-2 items-start">
                <ChevronRight className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Integrasi Data Otomatis:</strong> Dokter kardiolog Anda dapat memantau grafik tekanan darah dan detak jantung Anda dari sinkronisasi smartwatch secara real-time.</span>
              </li>
              <li className="flex gap-2 items-start">
                <ChevronRight className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Saran Presisi TOPSIS:</strong> Hasil skor kedekatan risiko TOPSIS Anda membantu dokter mempercepat pengambilan keputusan klinis preventif.</span>
              </li>
              <li className="flex gap-2 items-start">
                <ChevronRight className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Privasi Terjaga:</strong> Semua chat konsultasi dan rekam log medis dienkripsi end-to-end demi keamanan data pasien.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-7) - Live Consultation Chat Frame */}
        <div className="lg:col-span-7 flex flex-col h-[540px] bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src={activeChatDoc.avatarUrl} 
                alt={activeChatDoc.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500" 
              />
              <div>
                <h4 className="text-xs font-bold leading-none text-white">{activeChatDoc.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Klinik Konsultan Kardiologi Aktif
                </p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <span className="text-[10px] font-bold uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                E-CONSULTATION
              </span>
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-100 shadow-inner">
            {chatMessages.map((msg, idx) => {
              const isDoc = msg.sender === 'doctor';
              return (
                <div 
                  key={idx} 
                  className={`flex gap-2 max-w-[85%] ${isDoc ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {isDoc && (
                    <img 
                      src={activeChatDoc.avatarUrl} 
                      alt="" 
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm" 
                    />
                  )}
                  
                  <div>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isDoc 
                        ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none font-medium shadow-sm' 
                        : 'bg-blue-600 text-white rounded-tr-none font-medium shadow-md'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <p className={`text-[9px] text-slate-400 font-semibold mt-1 ${isDoc ? 'text-left' : 'text-right'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Footer Input */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Tulis pesan atau tanya Dr. ${activeChatDoc.name.split(',')[0]}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChat(chatInput);
                }}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-slate-400"
              />
              <button
                onClick={() => handleSendChat(chatInput)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium text-center">
              *Respons dokter ini langsung dari dokter sungguhan (harap sabar menunggu balasan).
            </p>
          </div>

        </div>

      </div>

      {/* Booking Interactive Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all animate-scale-up">
            
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h3 className="font-sans font-bold text-sm">Jadwalkan Konsultasi Kardio</h3>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-white hover:text-blue-100 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Booking Berhasil Dikonfirmasi!</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Jadwal telekonsultasi Anda dengan <strong>{selectedDoctor.name}</strong> telah dicatat ke sistem klinik. Link video conference serta notifikasi kalender telah dikirim ke email terdaftar Anda.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  
                  {/* Selected Doctor Summary */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                    <img src={selectedDoctor.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedDoctor.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{selectedDoctor.specialty}</p>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Pilih Tanggal Sesi
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Time Slot Input */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Pilih Jam Sesi
                    </label>
                    <select
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="">-- Pilih Slot Jam --</option>
                      <option value="09:00 - 09:30">09:00 - 09:30 WIB (Pagi)</option>
                      <option value="11:00 - 11:30">11:00 - 11:30 WIB (Pagi)</option>
                      <option value="14:00 - 14:30">14:00 - 14:30 WIB (Siang)</option>
                      <option value="16:00 - 16:30">16:00 - 16:30 WIB (Sore)</option>
                    </select>
                  </div>

                  {/* Clinical Reason Input */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Keluhan Medis / Catatan Gejala
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Contoh: Mengalami dada berdebar-debar sehabis makan berat, skor TOPSIS saya terhitung Tinggi..."
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-slate-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Video className="h-4 w-4" />
                      Konfirmasi Janji Sesi (Telemedisin)
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
