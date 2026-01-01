
import React from 'react';
import { 
  Heart, User, Briefcase, Activity, Utensils, Moon, Baby, Home,
  BookOpen, MessageCircle, Settings, ShieldAlert, Flame, Stethoscope,
  Calendar, Clock, RotateCw, Scale, Ruler, Apple, ShieldCheck,
  AlertTriangle, FileText, ExternalLink
} from 'lucide-react';
import { Category, SocialPost } from './types';

export const COLORS = {
  celadon: '#94D6DA',
  deepForest: '#2F5D62',
  moonWhite: '#EEF2F2',
  accentGreen: '#10B981',
  softGray: '#64748B'
};

export const SHARE_CATEGORIES = [
  { id: 'all', title: '全部', emoji: '🌟' },
  { id: '美食', title: '美食', emoji: '🥘' },
  { id: '美文', title: '美文', emoji: '✍️' },
  { id: '经验', title: '经验', emoji: '💡' },
];

export const LEGAL_TEXTS = {
  PRIVACY: `小青卡非常重视您的隐私。您的健康资料仅存储于本地。`,
  RISK_WARNING: `风险提示：AI建议不能替代医生诊断，重大决策请务必咨询您的主治医师。`
};

export const CATEGORIES: Category[] = [
  { id: 'body-image', title: '身体形象与自我认知', description: '脱发管理、外观变化适应及社交自信重建。', icon: 'user', color: 'celadon', subtopics: ['脱发管理', '外观变化'] },
  { id: 'work-life', title: '工作与经济管理', description: '化疗期间的工作能力评估与返工计划。', icon: 'briefcase', color: 'celadon', subtopics: ['经济补助', '劳动权益'] },
  { id: 'exercise', title: '运动与康复指导', description: '按治疗阶段定制的运动方案。', icon: 'activity', color: 'celadon', subtopics: ['术后康复', '水肿预防'] },
  { id: 'intimacy', title: '两性关系与亲密生活', description: '亲密生活安全指南。', icon: 'heart', color: 'celadon', subtopics: ['安全边界', '伴侣支持'] }
];

export const getIcon = (iconName: string, className?: string) => {
  const icons: any = { heart: Heart, user: User, briefcase: Briefcase, activity: Activity, utensils: Utensils, moon: Moon, baby: Baby, home: Home, book: BookOpen, talk: MessageCircle, settings: Settings, calendar: Calendar, clock: Clock, repeat: RotateCw, scale: Scale, ruler: Ruler, apple: Apple, shield: ShieldCheck, alert: AlertTriangle, file: FileText };
  const Icon = icons[iconName] || Stethoscope;
  return <Icon className={className} />;
};

export const MOCK_POSTS: SocialPost[] = [
  { id: '1', author: '许士杰', content: '《不屈的生命——“胰腺”生机之抗癌杂记》', likes: 1205, tags: ['美文'], timestamp: Date.now(), coverEmoji: '📖' },
  { id: '2', author: '小青营养师', content: '高蛋白虾仁配鲜蔬。化疗期免疫力的守护者。', likes: 892, tags: ['美食'], timestamp: Date.now(), coverEmoji: '🦐' }
];
