
import React, { useState, useEffect } from 'react';
import { COLORS, CATEGORIES, getIcon, SHARE_CATEGORIES, LEGAL_TEXTS } from './constants';
import { UserProfile, Category, SocialPost, DaysMatterEvent, ChatMessage } from './types';
import CategoryCard from './components/CategoryCard';
import AssistantModal from './components/AssistantModal';
import SocialEditorModal from './components/SocialEditorModal';
import ProfileForm from './components/ProfileForm';
import DaysMatterModal from './components/DaysMatterModal';
import Auth from './components/Auth';
import { supabase } from './services/supabaseClient';
import { 
  Heart, Home, User as UserIcon, Plus, BookOpen, MessageSquare, ChevronRight,
  Search, Settings, Waves, Trash2, ArrowLeft, Sparkles, Info, Calendar,
  Shield, AlertTriangle, LogOut, X, Loader2, Share2, MoreHorizontal,
  Star, Bookmark, ChevronDown, Clock, MessageCircle, Heart as HeartIcon,
  Bookmark as BookmarkIcon, Send as SendIcon, Eye, ArrowUpRight
} from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: '小青友', age: 35, gender: 'FEMALE', cancerType: '乳腺癌',
  treatmentType: ['化疗'], treatmentStatus: 'TREATMENT',
  treatmentStartDate: '2024-11-20', currentCycle: 2, partnerStatus: '已婚',
  fertilityConcerns: true, height: 165, weight: 55, nutritionStatus: '良好'
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'know' | 'talk' | 'self'>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDaysMatterOpen, setIsDaysMatterOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [shareCategory, setShareCategory] = useState('all');
  const [knowCategory, setKnowCategory] = useState('all');
  const [daysMatterEvents, setDaysMatterEvents] = useState<DaysMatterEvent[]>([]);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [legalView, setLegalView] = useState<'PRIVACY' | 'RISK' | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchData();
        loadLocalData(session.user.id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchData();
        loadLocalData(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const { data: postsData } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false });
      if (postsData) setPosts(postsData.map(p => ({ ...p, fullBody: p.full_body })));
      
      const { data: articlesData } = await supabase.from('knowledge_articles').select('*').order('created_at', { ascending: false });
      if (articlesData) setKnowledgeArticles(articlesData);
    } catch (err) {
      console.error("Fetch data failed:", err);
    }
  };

  const loadLocalData = (uid: string) => {
    const savedProfile = localStorage.getItem(`user_profile_${uid}`);
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    const savedDays = localStorage.getItem(`days_matter_${uid}`);
    if (savedDays) setDaysMatterEvents(JSON.parse(savedDays));
  };

  useEffect(() => {
    if (session) {
      localStorage.setItem(`user_profile_${session.user.id}`, JSON.stringify(userProfile));
      localStorage.setItem(`days_matter_${session.user.id}`, JSON.stringify(daysMatterEvents));
    }
  }, [userProfile, daysMatterEvents, session]);

  const filteredPosts = shareCategory === 'all' ? posts : posts.filter(p => p.tags?.includes(shareCategory));
  const filteredArticles = knowCategory === 'all' ? knowledgeArticles : knowledgeArticles.filter(a => a.category_id === knowCategory);

  const renderKnowledgeTab = () => (
    <div className="flex flex-col h-full bg-moonWhite">
      <div className="px-5 pt-7 pb-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">吾知百科</h2>
        <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setKnowCategory('all')} className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all ${knowCategory === 'all' ? 'bg-celadon-900 text-white shadow-glaze' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>全部</button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setKnowCategory(cat.id)} className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all border ${knowCategory === cat.id ? 'bg-celadon-900 text-white border-celadon-900 shadow-glaze' : 'bg-white text-slate-400 border-slate-100 shadow-sm'}`}>
              {cat.title.split('与')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input className="w-full bg-white border-0 shadow-card rounded-2xl py-4 pl-12 pr-4 text-sm outline-none font-medium placeholder:text-slate-200" placeholder="搜索权威康复建议..." />
        </div>

        {filteredArticles.map(art => (
          <div key={art.id} onClick={() => setSelectedArticle(art)} className="bg-white p-4 rounded-3xl shadow-card flex items-center gap-4 card-glaze active:scale-[0.98] transition-all cursor-pointer group border border-transparent hover:border-celadon-100">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
               {art.image_url ? (
                 <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-2xl bg-celadon-50">{getIcon(art.icon, 'w-8 h-8 text-celadon-900')}</div>
               )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-celadon-600 bg-celadon-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">{art.tag}</span>
              </div>
              <h4 className="font-bold text-slate-800 mt-1 line-clamp-2 leading-tight group-hover:text-celadon-900">{art.title}</h4>
              <div className="flex items-center gap-1 text-[9px] text-slate-300 font-bold uppercase mt-1.5"><Eye className="w-2.5 h-2.5" /> 2,401 浏览</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-200" />
          </div>
        ))}
        <div className="h-24"></div>
      </div>
    </div>
  );

  const renderArticleDetail = () => {
    if (!selectedArticle) return null;

    const renderStyledContent = (text: string) => {
      if (!text) return null;
      return text.split('\n\n').map((block, idx) => {
        if (block.startsWith('【') && block.includes('】')) {
          const [title, ...rest] = block.split('】');
          return (
            <div key={idx} className="mb-8 group">
              <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-celadon rounded-full group-hover:scale-y-125 transition-transform"></span>
                {title.replace('【', '')}
              </h3>
              <p className="text-slate-600 leading-[1.8] font-medium text-[15px]">{rest.join('】')}</p>
            </div>
          );
        }
        return (
          <p key={idx} className="text-slate-600 leading-[1.9] font-medium text-[15px] mb-6 last:mb-0">
            {block}
          </p>
        );
      });
    };

    return (
      <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        <header className="absolute top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
          <button onClick={() => setSelectedArticle(null)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all pointer-events-auto shadow-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex gap-2 pointer-events-auto">
             <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg"><Share2 className="w-5 h-5" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-20 bg-crackle">
           <div className="w-full h-[40vh] relative overflow-hidden bg-slate-100">
             {selectedArticle.image_url ? <img src={selectedArticle.image_url} className="w-full h-full object-cover" /> : <div className="