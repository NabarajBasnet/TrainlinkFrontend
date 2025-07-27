import { CheckCircle } from 'lucide-react';
import { Badge } from './badge';

interface VerificationBadgeProps {
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VerificationBadge = ({ 
  isVerified = false, 
  size = 'md', 
  showText = false 
}: VerificationBadgeProps) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
      <CheckCircle className={`${sizeClasses[size]} mr-1`} />
      {showText && <span>Verified</span>}
    </Badge>
  );
}; 