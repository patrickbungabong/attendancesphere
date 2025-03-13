
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  BarChart, 
  Settings,
  GraduationCap,
  FileText
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active }) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1 font-normal",
        active ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
      )}
      onClick={() => navigate(href)}
    >
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <span>{label}</span>
      </div>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'owner';
  
  const teacherLinks = [
    { icon: <Clock size={20} />, label: 'Sessions', href: '/sessions' },
    { icon: <Calendar size={20} />, label: 'My Schedule', href: '/schedule' },
    { icon: <DollarSign size={20} />, label: 'My Earnings', href: '/earnings' },
  ];
  
  const adminLinks = [
    { icon: <Clock size={20} />, label: 'Sessions', href: '/sessions' },
    { icon: <Calendar size={20} />, label: 'Schedule', href: '/schedule' },
    { icon: <GraduationCap size={20} />, label: 'Students', href: '/students' },
    { icon: <Users size={20} />, label: 'Teachers', href: '/teachers' },
    { icon: <DollarSign size={20} />, label: 'Payments', href: '/payments' },
  ];
  
  const ownerLinks = [
    { icon: <BarChart size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Users size={20} />, label: 'Teachers', href: '/teachers' },
    { icon: <DollarSign size={20} />, label: 'Finance', href: '/finance' },
    { icon: <FileText size={20} />, label: 'Reports', href: '/reports' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];
  
  const links = isOwner ? ownerLinks : (isAdmin ? adminLinks : teacherLinks);
  
  return (
    <div className="w-64 h-full border-r border-border bg-white shadow-sm overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-xl font-bold text-primary">AttendanceSphere</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-xs uppercase font-semibold text-muted-foreground mb-2 px-4">
            {user?.role.toUpperCase()}
          </p>
          <div className="space-y-1">
            {links.map((link) => (
              <SidebarItem
                key={link.href}
                icon={link.icon}
                label={link.label}
                href={link.href}
                active={location.pathname === link.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
