
import React, { useState } from 'react';
import { UserProfile, TreatmentStatus } from '../types';
import { Scale, Ruler, Apple, Stethoscope, ChevronLeft } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave, onCancel }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-card border border-slate-50 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="font-black text-slate-800 text-xl tracking-tight">编辑健康档案</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">昵称</label>
            <input
              type="text"
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-celadon-500/20"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">年龄</label>
            <input
              type="number"
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-bold text-slate-700 outline-none"
              value={profile.age}
              onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">癌种与治疗方案</label>
          <input
            type="text"
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-3 text-[15px] font-bold text-slate-700 outline-none"
            value={profile.cancerType}
            onChange={e => setProfile({...profile, cancerType: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-slate-50 text-center space-y-1">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">身高</div>
            <input
              type="number"
              className="w-full text-center text-lg font-black text-slate-800 bg-transparent outline-none"
              value={profile.height || ''}
              placeholder="--"
              onChange={e => setProfile({...profile, height: parseFloat(e.target.value)})}
            />
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-50 text-center space-y-1">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">体重</div>
            <input
              type="number"
              className="w-full text-center text-lg font-black text-slate-800 bg-transparent outline-none"
              value={profile.weight || ''}
              placeholder="--"
              onChange={e => setProfile({...profile, weight: parseFloat(e.target.value)})}
            />
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-50 text-center space-y-1">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">营养</div>
            <select
              className="w-full text-center text-[13px] font-black text-slate-800 bg-transparent outline-none appearance-none"
              value={profile.nutritionStatus || ''}
              onChange={e => setProfile({...profile, nutritionStatus: e.target.value})}
            >
              <option value="">请选择</option>
              <option value="良好">良好</option>
              <option value="中等">中等</option>
              <option value="较差">较差</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">详细病情记录</label>
          <textarea
            className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] px-5 py-4 text-sm font-medium text-slate-600 h-32 resize-none outline-none"
            placeholder="记录关键医学信息，仅存储在您的设备中..."
            value={profile.detailedIllness || ''}
            onChange={e => setProfile({...profile, detailedIllness: e.target.value})}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-celadon-900 text-white font-black py-5 rounded-[2rem] shadow-glaze active:scale-[0.98] transition-all"
      >
        同步健康档案
      </button>
    </form>
  );
};

export default ProfileForm;
